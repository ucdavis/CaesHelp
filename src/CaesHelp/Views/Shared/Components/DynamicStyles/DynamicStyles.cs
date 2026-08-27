using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace CaesHelp.Views.Shared.Components.DynamicStyles
{
    [ViewComponent(Name = "DynamicStyles")]
    public class DynamicStyles : ViewComponent
    {
        private const string ManifestPath = "ClientApp/build/vite-manifest.json";
        private const string EntryPath = "src/index.tsx";
        private readonly IFileProvider _fileProvider;

        public DynamicStyles(IWebHostEnvironment environment)
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

            if (!manifest.RootElement.TryGetProperty(EntryPath, out var entry) ||
                !entry.TryGetProperty("isEntry", out var isEntry) ||
                isEntry.ValueKind != JsonValueKind.True)
            {
                throw new InvalidOperationException($"The Vite manifest does not contain the expected entry '{EntryPath}'.");
            }

            var styles = new List<string>();
            var seenStyles = new HashSet<string>(StringComparer.Ordinal);
            var seenChunks = new HashSet<string>(StringComparer.Ordinal) { EntryPath };

            AddStyles(entry, styles, seenStyles);
            AddImportedChunkStyles(manifest.RootElement, entry, styles, seenStyles, seenChunks);

            return View(styles.ToArray());
        }

        private void AddImportedChunkStyles(
            JsonElement manifest,
            JsonElement chunk,
            ICollection<string> styles,
            ISet<string> seenStyles,
            ISet<string> seenChunks)
        {
            if (!chunk.TryGetProperty("imports", out var imports) || imports.ValueKind != JsonValueKind.Array)
            {
                return;
            }

            foreach (var import in imports.EnumerateArray())
            {
                var importPath = import.GetString();
                if (string.IsNullOrWhiteSpace(importPath) || !seenChunks.Add(importPath))
                {
                    continue;
                }

                if (!manifest.TryGetProperty(importPath, out var importedChunk))
                {
                    throw new InvalidOperationException($"The Vite manifest import '{importPath}' was not found.");
                }

                AddImportedChunkStyles(manifest, importedChunk, styles, seenStyles, seenChunks);
                AddStyles(importedChunk, styles, seenStyles);
            }
        }

        private void AddStyles(JsonElement chunk, ICollection<string> styles, ISet<string> seenStyles)
        {
            if (!chunk.TryGetProperty("css", out var cssFiles) || cssFiles.ValueKind != JsonValueKind.Array)
            {
                return;
            }

            foreach (var cssFile in cssFiles.EnumerateArray())
            {
                var assetPath = NormalizeAssetPath(cssFile.GetString());
                if (seenStyles.Add(assetPath))
                {
                    if (!_fileProvider.GetFileInfo($"ClientApp/build/{assetPath}").Exists)
                    {
                        throw new FileNotFoundException($"The Vite stylesheet '{assetPath}' was not found in the production build.");
                    }

                    styles.Add(assetPath);
                }
            }
        }

        private static string NormalizeAssetPath(string assetPath)
        {
            var normalizedPath = assetPath?.Replace('\\', '/').TrimStart('/');
            if (string.IsNullOrWhiteSpace(normalizedPath) || normalizedPath.Contains("..", StringComparison.Ordinal))
            {
                throw new InvalidOperationException("The Vite manifest contains an invalid stylesheet path.");
            }

            return normalizedPath;
        }
    }
}
