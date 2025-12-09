#!/bin/bash
# ChatGPT 2.0 Desktop Launcher
# Double-click this file to launch the desktop application

cd "$(dirname "$0")/dist-electron/linux-unpacked"
./copilot-pro "$@"
