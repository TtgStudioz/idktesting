const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS (if needed)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    try {
        const url = req.query.url; // Get the 'url' query parameter
        const className = req.query.className; // Get the 'className' query parameter

        if (!url || !className) {
            return res.status(400).json({ error: 'Missing required query parameters: url and className' });
        }

        // Fetch HTML content from the provided URL
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML into cheerio
        const $ = cheerio.load(html);

        // Find all divs with the specified class name and get their text content
        let divTexts = [];
        $(`.${className}`).each((index, element) => {
            let text = '';
            $(element).contents().each((i, el) => {
                if (el.type === 'text') {
                    text += $(el).text().trim();
                } else if (el.type === 'tag') {
                    text += $(el).text().trim();
                }
            });
            divTexts.push(text);
        });

        // Return the text content as JSON response
        if (divTexts.length > 0) {
            res.json({ texts: divTexts });
        } else {
            res.json({ texts: "Nothing here" });
        }
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        res.status(500).json({ error: 'Failed to fetch or parse data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
