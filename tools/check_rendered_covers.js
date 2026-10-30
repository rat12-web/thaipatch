const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('catalog.json', 'utf8'));
const teams = JSON.parse(fs.readFileSync('teams.json', 'utf8'));
const platforms = JSON.parse(fs.readFileSync('platforms.json', 'utf8'));

const coreJs = fs.readFileSync('src/core.js', 'utf8');
const mediaJs = fs.readFileSync('src/catalog-media.js', 'utf8');

const vm = require('vm');
const sandbox = {
    GAME_CATALOG: catalog,
    TEAM_REGISTRY: teams,
    PLATFORM_REGISTRY: platforms,
    URL: URL,
    JSON: JSON,
    Set: Set,
    Map: Map,
    Number: Number,
    String: String,
    Object: Object,
    console: console
};
vm.createContext(sandbox);
vm.runInContext(coreJs, sandbox);
vm.runInContext(mediaJs, sandbox);

const groups = sandbox.groupGameEntries(catalog);
console.log(`Total groups/cards rendered: ${groups.length}`);

const missingCovers = [];
for (const g of groups) {
    const list = sandbox.coverCandidates(g);
    const art = list[0]?.url || '';
    if (!art) {
        missingCovers.push({
            id: g.id,
            title: g.title,
            platform: g.platform,
            grouped: g.grouped,
            variants: g.variants ? g.variants.map(v => `${v.title} (${v.source})`) : null
        });
    }
}

console.log(`Cards with missing art / empty cover: ${missingCovers.length}`);
for (const m of missingCovers) {
    console.log(`  - [${m.platform}] ${m.title} (grouped: ${m.grouped}): ${JSON.stringify(m.variants || m.id)}`);
}
