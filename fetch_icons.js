const API_KEY = '6b4aded92ffde76b308bc2a6ccf86dfc8c3b0d53b3a79bd5aef179b73e5a3c9b';
const API_URL = 'https://api.macosicons.com/api/v1/search';

const queries = [
    'Finder', 'Safari', 'Mail', 'Notes', 'System Settings', 'Launchpad', 'Terminal', 'Spotify',
    'GitHub', 'Discord', 'Calculator', 'Camera', 'Chess', 'Folder', 'App Store', 'Photos',
    'Messages', 'Maps', 'Clock', 'FaceTime', 'Calendar', 'Reminders', 'Music', 'TV',
    'Podcasts', 'Stocks', 'News', 'Home', 'Wallet', 'Shortcuts', 'Books', 'Preview',
    'Find My', 'Automator', 'TextEdit', 'Dictionary', 'Contacts', 'Stickies', 'Voice Memos'
];

async function fetchIcon(query) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ query })
        });
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
            // Find the one with the most downloads or just the first hit
            const hit = data.hits[0];
            return { query, url: hit.lowResPngUrl || hit.icnsUrl };
        }
    } catch (e) {
        console.error(`Error fetching ${query}:`, e.message);
    }
    return { query, url: null };
}

async function main() {
    const results = {};
    for (const q of queries) {
        console.log(`Fetching ${q}...`);
        const res = await fetchIcon(q);
        if (res.url) {
            results[q.toLowerCase().replace(/ /g, '')] = res.url;
        }
        // Respect rate limits if any (docs say 2 per second max)
        await new Promise(r => setTimeout(r, 600));
    }
    console.log('--- RESULTS ---');
    const out = JSON.stringify(results, null, 2);
    console.log(out);
    require('fs').writeFileSync('results.json', out);
}

main();
