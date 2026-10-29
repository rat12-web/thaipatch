import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Search GitHub repo trees for filenames
def search_repo(repo, query):
    url = f"https://api.github.com/repos/libretro-thumbnails/{repo}/git/trees/master?recursive=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            matches = [item['path'] for item in data.get('tree', []) if query.lower() in item['path'].lower()]
            return matches
    except Exception as e:
        print(f"Error searching {repo}: {e}")
        return []

print("Searching for Toy Story in PS1:", search_repo('Sony_-_PlayStation', 'Toy Story'))
print("Searching for Hajime in PSP:", search_repo('Sony_-_PlayStation_Portable', 'Hajime'))
print("Searching for Natsuyasumi in PSP:", search_repo('Sony_-_PlayStation_Portable', 'Natsuyasumi'))
print("Searching for Nage Libre in SNES:", search_repo('Nintendo_-_Super_Nintendo_Entertainment_System', 'Nage'))
