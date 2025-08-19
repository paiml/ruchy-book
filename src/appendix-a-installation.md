# Appendix A: Installation Guide

*"The best programming language is useless if you can't install it. Make installation trivial, and adoption follows. Make it hard, and even great technology dies in obscurity."* - Noah Gift

## Quick Installation

### One-Line Install (Recommended)

```bash
# Linux/macOS
curl -sSL https://install.ruchy.org | sh

# Windows (PowerShell)
iwr https://install.ruchy.org/windows.ps1 | iex
```

### Package Managers

```bash
# Homebrew (macOS/Linux)
brew install ruchy

# Chocolatey (Windows)
choco install ruchy

# Scoop (Windows)
scoop install ruchy

# APT (Ubuntu/Debian)
sudo apt update && sudo apt install ruchy

# YUM (RHEL/CentOS/Fedora)
sudo yum install ruchy

# Pacman (Arch Linux)
sudo pacman -S ruchy

# Snap (Universal Linux)
sudo snap install ruchy

# Cargo (if you have Rust)
cargo install ruchy
```

## Detailed Installation

### System Requirements

**Minimum:**
- OS: Windows 10, macOS 10.15, Linux (any modern distro)
- RAM: 512MB available
- Disk: 200MB free space
- Architecture: x86_64, ARM64

**Recommended:**
- RAM: 2GB+ for large projects
- Disk: 1GB+ for projects and dependencies
- Internet: For package management

### Linux Installation

#### Ubuntu/Debian
```bash
# Add Ruchy repository
curl -fsSL https://packages.ruchy.org/gpg | sudo gpg --dearmor -o /usr/share/keyrings/ruchy.gpg
echo "deb [signed-by=/usr/share/keyrings/ruchy.gpg] https://packages.ruchy.org/debian stable main" | sudo tee /etc/apt/sources.list.d/ruchy.list

# Install
sudo apt update
sudo apt install ruchy

# Verify installation
ruchy --version
```

#### CentOS/RHEL/Fedora
```bash
# Add repository
sudo tee /etc/yum.repos.d/ruchy.repo << 'EOF'
[ruchy]
name=Ruchy Programming Language
baseurl=https://packages.ruchy.org/rpm
enabled=1
gpgcheck=1
gpgkey=https://packages.ruchy.org/gpg
EOF

# Install
sudo yum install ruchy

# Or for newer systems
sudo dnf install ruchy
```

#### Arch Linux
```bash
# From AUR
yay -S ruchy

# Or manual AUR installation
git clone https://aur.archlinux.org/ruchy.git
cd ruchy
makepkg -si
```

#### From Source (Any Linux)
```bash
# Prerequisites
sudo apt install build-essential curl git  # Ubuntu/Debian
# sudo yum groupinstall "Development Tools"  # RHEL/CentOS

# Clone and build
git clone https://github.com/ruchy-lang/ruchy.git
cd ruchy
./configure --prefix=/usr/local
make -j$(nproc)
sudo make install

# Add to PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### macOS Installation

#### Homebrew (Recommended)
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Ruchy
brew install ruchy

# Verify
ruchy --version
```

#### Manual Installation
```bash
# Download latest release
curl -LO https://releases.ruchy.org/latest/ruchy-macos.tar.gz

# Extract and install
tar -xzf ruchy-macos.tar.gz
sudo mv ruchy /usr/local/bin/

# Make executable
sudo chmod +x /usr/local/bin/ruchy

# Add to PATH (if needed)
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Windows Installation

#### Using Installer (Recommended)
1. Download `ruchy-installer.exe` from https://releases.ruchy.org/latest/
2. Run installer as Administrator
3. Follow setup wizard
4. Installer will automatically:
   - Add Ruchy to PATH
   - Install Visual Studio Build Tools if needed
   - Configure Windows Defender exclusions

#### Using Package Managers
```powershell
# Chocolatey
choco install ruchy

# Scoop
scoop bucket add extras
scoop install ruchy

# Winget
winget install Ruchy.Ruchy
```

#### Manual Installation
```powershell
# Download and extract
Invoke-WebRequest -Uri "https://releases.ruchy.org/latest/ruchy-windows.zip" -OutFile "ruchy-windows.zip"
Expand-Archive ruchy-windows.zip -DestinationPath "C:\Program Files\Ruchy"

# Add to PATH
$env:PATH += ";C:\Program Files\Ruchy\bin"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH, [EnvironmentVariableTarget]::Machine)
```

## Development Environment Setup

### IDE Integration

#### Visual Studio Code
```bash
# Install Ruchy extension
code --install-extension ruchy.ruchy-lang

# Or search "Ruchy" in VS Code marketplace
```

Features:
- Syntax highlighting
- IntelliSense
- Debugging support
- Integrated terminal
- Error highlighting
- Code formatting

#### Vim/Neovim
```bash
# Using vim-plug
echo "Plug 'ruchy-lang/vim-ruchy'" >> ~/.vimrc
vim +PlugInstall

