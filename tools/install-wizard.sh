#!/bin/bash
###############################################################################
# ChatGPT 2.0 UNRESTRICTED - Installation Wizard
# Generated from documentation
###############################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
print_header() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   ChatGPT 2.0 UNRESTRICTED - Installation Wizard      ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        print_info "Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    print_success "Node.js $(node --version) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm --version) found"
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_warning "git not found (optional)"
    else
        print_success "git $(git --version | cut -d' ' -f3) found"
    fi
}

install_dependencies() {
    print_info "Installing dependencies (this may take a while)..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

build_application() {
    print_info "Building frontend application..."
    
    if npm run build; then
        print_success "Frontend built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

setup_environment() {
    print_info "Setting up environment..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success ".env file created from template"
            print_warning "Remember to add your API keys in .env"
        else
            print_warning ".env.example not found"
        fi
    else
        print_info ".env file already exists"
    fi
}

build_desktop() {
    print_info "Would you like to build the Linux desktop application?"
    read -p "Build desktop app? (y/N): " build_desktop
    
    if [[ $build_desktop =~ ^[Yy]$ ]]; then
        print_info "Building Linux desktop application..."
        if npm run electron:build:linux; then
            print_success "Desktop application built successfully"
            print_info "AppImage created in dist-electron/"
        else
            print_error "Desktop build failed"
        fi
    fi
}

print_final_instructions() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         Installation Complete! 🎉                     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📝 Next Steps:${NC}"
    echo ""
    echo -e "${YELLOW}1. Configure API Keys (Optional):${NC}"
    echo "   Edit .env and add your API keys"
    echo ""
    echo -e "${YELLOW}2. Start the Application:${NC}"
    echo "   ${CYAN}npm start${NC}           - Start both frontend & backend"
    echo "   ${CYAN}npm run dev${NC}         - Start frontend only"
    echo "   ${CYAN}npm run server${NC}      - Start backend only"
    echo ""
    echo -e "${YELLOW}3. Run Desktop App:${NC}"
    echo "   ${CYAN}npm run electron:dev${NC}                    - Development mode"
    echo "   ${CYAN}./dist-electron/Copilot-Pro-*.AppImage${NC}  - Production"
    echo ""
    echo -e "${YELLOW}4. Access the Application:${NC}"
    echo "   Frontend: ${CYAN}http://localhost:3000${NC}"
    echo "   Backend:  ${CYAN}http://localhost:3001${NC}"
    echo "   Login:    ${CYAN}admin / admin123${NC}"
    echo ""
    echo -e "${BLUE}📚 Documentation: Check the *.md files in the project root${NC}"
    echo ""
}

# Main installation flow
main() {
    print_header
    
    echo -e "${CYAN}This wizard will install ChatGPT 2.0 UNRESTRICTED${NC}"
    echo ""
    read -p "Continue with installation? (Y/n): " continue
    
    if [[ $continue =~ ^[Nn]$ ]]; then
        print_info "Installation cancelled"
        exit 0
    fi
    
    print_header
    check_prerequisites
    echo ""
    
    read -p "Install dependencies? (Y/n): " install_deps
    if [[ ! $install_deps =~ ^[Nn]$ ]]; then
        install_dependencies
    fi
    echo ""
    
    read -p "Build frontend? (Y/n): " build_front
    if [[ ! $build_front =~ ^[Nn]$ ]]; then
        build_application
    fi
    echo ""
    
    setup_environment
    echo ""
    
    build_desktop
    echo ""
    
    print_final_instructions
}

# Run main function
main
