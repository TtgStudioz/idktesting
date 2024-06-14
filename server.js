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

        // Fetch HTML content from the provided URL
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML into cheerio
        const $ = cheerio.load(html);

        // Find the div without a class or id
        // For example, let's say you want to get the first div element
        const divText = $('div').first().text(); // or use any other appropriate selector

        // Check if we found any text
        if (divText) {
            // Return the text content as JSON response
            res.json({ text: divText });
        } else {
            res.json({ text: "Nothing here"});
            // If no text found, return an error or appropriate response
            // res.status(404).json({ error: 'No text found in the specified div' });
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
