# Regenerates the PNG icons and the link-preview image with Microsoft Edge (headless).
# Run from the project folder after changing your name, role or OS name in js/data.js:
#   powershell -ExecutionPolicy Bypass -File tools\make-images.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw "Microsoft Edge was not found." }

$assets = Join-Path $root "assets"
New-Item -ItemType Directory -Force $assets | Out-Null
$tools = (Join-Path $root "tools") -replace "\\", "/"

# A throwaway Edge profile, so this never touches your normal browser.
$profileDir = Join-Path $env:TEMP "portfolio-image-render"

function Save-Shot($page, $width, $height, $out, $transparent) {
  if (Test-Path $out) { Remove-Item $out }
  $edgeArgs = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                "--user-data-dir=`"$profileDir`"", "--virtual-time-budget=4000",
                "--window-size=$width,$height", "--screenshot=`"$out`"")
  if ($transparent) { $edgeArgs += "--default-background-color=00000000" }
  $edgeArgs += "`"file:///$tools/$page`""
  Start-Process -FilePath $edge -ArgumentList $edgeArgs -Wait -WindowStyle Hidden
  if (Test-Path $out) { Write-Host "Saved $out" } else { throw "Edge did not create $out" }
}

Save-Shot "og-image.html" 1200 630 (Join-Path $assets "og-image.png") $false
Save-Shot "icon.html?size=180&full" 180 180 (Join-Path $assets "apple-touch-icon.png") $false
Save-Shot "icon.html?size=32" 32 32 (Join-Path $assets "favicon-32.png") $true