# Using packer.nvim (Neovim)
echo "use 'ruchy-lang/vim-ruchy'" >> ~/.config/nvim/init.lua
```

#### Emacs
```elisp
;; Add to ~/.emacs or ~/.emacs.d/init.el
(require 'package)
(add-to-list 'package-archives '("melpa" . "https://melpa.org/packages/"))
(package-refresh-contents)
(package-install 'ruchy-mode)
```

#### IntelliJ IDEA
1. Go to Settings → Plugins
2. Search "Ruchy"
3. Install and restart IDE

### Shell Completion

#### Bash
```bash
# Add to ~/.bashrc
eval "$(ruchy completion bash)"

# Or generate and save
ruchy completion bash > ~/.local/share/bash-completion/completions/ruchy
```

#### Zsh
```bash
# Add to ~/.zshrc
eval "$(ruchy completion zsh)"

# Or generate and save
ruchy completion zsh > "${fpath[1]}/_ruchy"
```

#### Fish
```bash
# Generate completions
ruchy completion fish > ~/.config/fish/completions/ruchy.fish
```

#### PowerShell
```powershell
# Add to profile
ruchy completion powershell | Out-String | Invoke-Expression

# Or save to profile
ruchy completion powershell >> $PROFILE
```

## Configuration

### Global Configuration
```bash
# Create config directory
mkdir -p ~/.config/ruchy

# Create default config
cat > ~/.config/ruchy/config.toml << 'EOF'
[default]
edition = "2024"
target = "native"
optimization = "release"

[build]
parallel = true
incremental = true
cache_dir = "~/.cache/ruchy"

[package]
registry = "https://packages.ruchy.org"
offline = false

[tools]
formatter = "ruchy-fmt"
linter = "ruchy-lint"
docs = "ruchy-doc"
EOF
```

### Project Configuration
```bash
# Initialize new project
ruchy new my-project
cd my-project

# Project structure created:
# ├── Ruchy.toml     # Project configuration
# ├── src/
# │   └── main.ruchy # Main source file
# ├── tests/         # Test directory
# ├── docs/          # Documentation
# └── .gitignore     # Git ignore file
```

### Environment Variables
```bash
# Add to shell profile
export RUCHY_HOME="$HOME/.ruchy"
export RUCHY_CACHE_DIR="$HOME/.cache/ruchy"
export RUCHY_LOG=info
export RUCHY_COLORS=always
export RUCHY_INCREMENTAL=1
```

## Verification

### Basic Verification
```bash
# Check version
ruchy --version
# ruchy 1.0.0 (stable)

# Check tools
ruchy --help
ruchy fmt --version
ruchy test --version
ruchy doc --version

# Test compilation
echo 'println("Hello, World!")' > hello.ruchy
ruchy run hello.ruchy
# Hello, World!
```

### Comprehensive Test
```bash
# Create test project
ruchy new test-installation
cd test-installation

# Build and run
ruchy build
ruchy run

# Run tests
ruchy test

# Check documentation
ruchy doc --open

# Format code
ruchy fmt

# All should work without errors
```

## Troubleshooting

### Common Issues

#### "ruchy: command not found"
```bash
# Check if installed
which ruchy
ls -la /usr/local/bin/ruchy

# Check PATH
echo $PATH

# Add to PATH manually
export PATH="/usr/local/bin:$PATH"
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
```

#### Permission Denied
```bash
# Make executable
sudo chmod +x /usr/local/bin/ruchy

# Check ownership
ls -la /usr/local/bin/ruchy

# Fix if needed
sudo chown root:root /usr/local/bin/ruchy
```

#### Windows: Missing Visual C++ Build Tools
```powershell
# Install Build Tools
winget install Microsoft.VisualStudio.2022.BuildTools

# Or download from Microsoft
# https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
```

#### macOS: "ruchy cannot be opened because it is from an unidentified developer"
```bash
# Allow in System Preferences → Security & Privacy
# Or remove quarantine
sudo xattr -r -d com.apple.quarantine /usr/local/bin/ruchy
```

#### Linux: Dependency Issues
```bash
# Ubuntu/Debian - install build essentials
sudo apt install build-essential libc6-dev

# CentOS/RHEL - install development tools
sudo yum groupinstall "Development Tools"

# Check library dependencies
ldd $(which ruchy)
```

### Getting Help

#### Documentation
- Official docs: https://doc.ruchy.org
- Installation guide: https://install.ruchy.org
- Troubleshooting: https://help.ruchy.org

#### Community
- Discord: https://discord.gg/ruchy
- Reddit: https://reddit.com/r/ruchy
- Stack Overflow: Tag `ruchy`
- GitHub Issues: https://github.com/ruchy-lang/ruchy/issues

#### Support Commands
```bash
# Diagnostic information
ruchy --env

# Check system compatibility
ruchy doctor

# Generate bug report
ruchy bug-report

# Update Ruchy
ruchy self-update
```

## Uninstalling

### Package Manager Uninstall
```bash
# Homebrew
brew uninstall ruchy

# APT
sudo apt remove ruchy

# YUM
sudo yum remove ruchy

# Chocolatey
choco uninstall ruchy
```

### Manual Uninstall
```bash
# Remove binary
sudo rm /usr/local/bin/ruchy

# Remove configuration
rm -rf ~/.config/ruchy
rm -rf ~/.cache/ruchy

# Remove from PATH (edit shell profile)
# Remove: export PATH="/usr/local/bin:$PATH"
```

### Complete Cleanup
```bash
# Remove all Ruchy-related files
rm -rf ~/.ruchy
rm -rf ~/.config/ruchy
rm -rf ~/.cache/ruchy
rm -rf ~/.local/share/ruchy

# Remove shell completions
rm ~/.local/share/bash-completion/completions/ruchy
rm ~/.config/fish/completions/ruchy.fish

# Edit shell profiles to remove Ruchy entries
```

Installation complete! You're ready to start programming in Ruchy.