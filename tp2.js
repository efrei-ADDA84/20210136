require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Welcome to the Weather API!');
});


const API_KEY = process.env.API_KEY;

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).send('Latitude and longitude are required');
    }

    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat,
                lon,
                appid: API_KEY
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
