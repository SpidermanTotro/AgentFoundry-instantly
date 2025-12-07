# Advanced Offline AI Copilot Pro - Windows Installation Script
# PowerShell script for Windows installation

# Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

# Banner
Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      ░█████╗░░█████╗░██████╗░██╗██╗░░░░░░█████╗░████████╗║
║      ██╔══██╗██╔══██╗██╔══██╗██║██║░░░░░██╔══██╗╚══██╔══╝║
║      ██║░░╚═╝██║░░██║██████╔╝██║██║░░░░░██║░░██║░░░██║░░░║
║      ██║░░██╗██║░░██║██╔═══╝░██║██║░░░░░██║░░██║░░░██║░░░║
║      ╚█████╔╝╚█████╔╝██║░░░░░██║███████╗╚█████╔╝░░░██║░░░║
║      ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚══════╝░╚════╝░░░░╚═╝░░░║
║                                                           ║
║         Advanced Offline AI Copilot Pro - Installer      ║
║                  Windows PowerShell Edition              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Host "🚀 Installing Advanced Offline AI Copilot Pro" -ForegroundColor Green
Write-Host ""

# Check for Node.js
Write-Host "🔍 Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "📥 Installing Node.js..." -ForegroundColor Yellow
    
    # Download and install Node.js
    $nodeInstaller = "$env:TEMP\node-installer.msi"
    $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    
    Write-Host "⬇️  Downloading Node.js..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller
    
    Write-Host "📦 Installing Node.js (please wait)..." -ForegroundColor Yellow
    Start-Process msiexec.exe -ArgumentList "/i `"$nodeInstaller`" /quiet /norestart" -Wait
    
    Remove-Item $nodeInstaller
    Write-Host "✓ Node.js installed" -ForegroundColor Green
    
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# Check for npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}

# Installation directory
$installDir = "$env:LOCALAPPDATA\CopilotPro"
Write-Host ""
Write-Host "📂 Installation directory: $installDir" -ForegroundColor Yellow

# Check if already installed
if (Test-Path $installDir) {
    Write-Host "⚠️  Installation directory already exists" -ForegroundColor Yellow
    $reinstall = Read-Host "Do you want to reinstall? This will remove existing data. (y/N)"
    
    if ($reinstall -eq 'y' -or $reinstall -eq 'Y') {
        Write-Host "🗑️  Removing existing installation..." -ForegroundColor Yellow
        Remove-Item -Path $installDir -Recurse -Force
    } else {
        Write-Host "Installation cancelled" -ForegroundColor Yellow
        exit 0
    }
}

# Create installation directory
New-Item -ItemType Directory -Path $installDir -Force | Out-Null
Write-Host "✓ Created installation directory" -ForegroundColor Green

# Copy files
Write-Host ""
Write-Host "📦 Copying application files..." -ForegroundColor Yellow
Copy-Item -Path ".\*" -Destination $installDir -Recurse -Force
Set-Location $installDir

# Install dependencies
Write-Host ""
Write-Host "📥 Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install --production

# Build application
Write-Host ""
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Create launcher scripts
Write-Host ""
Write-Host "📝 Creating launcher scripts..." -ForegroundColor Yellow

# Create batch launcher
$batchLauncher = "$installDir\copilot-pro.bat"
@"
@echo off
cd /d "$installDir"
start /b node server\index.js
timeout /t 2 /nobreak > nul
npm run dev
"@ | Out-File -FilePath $batchLauncher -Encoding ASCII

Write-Host "✓ Created batch launcher" -ForegroundColor Green

# Create PowerShell launcher
$psLauncher = "$installDir\copilot-pro.ps1"
@"
Set-Location "$installDir"
Start-Process node -ArgumentList "server\index.js" -WindowStyle Hidden
Start-Sleep -Seconds 2
npm run dev
"@ | Out-File -FilePath $psLauncher -Encoding UTF8

Write-Host "✓ Created PowerShell launcher" -ForegroundColor Green

# Create desktop shortcut
Write-Host ""
Write-Host "📌 Creating desktop shortcut..." -ForegroundColor Yellow

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Copilot Pro.lnk")
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$psLauncher`""
$Shortcut.WorkingDirectory = $installDir
$Shortcut.IconLocation = "$installDir\public\icon.ico"
$Shortcut.Description = "Advanced Offline AI Coding Assistant"
$Shortcut.Save()

Write-Host "✓ Created desktop shortcut" -ForegroundColor Green

# Create Start Menu shortcut
Write-Host ""
Write-Host "📌 Creating Start Menu shortcut..." -ForegroundColor Yellow

$startMenuDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Copilot Pro"
New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null

