const express = require('express');
const axios = require('axios');
const app = express();

const PORT = 8080;
const API_KEY = process.env.API_KEY;

console.log("API_KEY:", API_KEY);

app.get('/', (req, res) => {
    res.send('Welcome to the Weather API !');
});

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon || !API_KEY) {
        return res.status(400).send(`Latitude, longitude API Key are required. ${API_KEY}`);
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
