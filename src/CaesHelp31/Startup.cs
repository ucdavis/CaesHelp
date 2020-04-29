using CaesHelp.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CaesHelp31
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

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // SRK: For now, calls devpack and then listens on localhost:8083 to proxy requests back for a dev server
                app.UseNpmScriptAndProxyDevelopmentServer(npmScript: "devpack");
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            // app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                // endpoints.MapControllerRoute(
                //     name: "catch-all",
                //     pattern: "{*url}",
                //     defaults: new { controller = "Home", action = "Gone" });
            });

            // SRK: want to 404 and not fallback to spa somehow
            // app.Map("/spa", app =>
            // {
            //     app.UseSpa(spa =>
            //     {
            //         // SRK: Do i need to wwwroot?
            //         spa.Options.SourcePath = "wwwroot/dist";

            //         if (env.IsDevelopment())
            //         {
            //             // SRK: Changed to just run the webpack dev build script
            //             spa.UseReactDevelopmentServer(npmScript: "webpack");
            //             // spa.UseProxyToSpaDevelopmentServer("http://localhost:8083");
            //         }
            //     });
            // });

        }
    }
}
