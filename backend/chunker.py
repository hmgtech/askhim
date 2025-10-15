import os
from tree_sitter import Language, Parser
# Load the compiled language
PY_LANGUAGE = Language('build/my-languages.so', 'python')

# Initialize the parser with the Python language
parser = Parser()
parser.set_language(PY_LANGUAGE)

# def extract_chunks(code: str):
#     tree = parser.parse(bytes(code, "utf8"))
#     root_node = tree.root_node
#     chunks = []
#     def walk(node):
#         if node.type in ('function_definition', 'class_definition'):
#             start = node.start_byte
#             end = node.end_byte
#             snippet = code[start:end].strip()
#             chunks.append({
#                 'type': node.type,
#                 'code': snippet
#             })
#         for child in node.children:
#             walk(child)
#     walk(root_node)
#     return chunks

# def parse_directory(path: str):
#     for root, _, files in os.walk(path):
#         for file in files:
#             if file.endswith(".py"):
#                 filepath = os.path.join(root, file)
#                 with open(filepath, "r", encoding="utf-8") as f:
#                     code = f.read()
#                 print(f"\n--- {filepath} ---")
#                 for chunk in extract_chunks(code):
#                     print(f"\n# {chunk['type']}\n{chunk['code']}\n")

# if __name__ == "__main__":
#     import sys
#     if len(sys.argv) != 2:
#         print("Usage: python chunker.py <path-to-codebase>")
#         exit(1)
#     parse_directory(sys.argv[1])
    
## Function to chunk Python code by functions and classes
def chunk_python_by_functions_and_classes(file_path):
    parser = Parser()
    parser.set_language(PY_LANGUAGE)
    
    with open(file_path, "rb") as f:
        code = f.read()
        
    tree = parser.parse(code)
    root = tree.root_node

    def dfs(node, code):
        results = []
        if node.type in ["function_definition", "class_definition"]:
            start_byte, end_byte = node.start_byte, node.end_byte
            start_line = node.start_point[0] + 1
            name = None
            for child in node.children:
                if child.type == "identifier":
                    name = code[child.start_byte:child.end_byte].decode()
            results.append({
                "content": code[start_byte:end_byte].decode(),
                "type": node.type,
                "name": name,
                "file": file_path,
                "start_line": start_line,
            })
        for child in node.children:
            results += dfs(child, code)
        return results

    return dfs(root, code)

