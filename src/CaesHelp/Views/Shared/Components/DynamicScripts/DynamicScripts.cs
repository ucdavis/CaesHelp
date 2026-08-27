using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace CaesHelp.Views.Shared.Components.DynamicScripts
{
    [ViewComponent(Name = "DynamicScripts")]
    public class DynamicScripts : ViewComponent
    {
        private const string ManifestPath = "ClientApp/build/vite-manifest.json";
        private const string EntryPath = "src/index.tsx";
        private readonly IFileProvider _fileProvider;

        public DynamicScripts(IWebHostEnvironment environment)
        {
            _fileProvider = environment.ContentRootFileProvider;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var manifestFile = _fileProvider.GetFileInfo(ManifestPath);
            if (!manifestFile.Exists)
            {
                throw new FileNotFoundException("The Vite manifest was not found. Run the production client build before starting the application.", ManifestPath);
            }

            await using var stream = manifestFile.CreateReadStream();
            using var manifest = await JsonDocument.ParseAsync(stream);

            var scriptPath = GetEntryAssetPath(manifest.RootElement);
            return View(new[] { scriptPath });
        }

        private string GetEntryAssetPath(JsonElement manifest)
        {
            if (!manifest.TryGetProperty(EntryPath, out var entry) ||
                !entry.TryGetProperty("isEntry", out var isEntry) ||
                isEntry.ValueKind != JsonValueKind.True ||
                !entry.TryGetProperty("file", out var file))
            {
                throw new InvalidOperationException($"The Vite manifest does not contain the expected entry '{EntryPath}'.");
            }

            var assetPath = file.GetString()?.Replace('\\', '/').TrimStart('/');
            if (string.IsNullOrWhiteSpace(assetPath) || assetPath.Contains("..", StringComparison.Ordinal))
            {
                throw new InvalidOperationException($"The Vite manifest entry '{EntryPath}' contains an invalid asset path.");
            }

            if (!_fileProvider.GetFileInfo($"ClientApp/build/{assetPath}").Exists)
            {
                throw new FileNotFoundException($"The Vite entry asset '{assetPath}' was not found in the production build.");
            }

            return assetPath;
        }
    }
}
