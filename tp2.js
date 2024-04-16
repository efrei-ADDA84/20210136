const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

const API_KEY = process.env.API_KEY;


app.get('/', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const weatherData = response.data;
        const cityName = weatherData.name;
        const weatherDescription = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;
        const weatherOutput = `${cityName}: ${weatherDescription}. Temperature: ${temperature}°C.`;

        res.send(weatherOutput);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
  });