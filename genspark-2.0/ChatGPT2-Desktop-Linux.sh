#!/bin/bash
# ChatGPT 2.0 Desktop Application Launcher
# This IS a real desktop program, not a web app!

echo "Starting ChatGPT 2.0 Desktop..."
cd "$(dirname "$0")/dist-electron/linux-unpacked"
./electron --no-sandbox
