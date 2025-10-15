#!/usr/bin/env python
"""
Installation script for AskHim CLI - This will create symlinks to make the CLI accessible globally.
"""
import os
import sys
import shutil
import subprocess
from pathlib import Path

def main():
    print("Installing AskHim CLI...")
    
    # Get the absolute path to the CLI script
    cli_script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cli", "askhim_cli.py")
    bash_wrapper_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cli", "askhim")
    
    if not os.path.exists(cli_script_path):
        print(f"Error: CLI script not found at {cli_script_path}")
        return 1
    
    # Ensure the bash wrapper is present or create it
    if not os.path.exists(bash_wrapper_path):
        print("Creating bash wrapper script...")
        with open(bash_wrapper_path, 'w') as f:
            f.write('#!/bin/bash\n\n')
            f.write('# Get the directory of this script\n')
            f.write('SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"\n\n')
            f.write('# Add the parent directory to PYTHONPATH to allow importing from backend\n')
            f.write('export PYTHONPATH="${SCRIPT_DIR}/..":$PYTHONPATH\n\n')
            f.write('# Execute the Python CLI script\n')
            f.write('python3 "${SCRIPT_DIR}/askhim_cli.py" "$@"\n')
        
        # Make executable
        os.chmod(bash_wrapper_path, 0o755)
    
    # Ensure both scripts are executable
    os.chmod(cli_script_path, 0o755)
    os.chmod(bash_wrapper_path, 0o755)
    
    # Find appropriate bin directory in PATH
    bin_dirs = [
        os.path.expanduser("~/.local/bin"),  # User's local bin (preferred)
        "/usr/local/bin",                   # System-wide local bin (requires sudo)
    ]
    
    # Check if we're in a virtual environment
    if sys.prefix != sys.base_prefix:
        # Virtual environment bin directory
        venv_bin = os.path.join(sys.prefix, "bin")
        bin_dirs.insert(0, venv_bin)  # Prioritize virtual env bin
    
    # Select first directory that exists and is in PATH
    selected_bin = None
    for bin_dir in bin_dirs:
        if os.path.exists(bin_dir) and os.access(bin_dir, os.W_OK):
            path_dirs = os.environ.get("PATH", "").split(":")
            if bin_dir in path_dirs:
                selected_bin = bin_dir
                break
    
    if not selected_bin:
        # Create ~/.local/bin if it doesn't exist
        selected_bin = os.path.expanduser("~/.local/bin")
        Path(selected_bin).mkdir(parents=True, exist_ok=True)
        
        # Recommend adding to PATH
        path_update = f'\nPlease add {selected_bin} to your PATH by adding this line to your ~/.bashrc or ~/.zshrc file:\n'
        path_update += f'  export PATH="$PATH:{selected_bin}"\n'
        path_update += f'Then run: source ~/.bashrc  # or source ~/.zshrc\n'
        
    # Create the symlink
    symlink_path = os.path.join(selected_bin, "askhim")
    
    # Remove existing symlink if it exists
    if os.path.exists(symlink_path):
        if os.path.islink(symlink_path):
            os.unlink(symlink_path)
        else:
            print(f"Warning: {symlink_path} exists but is not a symlink. Renaming to {symlink_path}.bak")
            if os.path.exists(f"{symlink_path}.bak"):
                os.remove(f"{symlink_path}.bak")
            os.rename(symlink_path, f"{symlink_path}.bak")
    
    # Create the symlink
    os.symlink(bash_wrapper_path, symlink_path)
    
    print(f"✅ AskHim CLI installed successfully to {symlink_path}")
    
    if 'path_update' in locals():
        print(path_update)
    else:
        print("\nYou can now use 'askhim' command from anywhere!")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