$StartMenuShortcut = $WshShell.CreateShortcut("$startMenuDir\Copilot Pro.lnk")
$StartMenuShortcut.TargetPath = "powershell.exe"
$StartMenuShortcut.Arguments = "-ExecutionPolicy Bypass -File `"$psLauncher`""
$StartMenuShortcut.WorkingDirectory = $installDir
$StartMenuShortcut.IconLocation = "$installDir\public\icon.ico"
$StartMenuShortcut.Description = "Advanced Offline AI Coding Assistant"
$StartMenuShortcut.Save()

Write-Host "✓ Created Start Menu shortcut" -ForegroundColor Green

# Create Windows Service (optional)
Write-Host ""
$createService = Read-Host "Do you want to install as Windows Service (auto-start on boot)? (y/N)"

if ($createService -eq 'y' -or $createService -eq 'Y') {
    Write-Host "⚙️  Creating Windows Service..." -ForegroundColor Yellow
    
    # Install NSSM (Non-Sucking Service Manager) if not present
    $nssmPath = "$installDir\nssm.exe"
    if (-not (Test-Path $nssmPath)) {
        Write-Host "📥 Downloading NSSM..." -ForegroundColor Yellow
        $nssmUrl = "https://nssm.cc/release/nssm-2.24.zip"
        $nssmZip = "$env:TEMP\nssm.zip"
        Invoke-WebRequest -Uri $nssmUrl -OutFile $nssmZip
        
        Expand-Archive -Path $nssmZip -DestinationPath "$env:TEMP\nssm" -Force
        Copy-Item "$env:TEMP\nssm\nssm-2.24\win64\nssm.exe" -Destination $nssmPath
        Remove-Item $nssmZip
        Remove-Item "$env:TEMP\nssm" -Recurse
    }
    
    # Create service
    $nodePath = (Get-Command node).Source
    & $nssmPath install CopilotPro $nodePath "$installDir\server\index.js"
    & $nssmPath set CopilotPro AppDirectory $installDir
    & $nssmPath set CopilotPro DisplayName "Copilot Pro Server"
    & $nssmPath set CopilotPro Description "Advanced Offline AI Copilot Pro Backend Service"
    & $nssmPath set CopilotPro Start SERVICE_AUTO_START
    
    # Start service
    Start-Service CopilotPro
    
    Write-Host "✓ Windows Service created and started" -ForegroundColor Green
    Write-Host "   To manage: services.msc" -ForegroundColor Cyan
}

# Add to PATH
Write-Host ""
Write-Host "📌 Adding to PATH..." -ForegroundColor Yellow

$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$installDir", "User")
    Write-Host "✓ Added to PATH" -ForegroundColor Green
    Write-Host "⚠️  Restart your terminal to use 'copilot-pro' command" -ForegroundColor Yellow
}

# Create uninstall script
Write-Host ""
Write-Host "📝 Creating uninstall script..." -ForegroundColor Yellow

$uninstallScript = "$installDir\uninstall.ps1"
@"
Write-Host "🗑️  Uninstalling Copilot Pro..." -ForegroundColor Yellow

# Stop and remove service if exists
try {
    Stop-Service CopilotPro -ErrorAction SilentlyContinue
    sc.exe delete CopilotPro
} catch {}

# Remove shortcuts
Remove-Item "$env:USERPROFILE\Desktop\Copilot Pro.lnk" -ErrorAction SilentlyContinue
Remove-Item "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Copilot Pro" -Recurse -ErrorAction SilentlyContinue

# Remove from PATH
`$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
`$newPath = (`$currentPath -split ';' | Where-Object { `$_ -ne "$installDir" }) -join ';'
[Environment]::SetEnvironmentVariable("Path", `$newPath, "User")

# Remove installation directory
Set-Location `$env:USERPROFILE
Remove-Item "$installDir" -Recurse -Force

Write-Host "✓ Copilot Pro has been uninstalled" -ForegroundColor Green
"@ | Out-File -FilePath $uninstallScript -Encoding UTF8

Write-Host "✓ Created uninstall script" -ForegroundColor Green

# Final message
Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         ✅ Installation Complete!                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Green

Write-Host "🚀 How to use:" -ForegroundColor Cyan
Write-Host "   • Double-click Desktop shortcut" -ForegroundColor Yellow
Write-Host "   • Or run from Start Menu: Copilot Pro" -ForegroundColor Yellow
Write-Host "   • Or run: powershell -File `"$psLauncher`"" -ForegroundColor Yellow

Write-Host ""
Write-Host "📚 Features:" -ForegroundColor Cyan
Write-Host "   ✓ 100% Offline AI" -ForegroundColor Yellow
Write-Host "   ✓ Self-Learning System" -ForegroundColor Yellow
Write-Host "   ✓ Multi-Language Support" -ForegroundColor Yellow
Write-Host "   ✓ Real-Time Code Analysis" -ForegroundColor Yellow
Write-Host "   ✓ Advanced Refactoring" -ForegroundColor Yellow

Write-Host ""
Write-Host "🔧 Management:" -ForegroundColor Cyan
Write-Host "   • Uninstall: powershell -File `"$uninstallScript`"" -ForegroundColor Yellow

Write-Host ""
Write-Host "⭐ Star us on GitHub: https://github.com/SpidermanTotro/AgentFoundry-instantly" -ForegroundColor Magenta
Write-Host "🐛 Report issues: https://github.com/SpidermanTotro/AgentFoundry-instantly/issues" -ForegroundColor Magenta
Write-Host ""

# Open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:3001"
