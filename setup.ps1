# Create necessary directories
$directories = @(
    "server/src/controllers",
    "server/src/routes",
    "server/src/models",
    "server/src/config",
    "server/uploads",
    "client/public",
    "client/src/components",
    "client/src/pages",
    "client/src/hooks",
    "client/src/context",
    "client/src/services"
)

# Create directories
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir
}

# Create basic files
$files = @{
    ".gitignore" = @(
        "node_modules/",
        ".env",
        "*.log",
        "dist/",
        "build/"
    )
    "README.md" = @(
        "# NotebookLM Clone",
        "",
        "A Google NotebookLM clone built with React and Node.js",
        "",
        "## Features",
        "- PDF Upload and Viewing",
        "- Interactive Chat Interface",
        "- AI-powered Document Analysis",
        "- Citation and Reference System",
        "",
        "## Getting Started",
        "1. Clone the repository",
        "2. Install dependencies: `npm install` in both `client` and `server` directories",
        "3. Set up environment variables",
        "4. Run the development servers"
    )
}

# Write files
foreach ($file in $files.GetEnumerator()) {
    $filePath = $file.Key
    $content = $file.Value -join "`n"
    Set-Content -Path $filePath -Value $content
}

Write-Host "Project structure created successfully!"
