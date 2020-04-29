using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace CaesHelp.Extensions
{
    public static class NpmMiddlewareExtensions
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="appBuilder">The <see cref="IApplicationBuilder"/>.</param>
        /// <param name="npmScript">The name of the script in your package.json file that launches the create-react-app server.</param>

        public static void UseNpmScriptAndProxyDevelopmentServer(
            this IApplicationBuilder appBuilder,
            string npmScript)
        {
            if (appBuilder == null)
            {
                throw new ArgumentNullException(nameof(appBuilder));
            }

            // Folloing the patten spa services uses
            NpmMiddleware.Attach(appBuilder, npmScript);

        }
    }

    internal static class NpmMiddleware
    {
        private const string LogCategoryName = "Microsoft.AspNetCore.SpaServices";
        private static TimeSpan RegexMatchTimeout = TimeSpan.FromSeconds(5); // This is a development-time only feature, so a very long timeout is fine

        public static void Attach(
            IApplicationBuilder appBuilder,
            string scriptName)
        {
            if (string.IsNullOrEmpty(scriptName)) {
                throw new ArgumentException("Cannot be null or empty", nameof(scriptName));
            }

            var sourcePath = "wwwroot/dist"; //TODO: get from options
            var pkgManagerCommand = "npm"; // get from options
            var devServerPort = 8083; //

            var loggerFactory = appBuilder.ApplicationServices.GetService<ILoggerFactory>();
            var logger = loggerFactory != null
                ? loggerFactory.CreateLogger(LogCategoryName)
                : NullLogger.Instance;

            // start the npm script and attach to middleware pipeline
            var applicationStoppingToken = appBuilder.ApplicationServices.GetRequiredService<IHostApplicationLifetime>().ApplicationStopping;
            // var logger = LoggerFinder.GetOrCreateLogger(appBuilder, LogCategoryName);
            var diagnosticSource = appBuilder.ApplicationServices.GetRequiredService<DiagnosticSource>();

            var portTask = StartNpmScript(sourcePath, scriptName, pkgManagerCommand, devServerPort, logger, diagnosticSource, applicationStoppingToken);
            // TODO: start npm task

            // Everything we proxy is hardcoded to target http://localhost because:
            // - the requests are always from the local machine (we're not accepting remote
            //   requests that go directly to the create-react-app server)
            // - given that, there's no reason to use https, and we couldn't even if we
            //   wanted to, because in general the create-react-app server has no certificate
            var targetUriTask = portTask.ContinueWith(
                task => new UriBuilder("http", "localhost", task.Result).Uri);

            // SRK: using default spa options

            // Use the options configured in DI (or blank if none was configured). We have to clone it
            // otherwise if you have multiple UseSpa calls, their configurations would interfere with one another.
            var optionsProvider = appBuilder.ApplicationServices.GetService<IOptions<SpaOptions>>();
            var options = new SpaOptions();
            options.SourcePath = "wwwroot/dist";

            var spaBuilder = new MySpaBuilder(appBuilder, options);

            SpaProxyingExtensions.UseProxyToSpaDevelopmentServer(spaBuilder, () =>
            {
                // On each request, we create a separate startup task with its own timeout. That way, even if
                // the first request times out, subsequent requests could still work.
                var timeout = spaBuilder.Options.StartupTimeout;
                return targetUriTask.WithTimeout(timeout,
                    $"The create-react-app server did not start listening for requests " +
                    $"within the timeout period of {timeout.Seconds} seconds. " +
                    $"Check the log output for error information.");
            });
        }

        private static async Task<int> StartNpmScript(
    string sourcePath, string scriptName, string pkgManagerCommand, int portNumber, ILogger logger, DiagnosticSource diagnosticSource, CancellationToken applicationStoppingToken)
        {
            if (portNumber == default(int))
            {
                // TODO: for now, hardcode port
                portNumber = 8083;
                // portNumber = TcpPortFinder.FindAvailablePort();
            }
            
            logger.LogInformation($"Starting create-react-app server on port {portNumber}...");

            var envVars = new Dictionary<string, string>
            {
                { "WEBPACKPORT", portNumber.ToString() }, // optionally set webpack to run on different port (use portfinder?)
                { "BROWSER", "none" }, // We don't want create-react-app to open its own extra browser window pointing to the internal dev server port
            };
            var scriptRunner = new NodeScriptRunner(
                sourcePath, scriptName, null, envVars, pkgManagerCommand, diagnosticSource, applicationStoppingToken);
            scriptRunner.AttachToLogger(logger);

            using (var stdErrReader = new EventedStreamStringReader(scriptRunner.StdErr))
            {
                try
                {
                    // Although the React dev server may eventually tell us the URL it's listening on,
                    // it doesn't do so until it's finished compiling, and even then only if there were
                    // no compiler warnings. So instead of waiting for that, consider it ready as soon
                    // as it starts listening for requests.
                    await scriptRunner.StdOut.WaitForMatch(
                        new Regex("Project is running", RegexOptions.None, RegexMatchTimeout));
                }
                catch (EndOfStreamException ex)
                {
                    throw new InvalidOperationException(
                        $"The {pkgManagerCommand} script '{scriptName}' exited without indicating that the " +
                        $"create-react-app server was listening for requests. The error output was: " +
                        $"{stdErrReader.ReadAsString()}", ex);
                }
            }

            return portNumber;
        }
    }

    internal class MySpaBuilder : ISpaBuilder
    {
        public IApplicationBuilder ApplicationBuilder { get; }

        public SpaOptions Options { get; }

        public MySpaBuilder(IApplicationBuilder applicationBuilder, SpaOptions options)
        {
            ApplicationBuilder = applicationBuilder
                ?? throw new ArgumentNullException(nameof(applicationBuilder));

            Options = options
                ?? throw new ArgumentNullException(nameof(options));
        }
    }
}