// OpenWeatherMap API Key (replace 'your_api_key' with an actual API key)
const apiKey = 'fcc8de7015bbb202209bbf0261babf4c';
let isCelsius = true;

// Get Elements from the DOM
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const description = document.getElementById('description');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const sunriseSunset = document.getElementById('sunrise-sunset');
const forecastSection = document.getElementById('forecast');
const forecastDays = document.getElementById('forecast-days');
const weatherAlert = document.getElementById('weather-alert');
const unitToggle = document.getElementById('unit-toggle');
const localTime = document.getElementById('local-time');

// Function to Fetch Weather Data
async function fetchWeather(city) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (weatherData.cod === 200 && forecastData.cod === '200') {
            // Display current weather and forecast
            displayCurrentWeather(weatherData);
            displayForecast(forecastData);
            checkWeatherAlert(weatherData);
        } else {
            alert('City not found. Please enter a valid city.');
        }
    } catch (error) {
        alert('Failed to fetch weather data. Please try again.');
    }
}

// Function to Display Current Weather
function displayCurrentWeather(data) {
    cityName.textContent = data.name;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    description.textContent = `Weather: ${data.weather[0].description}`;
    const tempUnit = isCelsius ? '°C' : '°F';
    temperature.textContent = `Temperature: ${data.main.temp} ${tempUnit}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    sunriseSunset.textContent = `Sunrise: ${sunrise.toLocaleTimeString()} | Sunset: ${sunset.toLocaleTimeString()}`;

    weatherInfo.classList.remove('hidden');
    weatherInfo.style.display = 'block';
}

// Function to Display 5-Day Forecast
function displayForecast(data) {
    forecastDays.innerHTML = '';

    // Loop through forecast data and get 5-day forecast
    const days = [8, 16, 24, 32, 39]; // Corresponds to forecast times for every 3 hours
    days.forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';

        const date = new Date(data.list[day].dt * 1000);
        forecastDay.innerHTML = `
            <p>${date.toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${data.list[day].weather[0].icon}@2x.png" alt="Weather Icon">
            <p>${data.list[day].main.temp} ${isCelsius ? '°C' : '°F'}</p>
        `;

        forecastDays.appendChild(forecastDay);
    });

    forecastSection.classList.remove('hidden');
}

// Function to Check Weather Alert
function checkWeatherAlert(data) {
    if (data.weather[0].main === 'Thunderstorm' || data.weather[0].main === 'Rain') {
        weatherAlert.textContent = '⚠️ Weather Alert: Bad weather expected!';
        weatherAlert.classList.remove('hidden');
    } else {
        weatherAlert.classList.add('hidden');
    }
}

// Function to Toggle Temperature Unit
unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    }
});

// Search Button Click Event
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    }
});

// Display Local Time
function displayLocalTime() {
    const now = new Date();
    localTime.textContent = now.toLocaleString();
}

// Update Local Time every second
setInterval(displayLocalTime, 1000);
displayLocalTime();
