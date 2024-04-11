require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Welcome to the Weather API!');
});

app.get('/weather', async (req, res) => {
    const { lat, lon, apiKey } = req.query;

    if (!lat || !lon || !apiKey) {
        return res.status(400).send('Latitude, longitude, and API Key are required');
    }

    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat,
                lon,
                appid: apiKey
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).send("Error fetching weather data");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
