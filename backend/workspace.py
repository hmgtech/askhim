import os

def scan_workspace(root_dir, exts=('py', 'js', 'ts', 'md')):
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.split('.')[-1] in exts:
                yield os.path.join(root, file)

def chunk_file(file_path, max_lines=30):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    return [
        {
            'content': ''.join(lines[i:i+max_lines]),
            'file': file_path,
            'start_line': i+1
        }
        for i in range(0, len(lines), max_lines)
    ]