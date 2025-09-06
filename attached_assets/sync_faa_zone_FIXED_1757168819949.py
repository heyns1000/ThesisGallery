
from pathlib import Path
import shutil
import os

# Fixed source path
SOURCE_DIR = Path('/Users/samantha/Downloads/FAA_Zone_Deploy')

# Destination path (replace with actual desired destination if different)
DEST_DIR = Path('/Users/samantha/Documents/fruitful-global-site/faa.zone-site-live')

def sync_site():
    if not SOURCE_DIR.exists():
        print(f"Source folder not found: {SOURCE_DIR}")
        return

    DEST_DIR.mkdir(parents=True, exist_ok=True)

    for item in SOURCE_DIR.glob('**/*'):
        if item.is_file():
            rel_path = item.relative_to(SOURCE_DIR)
            dest_file = DEST_DIR / rel_path
            dest_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, dest_file)
            print(f"Copied: {item} -> {dest_file}")

    print("✅ Sync complete. FAA Zone site is now live.")

if __name__ == '__main__':
    sync_site()
