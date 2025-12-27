// Test without targetStudentIds
const testUrl = 'http://localhost:3000/api/announcements';

fetch(testUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Simple Test',
        content: 'Test content without targeting',
        type: 'info'
        // Removing targetStudentIds completely
    })
})
    .then(res => res.text())
    .then(text => {
        console.log('Response:', text);
    })
    .catch(err => console.error('Error:', err));
