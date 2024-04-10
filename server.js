require('dotenv').config();

const axios = require('axios');

const API_KEY = process.env.API_KEY;
const LATITUDE = process.env.LAT;
const LONGITUDE = process.env.LONG;

async function fetchWeatherData() {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                lat: LATITUDE,
                lon: LONGITUDE,
                appid: API_KEY
            }
        });
        
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
}

fetchWeatherData();
