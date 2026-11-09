# Exact Patch navigation: source-side limitations

2026-10-13 targeted evidence: qa/upgrade/discovery.json, 90s.html and murphy.html. Existing confirmed routes were reused. No external creator website was modified.

ROMMEAOW's two catalog entries now go straight to https://rommeaow.com/#patch. A real native catalog click opens the visible Patch Lab. The source identifies the user's own ROM by checksum or permits manual selection; this URL does not preselect a game.

The remaining known source-card routes are 18 90S games, three Murphy games and Maewdam's Dragon Quest III. Their source code does not expose an observed URL-to-selected-Patch handler. Native browser navigation cannot invoke a function or set a form value inside another origin. A #patch anchor without game selection would open the wrong default game on 90S. These 22 catalog links therefore keep their measured exact-game card targets and are not labeled as verified automatic Patch selection. Facebook's one login-limited post is separately unresolved.

## 90S owner integration contract (proposal, NOT APPLIED)

The owner can add the following after creating the game options and defining syncGame/PC. It uses the already observed game IDs, requires no backend and rejects unknown IDs:

```js
const requestedGame = new URL(location.href).searchParams.get('game');
if (requestedGame && GAMES.some(game => game.id === requestedGame)) {
  pgame.value = requestedGame;
  syncGame();
  PC.show();
  if (location.hash === '#patch') {
    document.getElementById('patch')?.scrollIntoView();
  }
}
```

After an authorized owner deployment, verify every one of the 18 URLs in a fresh browser context: selected option equals the requested ID, patch warnings/CRC match that game and the Patch section is visible. The first game's default matching by coincidence is not proof. Only then replace the catalog's card-target links with ?game=<observed-id>#patch and set autoSelectsPatch=true.

## Murphy and Maewdam

Murphy needs a URL handler after its game data finishes loading that validates the game ID and invokes the existing openGamePatch flow. Preserve its disabled/future/protected-game checks. Maewdam needs its own route/search-parameter selection in the component that owns the game-dialog state. No game IDs or access gates should be guessed or bypassed.

NEXT_ACTION_OWNER: CHAT — coordinate an owner-provided route or owner-side implementation. Authorization to publish romthai.app's catalog does not authorize changing other teams' websites. This proposal has not been applied or certified on the live sources.

## Facebook-only creators: per-game post links (2026-11-06)

Round two of the link audit replaced page-level and shared Facebook links with the exact post for the game where one could be found. 24 entries now use a creator post permalink and 13 `ตลับเกมภาษาไทย` entries use the team's own per-game page (`haasbeat.github.io/talub-game-thai/game.html?game=<slug>`, the site the page itself announces).

Still not a per-game post (11 entries). These are recorded honestly in the catalog as `linkScope: owner_page` (9) or `linkScope: mismatched_post` + `sourceAudit.state: unresolved` (2). They are not claimed as verified game posts:

| Entry | Team | Current target | Why it is still open |
| --- | --- | --- | --- |
| ext-db-012 Metal Max 4 | ตลับเกมภาษาไทย | facebook.com/talubgamethai | Game is not on the team site; no per-game post found |
| ext-db-083 E.X. Troopers | ตลับเกมภาษาไทย | facebook.com/talubgamethai | Only untitled `Release` template posts found |
| ext-db-176 Cardfight!! Vanguard G | ตลับเกมภาษาไทย | facebook.com/talubgamethai | No per-game post found |
| ext-db-008 Wagamama Fairy Mirumo de Pon | น้า_auns555 | facebook.com/auns555toys | Only a multi-game GBA progress post |
| ext-db-020 Crayon Shin-Chan | น้า_auns555 | facebook.com/auns555toys | Only multi-game progress posts |
| ext-db-111 Dragon Ball: Mystery of Shenron | Gadget Door | facebook.com/GadgetdoorFanpage | No per-game post on the page |
| ext-db-182 Atelier Lise | นักป้ายยา | facebook.com/druglabeler | 46 page posts harvested, game not present |
| ext-db-198 Spice and Wolf | นักป้ายยา | facebook.com/druglabeler | 46 page posts harvested, game not present |
| ext-db-209 Lina no Atelier | นักป้ายยา | facebook.com/druglabeler | 46 page posts harvested, game not present |
| ext-db-003 Harobots | Chira Ae | share/p/1dirDcoMYm | Link opens a น้า_auns555 post, not the credited translator |
| ext-db-214 Final Fantasy VI Advance | Kenghot | share/p/18tgQMpYRG | Link opens a third-party GBA walkthrough post |

Two further caveats found while verifying:

- `ext-db-006` Rockman DASH now points at the creator's own post, but that post is `แจกฟรี! บทสรุป Rockman DASH [PS1]` (a walkthrough), so the entry's patch claim needs its own review.
- `retro-201` River City Ransom EX: the old `share/p/1CNBmftiFj` link now returns "เนื้อหานี้ไม่พร้อมใช้งาน", so the entry points at the Andaplus article that names น้า_auns555 as the translator.

Search limitation: Facebook's public search results only expose a permalink anchor when the result is rendered; old posts of small pages are not always indexed. Deep page scrolling works (in-app browser, logged-in session) but each page keeps only a limited window of posts, so absence of a hit is not proof the post does not exist.
