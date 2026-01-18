const fetch = require('node-fetch'); // unlikely to be available without install, use http
const http = require('http');

const url = "http://localhost:9002/api/unified-search?subcategory=coaching-and-mentoring";

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Body:', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
