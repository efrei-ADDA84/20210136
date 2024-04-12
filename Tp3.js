const express = require('express');
const axios = require('axios');
const prometheus = require('prom-client');
require('dotenv').config();

const app = express();

const API_KEY = process.env.API_KEY;

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

app.get('/metrics', async (req, res) => {
    try {
        const metrics = await prometheus.register.metrics();
        res.set('Content-Type', prometheus.register.contentType);
        res.end(metrics.toString());
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).send('Error fetching metrics');
    }
});



app.listen(() => {
    console.log(`Server listening`);
});
