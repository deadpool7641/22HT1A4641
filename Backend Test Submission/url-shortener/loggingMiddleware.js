const fetch = require('node-fetch'); // npm install node-fetch

const LOG_API_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';
const LOG_AUTHORIZATION = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMmh0MWE0NjQxQGdtYWlsLmNvbSIsImV4cCI6MTc1NzEzODk5OSwiaWF0IjoxNzU3MTM4MDk5LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZWQ4ZmE0NjctMGQyZi00MDZhLWEwMTgtMmIzNjUxZTQ1ZGY5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFsbGUgZ2FuZXNoIiwic3ViIjoiMzViZTkyM2YtMzQzYS00YmQ1LWE4MTYtNTE5ZDU2Nzk3YjY4In0sImVtYWlsIjoiMjJodDFhNDY0MUBnbWFpbC5jb20iLCJuYW1lIjoibWFsbGUgZ2FuZXNoIiwicm9sbE5vIjoiMjJodDFhNDY0MSIsImFjY2Vzc0NvZGUiOiJRZnpuZGsiLCJjbGllbnRJRCI6IjM1YmU5MjNmLTM0M2EtNGJkNS1hODE2LTUxOWQ1Njc5N2I2OCIsImNsaWVudFNlY3JldCI6IkFZV0txVlJDSk5lanBERFAifQ.oyf5Pge44EgqFBnjy1y0tczz7vnkahVqIX_YxAsBrDg'; // Replace with actual token

async function log(stack, level, pkg, message) {
    try {
        const res = await fetch(LOG_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': LOG_AUTHORIZATION
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message
            })
        });
        if (!res.ok) {
            const text = await res.text();
            console.error('Failed to log:', text);
        }
    } catch (err) {
        console.error('Logging middleware error:', err.message);
    }
}

module.exports = log;