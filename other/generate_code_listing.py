import os
import sys
from pathlib import Path

EXTENSIONS = {'.ts', '.json', '.yaml', '.yml', '.py'}

FILENAMES = {'Dockerfile', 'docker-compose.yaml', 'nest-cli.json', 'tsconfig.json'}


def should_process_file(file_path: Path) -> bool:
    if file_path.name in FILENAMES:
        return True
    return file_path.suffix in EXTENSIONS


def generate_listing(root_dir: Path, output_file: Path) -> None:
    root_dir = root_dir.resolve()
    output_file = output_file.resolve()

    with open(output_file, 'w', encoding='utf-8') as out_f:
        for current_dir, _, files in os.walk(root_dir):
            if any(part.startswith(('.', 'node_modules', '__pycache__', 'dist', 'build'))
                   for part in Path(current_dir).relative_to(root_dir).parts):
                continue

            for file in files:
                file_path = Path(current_dir) / file
                if not should_process_file(file_path):
                    continue

                rel_path = file_path.relative_to(root_dir).as_posix()
                if not rel_path.startswith('/'):
                    rel_path = '/' + rel_path

                out_f.write(rel_path + '\n')
                out_f.write('_' * len(rel_path) + '\n')

                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as in_f:
                        content = in_f.read()
                        out_f.write(content)
                except Exception as e:
                    out_f.write(f"[Ошибка чтения файла: {e}]")

                out_f.write('\n\n')

    print(f"Листинг сохранён в: {output_file}")


def main():
    if len(sys.argv) >= 2:
        root = sys.argv[1]
    else:
        root = input("Введите путь к корневой директории проекта: ").strip()

    if len(sys.argv) >= 3:
        out_file = sys.argv[2]
    else:
        default = "code-listing.txt"
        resp = input(f"Введите имя выходного файла (Enter для '{default}'): ").strip()
        out_file = resp if resp else default

    root_path = Path(root)
    if not root_path.is_dir():
        print(f"Ошибка: '{root}' не является директорией.")
        sys.exit(1)

    generate_listing(root_path, Path(out_file))

if __name__ == "__main__":
    main()