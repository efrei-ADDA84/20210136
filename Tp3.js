const express = require('express');
const axios = require('axios');
const prometheus = require('prom-client');
require('dotenv').config();

const app = express();
const port = 8080;

const API_KEY = process.env.OPENWEATHER_API_KEY;

const counter = new prometheus.Counter({
    name: 'weather_requests_processed_total',
    help: 'Total number of weather requests processed',
});

prometheus.register.registerMetric(counter);

app.get('/', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const weatherData = response.data;
        const cityName = weatherData.name;
        const weatherDescription = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;
        const weatherOutput = `${cityName}: ${weatherDescription}. Temperature: ${temperature}°C.`;

        
        counter.inc();

        res.send(weatherOutput);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});

app.get('/metrics', (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(prometheus.register.metrics());
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
