import json
import urllib.request
import urllib.parse
import re

SYSTEMS = {
    'PS1': 'Sony%20-%20PlayStation',
    'PS2': 'Sony%20-%20PlayStation%202',
    'PSP': 'Sony%20-%20PlayStation%20Portable',
    'SNES': 'Nintendo%20-%20Super%20Nintendo%20Entertainment%20System',
    'GBA': 'Nintendo%20-%20Game%20Boy%20Advance',
    'NDS': 'Nintendo%20-%20Nintendo%20DS',
    'NES': 'Nintendo%20-%20Nintendo%20Entertainment%20System',
    'GBC': 'Nintendo%20-%20Game%20Boy%20Color',
    'GB': 'Nintendo%20-%20Game%20Boy',
    '3DS': 'Nintendo%20-%20Nintendo%203DS'
}

def test_url(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as r:
            return r.status == 200
    except:
        return False

# For each broken game, test variations with (USA), (Japan), (Europe), (USA, Europe), and '-' vs ':'
with open('tools/broken_covers_list.json', 'r', encoding='utf-8') as f:
    broken = json.load(f)

print(f"Resolving official box arts for {len(broken)} games...")

found_mapping = {}

for g in broken:
    gid = g['id']
    title = g['title']
    plat = g['platform']
    sys_dir = SYSTEMS.get(plat)
    if not sys_dir:
        continue
    
    clean_t = title.replace(':', ' -').replace('!', '').replace('?', '').strip()
    clean_t2 = re.sub(r'\s+', ' ', clean_t)
    
    candidates = [
        f"{title} (USA).png",
        f"{title} (Japan).png",
        f"{title} (Europe).png",
        f"{title} (USA, Europe).png",
        f"{clean_t2} (USA).png",
        f"{clean_t2} (Japan).png",
        f"{clean_t2} (Europe).png",
        f"{clean_t2} (USA, Europe).png",
        f"{title}.png",
        f"{clean_t2}.png"
    ]
    # Add special overrides
    if 'Fatal Frame' in title:
        candidates.insert(0, "Fatal Frame II - Crimson Butterfly (USA).png")
    if 'Twilight Syndrome' in title and 'Kyuumei' in title:
        candidates.insert(0, "Twilight Syndrome - Kyuumei Hen (Japan) (Disc 1).png")
        candidates.insert(0, "Twilight Syndrome - Kyuumei Hen (Japan).png")
    if 'Twilight Syndrome' in title and 'Tansaku' in title:
        candidates.insert(0, "Twilight Syndrome - Tansaku Hen (Japan) (Disc 1).png")
        candidates.insert(0, "Twilight Syndrome - Tansaku Hen (Japan).png")
    if 'Zero4 Champ' in title:
        candidates.insert(0, "Zero 4 Champ RR (Japan).png")
    if 'Front Mission' in title:
        candidates.insert(0, "Front Mission (Japan).png")
        candidates.insert(0, "Front Mission (Japan) (Rev 1).png")
    if 'Clock Tower' in title and 'Ghost Head' in title:
        candidates.insert(0, "Clock Tower - Ghost Head (Japan).png")
    if 'Nage Libre' in title:
        candidates.insert(0, "Nage Libre - Seijaku no Mokushiroku (Japan).png")
    if 'Boku no Natsuyasumi 4' in title:
        candidates.insert(0, "Boku no Natsuyasumi 4 - Seitouchi Shounen Tanteidan, Boku to Himitsu no Chizu (Japan).png")
    if 'Toy Story 2' in title:
        candidates.insert(0, "Toy Story 2 - Buzz Lightyear to the Rescue! (USA).png")
    if 'Pokemon' in title or 'Pokémon' in title:
        candidates.insert(0, "Pokemon - Black Version 2 (USA, Europe).png")
        candidates.insert(0, "Pokemon - White Version 2 (USA, Europe).png")
    if 'Manpuku' in title:
        candidates.insert(0, "Manpuku!! Nabe Kazoku (Japan).png")
    if 'Dragon Ball Z' in title and 'Idainaru' in title:
        candidates.insert(0, "Dragon Ball Z - Idainaru Dragon Ball Densetsu (Japan).png")
    if 'Ultraman' in title:
        candidates.insert(0, "Ultraman Fighting Evolution 3 (Japan).png")
    if 'One Piece' in title:
        candidates.insert(0, "Shonen Jump's - One Piece (USA).png")
        candidates.insert(0, "One Piece (USA).png")
    if 'Final Fantasy V' in title:
        candidates.insert(0, "Final Fantasy V (Japan).png")
    if 'Sengoku Basara' in title:
        candidates.insert(0, "Sengoku Basara 2 Heroes (Japan).png")

    matched_url = None
    for cand in candidates:
        safe_cand = urllib.parse.quote(cand)
        url = f"https://thumbnails.libretro.com/{sys_dir}/Named_Boxarts/{safe_cand}"
        if test_url(url):
            matched_url = url
            print(f"Found box art for {gid} ({title}): {cand}")
            break
            
    if matched_url:
        found_mapping[gid] = matched_url
    else:
        print(f"FAILED to find box art for: {gid} ({title}) on {plat}")

with open('tools/found_boxarts.json', 'w', encoding='utf-8') as f:
    json.dump(found_mapping, f, ensure_ascii=False, indent=2)

print(f"Resolved {len(found_mapping)} / {len(broken)} box arts!")
