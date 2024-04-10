require('dotenv').config();


const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

app.get('/', async (req, res) => {
    try {
       
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: LATITUDE,
                lon: LONGITUDE,
                appid: API_KEY
            }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(8080, () => {
    console.log("Check Weather on port 8080");
});
