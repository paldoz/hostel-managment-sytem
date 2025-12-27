// Test announcements API
const testUrl = 'http://localhost:3000/api/announcements';

console.log('Testing Announcements API...\n');

// Test POST
const testData = {
    title: 'Test Announcement',
    content: 'This is a test',
    type: 'info',
    targetStudentIds: []
};

console.log('Sending POST request with data:', JSON.stringify(testData, null, 2));

fetch(testUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
})
    .then(res => {
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        return res.json();
    })
    .then(data => {
        console.log('Response data:', JSON.stringify(data, null, 2));
    })
    .catch(err => {
        console.error('Error:', err.message);
    });
