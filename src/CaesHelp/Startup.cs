﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNetCore.Security.CAS;
using CaesHelp.Models;
using CaesHelp.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using MvcReact;

namespace CaesHelp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AuthSettings>(Configuration.GetSection("Authentication"));

            //This was killing temp data passing to error controller
            //services.Configure<CookiePolicyOptions>(options =>
            //{
            //    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
            //    options.CheckConsentNeeded = context => true;
            //    options.MinimumSameSitePolicy = SameSiteMode.None;
            //});

            services.AddScoped<IIdentityService, IdentityService>();

            // add cas auth backed by a cookie signin scheme
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie(options =>
            {
                options.LoginPath = new PathString("/login");
            })
            .AddCAS(options =>
            {
                options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.CasServerUrlBase = Configuration["Authentication:CasBaseUrl"];
                options.Events.OnTicketReceived = async context =>
                {
                    var c = context;

                    var identity = (ClaimsIdentity)context.Principal.Identity;

                    // kerb comes across in name & name identifier
                    var kerb = identity?.FindFirst(ClaimTypes.NameIdentifier).Value;

                    if (string.IsNullOrWhiteSpace(kerb)) return;

                    var identityService = context.HttpContext.RequestServices.GetRequiredService<IIdentityService>();

                    var user = await identityService.GetByKerberos(kerb);

                    if (user == null)
                    {
                        throw new InvalidOperationException("Could not retrieve user information from IAM");
                    }

                    identity.RemoveClaim(identity.FindFirst(ClaimTypes.NameIdentifier));
                    identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));

                    identity.RemoveClaim(identity.FindFirst(ClaimTypes.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Name, user.Id));

                    identity.AddClaim(new Claim(ClaimTypes.GivenName, user.FirstName));
                    identity.AddClaim(new Claim(ClaimTypes.Surname, user.LastName));
                    identity.AddClaim(new Claim("name", user.Name));
                    identity.AddClaim(new Claim(ClaimTypes.Email, user.Email));

                    await Task.FromResult(0);
                };
            });

            services.Configure<EmailSettings>(Configuration.GetSection("Email"));
            services.Configure<ComputerSupport>(Configuration.GetSection("ComputerSupport"));

            services.AddTransient<IEmailService, EmailService>();

            services.AddMvc();

            services.AddMvcReact();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IOptions<MvcReactOptions> mvcReactOptions)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseMvcReactStaticFiles();
            app.UseCookiePolicy();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(routes =>
            {
                if (env.IsDevelopment())
                {
                    routes.MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}",
                        constraints: new { controller = mvcReactOptions.Value.ExcludeHmrPathsRegex });
                }
                else
                {
                    routes.MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}");
                }
            });

            // SPA needs to kick in for all paths during development
            app.UseMvcReact();
        }
    }
}
