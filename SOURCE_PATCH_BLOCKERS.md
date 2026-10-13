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
