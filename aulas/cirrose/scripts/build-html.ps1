# build-html.ps1 — Concatena slides/ em index.html
# Lê a ordem de _manifest.js (source of truth).
# Run: .\scripts\build-html.ps1  (de dentro de aulas/cirrose)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$slidesDir = Join-Path $root "slides"
$template = Join-Path $root "index.template.html"
$output = Join-Path $root "index.html"
$manifestPath = Join-Path $slidesDir "_manifest.js"

if (-not (Test-Path $manifestPath)) {
  Write-Error "Manifest not found: $manifestPath"
  exit 1
}

$manifestContent = Get-Content $manifestPath -Raw -Encoding UTF8
$files = [regex]::Matches($manifestContent, "file:\s*'([^']+)'") | ForEach-Object { $_.Groups[1].Value }

if ($files.Count -eq 0) {
  Write-Error "No slide files found in manifest"
  exit 1
}

foreach ($f in $files) {
  $p = Join-Path $slidesDir $f
  if (-not (Test-Path $p)) {
    Write-Error "Missing slide file: $f"
    exit 1
  }
}

# ── Ghost canary: block build with obsolete content ──
# Reads .ghost-canary and checks slide files on disk before concatenating.
# If a ghost pattern matches, the build ABORTS before generating index.html.
$canaryPath = Join-Path $root ".ghost-canary"
if (Test-Path $canaryPath) {
  $ghostFails = @()
  foreach ($line in (Get-Content $canaryPath -Encoding UTF8)) {
    $line = $line.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { continue }
    $parts = $line -split '\|', 2
    if ($parts.Count -ne 2) { continue }
    $ghostFile = $parts[0]
    $ghostPattern = $parts[1]
    $ghostPath = Join-Path $slidesDir $ghostFile
    if (Test-Path $ghostPath) {
      $content = Get-Content $ghostPath -Raw -Encoding UTF8
      if ($content -match $ghostPattern) {
        $ghostFails += "  -> $ghostFile matches '$ghostPattern'"
      }
    }
  }
  if ($ghostFails.Count -gt 0) {
    Write-Host ""
    Write-Host "!! BUILD ABORTADO: Conteudo fantasma detectado !!" -ForegroundColor Red
    Write-Host "!! Slide contem padrao obsoleto listado em .ghost-canary." -ForegroundColor Red
    Write-Host "!! Isso indica rollback acidental. Verifique o conteudo." -ForegroundColor Red
    Write-Host ""
    foreach ($fail in $ghostFails) { Write-Host $fail -ForegroundColor Red }
    Write-Host ""
    Write-Host "Canary: $canaryPath" -ForegroundColor Yellow
    exit 1
  }
}

$slides = ($files | ForEach-Object {
  Get-Content (Join-Path $slidesDir $_) -Raw -Encoding UTF8
}) -join "`n"

$html = (Get-Content $template -Raw -Encoding UTF8) -replace '%%SLIDES%%', $slides
Set-Content -Path $output -Value $html -NoNewline -Encoding UTF8
Write-Host "Built index.html ($($files.Count) slides from _manifest.js)"

# ── Integrity fingerprint: detect content rollbacks across merges ──
$integrityPath = Join-Path $root ".slide-integrity"
$currentHashes = @()
foreach ($f in $files) {
  $content = Get-Content (Join-Path $slidesDir $f) -Raw -Encoding UTF8
  $hash = [System.BitConverter]::ToString(
    [System.Security.Cryptography.SHA256]::Create().ComputeHash(
      [System.Text.Encoding]::UTF8.GetBytes($content)
    )
  ).Replace("-","").Substring(0,16)
  $idMatch = [regex]::Match($content, 'id="([^"]+)"')
  $sectionId = if ($idMatch.Success) { $idMatch.Groups[1].Value } else { $f }
  $currentHashes += "$hash $sectionId $f"
}

if (Test-Path $integrityPath) {
  $previous = Get-Content $integrityPath -Encoding UTF8
  $prevCount = ($previous | Where-Object { $_ -match '^\w' }).Count
  $currCount = $currentHashes.Count
  if ($currCount -lt $prevCount) {
    Write-Host ""
    Write-Host "!! ROLLBACK DETECTADO: slide count caiu de $prevCount para $currCount !!" -ForegroundColor Red
    Write-Host "!! Verifique se git merge nao reverteu slides. !!" -ForegroundColor Red
    Write-Host ""
  }
  $changed = @()
  $prevMap = @{}
  foreach ($line in $previous) {
    if ($line -match '^(\w+)\s+(\S+)\s+(.+)$') {
      $prevMap[$Matches[3]] = $Matches[1]
    }
  }
  foreach ($line in $currentHashes) {
    if ($line -match '^(\w+)\s+(\S+)\s+(.+)$') {
      $file = $Matches[3]; $newHash = $Matches[1]
      if ($prevMap.ContainsKey($file) -and $prevMap[$file] -ne $newHash) {
        $changed += $file
      }
    }
  }
  if ($changed.Count -gt 0) {
    Write-Host ""
    Write-Host "!! ATENCAO: $($changed.Count) slide(s) mudaram desde o ultimo build:" -ForegroundColor Yellow
    foreach ($c in $changed) { Write-Host "  -> $c" -ForegroundColor Yellow }
    Write-Host "!! Se isso foi intencional, tudo certo. Se nao, verifique git log." -ForegroundColor Yellow
    Write-Host ""
  }
}

Set-Content -Path $integrityPath -Value ($currentHashes -join "`n") -NoNewline -Encoding UTF8
