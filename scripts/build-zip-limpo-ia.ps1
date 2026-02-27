# build-zip-limpo-ia.ps1
# ZIP otimizado para leitura por IA: código + screenshots PNG, sem binários pesados.
# Uso: .\scripts\build-zip-limpo-ia.ps1 [cirrose|grade|metanalise|all]
#
# Inclui: HTML, CSS, JS, .md, slides, screenshots PNG
# Exclui: node_modules, dist, .git, fontes (.woff2, .woff), PDFs, imagens pesadas em assets
#
# Protocolo alinhado a Aulas_core (exports/ na raiz).

param(
    [string]$Aula = "all"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

$ExportsDir = Join-Path $ProjectRoot "exports"
$Date = Get-Date -Format "yyyyMMdd"
$ZipName = "aulas-magnas-ia-$Date.zip"
if ($Aula -ne "all") { $ZipName = "aulas-magnas-$Aula-ia-$Date.zip" }
$ZipPath = Join-Path $ExportsDir $ZipName
$TempDir = Join-Path $env:TEMP "aulas-magnas-ia-$Date"

if (!(Test-Path $ExportsDir)) { New-Item -ItemType Directory -Path $ExportsDir -Force | Out-Null }
if (Test-Path $TempDir) { Remove-Item $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

Write-Host "[ZIP LIMPO IA] aulas-magnas - Criando $ZipName" -ForegroundColor Cyan

$Lectures = @("cirrose", "grade", "metanalise")
if ($Aula -ne "all") { $Lectures = @($Aula) }

# --- aulas/ ---
foreach ($lecture in $Lectures) {
    $Src = Join-Path $ProjectRoot "aulas\$lecture"
    if (!(Test-Path $Src)) { continue }
    $Dest = Join-Path $TempDir "aulas\$lecture"
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
    Copy-Item -Path "$Src\*.html" -Destination $Dest -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$Src\*.css" -Destination $Dest -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$Src\*.md" -Destination $Dest -Force -ErrorAction SilentlyContinue
    if (Test-Path "$Src\slides") { Copy-Item -Path "$Src\slides" -Destination $Dest -Recurse -Force }
    # assets: .keep (excluir imagens binárias)
    New-Item -ItemType Directory -Path "$Dest\assets" -Force | Out-Null
    Set-Content -Path "$Dest\assets\.keep" -Value "assets excluídos no ZIP IA (imagens binárias)"
}

# --- shared/ ---
$SharedDest = Join-Path $TempDir "shared"
New-Item -ItemType Directory -Path $SharedDest -Force | Out-Null
Copy-Item -Path "shared\css" -Destination "$SharedDest\css" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path "shared\js" -Destination "$SharedDest\js" -Recurse -Force -ErrorAction SilentlyContinue
# Excluir shared/assets/fonts
if (Test-Path "$SharedDest\assets") { Remove-Item "$SharedDest\assets" -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Path "$SharedDest\assets" -Force | Out-Null
Set-Content -Path "$SharedDest\assets\.keep" -Value "fonts/assets excluídos no ZIP IA"

# --- screenshots ---
foreach ($lecture in $Lectures) {
    $Shots = Join-Path $ExportsDir "screenshots\$lecture"
    if (Test-Path $Shots) {
        $DestShots = Join-Path $TempDir "aulas\$lecture\screenshots-pos-efeitos"
        New-Item -ItemType Directory -Path $DestShots -Force | Out-Null
        Copy-Item -Path "$Shots\*" -Destination $DestShots -Force -ErrorAction SilentlyContinue
    }
}

# Fallback: qa-screenshots (cirrose stage-c)
if ($Lectures -contains "cirrose") {
    $QaStageC = Join-Path $ProjectRoot "qa-screenshots\stage-c-floating"
    $DestShots = Join-Path $TempDir "aulas\cirrose\screenshots-pos-efeitos"
    if ((Test-Path $QaStageC) -and !(Test-Path $DestShots)) {
        New-Item -ItemType Directory -Path $DestShots -Force | Out-Null
        Copy-Item -Path "$QaStageC\*" -Destination $DestShots -Force -ErrorAction SilentlyContinue
    }
}

# --- Excluir fontes e binários ---
Get-ChildItem -Path $TempDir -Recurse -Include "*.woff2","*.woff","*.ttf","*.eot" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path $TempDir -Recurse -Include "*.pdf","*.pptx","*.zip" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# --- Docs ---
Copy-Item -Path "CLAUDE.md" -Destination $TempDir -ErrorAction SilentlyContinue
Copy-Item -Path "README.md" -Destination "$TempDir\README-projeto.md" -ErrorAction SilentlyContinue
foreach ($lecture in $Lectures) {
    $Hf = Join-Path $ProjectRoot "aulas\$lecture\HANDOFF.md"
    if (Test-Path $Hf) {
        Copy-Item -Path $Hf -Destination "$TempDir\aulas\$lecture\" -Force
    }
}

# --- Criar ZIP ---
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force
Remove-Item $TempDir -Recurse -Force

$ZipSize = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host "[ZIP LIMPO IA] OK: $ZipName ($ZipSize MB)" -ForegroundColor Green
Write-Host "               Destino: $ZipPath" -ForegroundColor Gray
