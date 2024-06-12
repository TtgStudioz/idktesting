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

        // Fetch HTML content from the provided URL
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML into cheerio
        const $ = cheerio.load(html);

        // Find all elements with the specified class name
        const elements = $(`.${className}`);

        // Check if any elements were found
        if (elements.length > 0) {
            // Array to hold text content of all matching elements
            const texts = [];
            elements.each((index, element) => {
                // Push each element's text content to the texts array
                texts.push($(element).text().trim());
            });
            // Return the array of text contents as JSON response
            res.json({ texts });
        } else {
            res.json({ texts: [] });
            // If no elements found, return an appropriate response
            // res.status(404).json({ error: 'No elements found with the specified class name' });
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
