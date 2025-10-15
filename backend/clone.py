import os
import subprocess

# List of repositories to clone
repos = {
    "tree-sitter-python": "https://github.com/tree-sitter/tree-sitter-python.git",
    "tree-sitter-bash": "https://github.com/tree-sitter/tree-sitter-bash.git",
    "tree-sitter-groovy": "https://github.com/murtaza64/tree-sitter-groovy.git",
    "tree-sitter-typescript": "https://github.com/tree-sitter/tree-sitter-typescript.git"
}

# Clone repositories
for repo_name, repo_url in repos.items():
    if not os.path.exists(repo_name):
        print(f"Cloning {repo_name}...")
        subprocess.run(["git", "clone", repo_url], check=True)
    else:
        print(f"{repo_name} already exists, skipping clone.")
