// Check what the actual error is
const testUrl = 'http://localhost:3000/api/announcements';

fetch(testUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Test',
        content: 'Test content',
        type: 'info',
        targetStudentIds: []
    })
})
    .then(res => res.text())
    .then(text => {
        console.log('Response:', text);
    })
    .catch(err => console.error('Error:', err));
