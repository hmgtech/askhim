import tree_sitter_python as tspython
from tree_sitter import Language, Parser
import os

# Make sure your paths are valid and point to your grammar repositories
build_dir = 'build'
lib_path = os.path.join(build_dir, 'my-languages.so')
os.makedirs(build_dir, exist_ok=True)

Language.build_library(
    # Store the library in the `build` directory
    lib_path,
    [
        'tree-sitter-python',
        'tree-sitter-typescript/typescript',
        'tree-sitter-typescript/tsx',
        'tree-sitter-bash',
        'tree-sitter-groovy'
    ]
)

print(f"Library built at: {lib_path}")