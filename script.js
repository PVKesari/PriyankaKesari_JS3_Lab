const API_KEY = '71b31c7a8a2ff6ff75d504e57bba1219';
const searchForm = document.querySelector('#search-form');
const locationInput = document.querySelector('#location-input');
const errorDisplay = document.querySelector('#error-display');
const weatherDisplay = document.querySelector('#weather-display');
const locationDisplay = document.querySelector('#location-display');
const dateTimeDisplay = document.querySelector('#date-time-display');
const temperatureDisplay = document.querySelector('#temperature-display');
const descriptionDisplay = document.querySelector('#description-display');
const humidityDisplay = document.querySelector('#humidity-display');
const windDisplay = document.querySelector('#wind-display');
const weatherImage = document.querySelector('#weather-image');

window.onload = function() {
  const searchInput = document.getElementById("location-input");
  
  // Set focus on search input element
  searchInput.focus();
  
  // Get the weather data when the user presses the enter key
  searchInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      getWeatherData();
      searchInput.value = "";
    }
  });


  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const location = locationInput.value.trim();
    if (!location) {
      showError('Please enter a location.');
      return;
    }

    try {
      const weatherData = await getWeatherData(location);
      showWeather(weatherData);
    } catch (error) {
      showError('An error occurred while fetching weather data.');
      console.error(error);
    }
  });

  async function getWeatherData(location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    if (data.cod !== 200) {
      throw new Error(`API error: ${data.message}`);
    }
    return data;
  }

  function showWeather(data) {
    locationDisplay.textContent = `${data.name}, ${data.sys.country}`;
    dateTimeDisplay.textContent = getDateTime(data.dt, data.timezone);
    temperatureDisplay.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionDisplay.textContent = data.weather[0].description.toUpperCase();
    humidityDisplay.textContent = `Humidity: ${data.main.humidity}%`;
    windDisplay.textContent = `Wind: ${data.wind.speed} km/h`;
    weatherImage.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    weatherImage.alt = data.weather[0].description;

    weatherDisplay.classList.remove('hidden');
    errorDisplay.classList.add('hidden');
    locationInput.value = '';
  }

  function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
  }

  function getDateTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    const options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options);
  }
}