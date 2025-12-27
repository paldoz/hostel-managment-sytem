async function main() {
    try {
        const res = await fetch('http://localhost:3004/api/announcements?t=' + Date.now());
        const data = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', data);
    } catch (e) {
        console.error('Fetch fail:', e.message);
    }
}
main();
