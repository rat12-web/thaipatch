#!/usr/bin/env python3
import json
import urllib.request
import re

print("Fetching live Nonplae API data...")
req = urllib.request.Request('https://www.nonplae.com/api/patch-games', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as resp:
    data = json.loads(resp.read().decode('utf-8'))['games']

nonplae_by_slug = {g['slug']: g for g in data if g.get('slug')}

with open('catalog.json', 'r', encoding='utf-8') as f:
    cat = json.load(f)

fixed_urls = 0
fixed_covers = 0

for g in cat:
    if g.get('teamId') == 'team-dd94d3bc875d' or g.get('source') == 'นอนแปล (NONPLAE)':
        slug = g.get('sourceKey') or g.get('canonicalGameId')
        api_item = nonplae_by_slug.get(slug)
        
        # 1. Fix URL from /games/slug to /?game=slug
        correct_url = f"https://www.nonplae.com/?game={slug}"
        if g.get('url') != correct_url:
            g['url'] = correct_url
            fixed_urls += 1

        # 2. Fix Cover URL to exact live working coverImageUrl
        if api_item and api_item.get('coverImageUrl'):
            raw_cov = api_item['coverImageUrl']
            live_cover = f"https://www.nonplae.com{raw_cov}" if raw_cov.startswith('/') else raw_cov
            g['cover'] = live_cover
            g['coverCandidateUrl'] = live_cover
            
            # Ensure coverAlternatives[0] has live_cover
            if not g.get('coverAlternatives'):
                g['coverAlternatives'] = []
            
            # Keep official boxart as fallback at index 1
            libretro_alt = None
            for alt in g['coverAlternatives']:
                if 'libretro.com' in alt.get('url', ''):
                    libretro_alt = alt
                    break
            
            g['coverAlternatives'] = [
                {
                    'url': live_cover,
                    'kind': 'creator_made',
                    'source': 'นอนแปล (NONPLAE)',
                    'evidence': 'evidence/2026-10-29/all-teams-expansion.json',
                    'label': ''
                }
            ]
            if libretro_alt:
                g['coverAlternatives'].append(libretro_alt)
            
            fixed_covers += 1

print(f"Fixed {fixed_urls} Nonplae URLs (404 -> ?game=)")
print(f"Fixed {fixed_covers} Nonplae Cover URLs (live working coverImageUrl)")

with open('catalog.json', 'w', encoding='utf-8', newline='\r\n') as f:
    json.dump(cat, f, ensure_ascii=False, indent=2)

print("catalog.json saved successfully!")
