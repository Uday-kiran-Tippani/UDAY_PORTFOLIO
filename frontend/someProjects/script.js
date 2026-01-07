const cities = [
  "Nidadavole", "London", "Tokyo", "Paris", "Sydney",
  "Delhi", "Moscow", "Cape Town", "Beijing", "Rio de Janeiro"
];
const apiKey = "392f64ab02624a7b0fa53d7200c9621e";
const weatherContainer = document.getElementById("weather-container");
const resultContainer = document.getElementById("search-result");
let isCelsius = true;

// Load weather data
function updateWeather() {
  weatherContainer.innerHTML = "";
  cities.forEach(city => getWeather(city, weatherContainer));
}
updateWeather();
setInterval(updateWeather, 10 * 60 * 1000); // auto-refresh

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("search-input").value.trim();
  if (city) {
    resultContainer.innerHTML = "";
    getWeather(city, resultContainer);
    document.getElementById("search-input").value = "";
  }
});

const celsiusRadio = document.getElementById("celsius-radio");
const fahrenheitRadio = document.getElementById("fahrenheit-radio");
const unitSlider = document.getElementById("unit-slider");

celsiusRadio.addEventListener("change", () => {
  if (celsiusRadio.checked) {
    isCelsius = true;
    unitSlider.style.left = "2px";
    reloadWeatherData();
  }
});

fahrenheitRadio.addEventListener("change", () => {
  if (fahrenheitRadio.checked) {
    isCelsius = false;
    unitSlider.style.left = "calc(50% + 2px)";
    reloadWeatherData();
  }
});

function reloadWeatherData() {
  updateWeather();
  if (resultContainer.children.length > 0) {
    const city = resultContainer.querySelector("h2").innerText.split(",")[0];
    resultContainer.innerHTML = "";
    getWeather(city, resultContainer);
  }
}


async function getWeather(city, container) {
  const unit = isCelsius ? "metric" : "imperial";
  const symbol = isCelsius ? "°C" : "°F";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="temp">${Math.round(data.main.temp)}${symbol}</div>
        <div class="description">${data.weather[0].description}</div>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
      `;
      card.addEventListener("click", () => {
        const weatherMain = data.weather[0].main.toLowerCase();
        showWeatherEffect(weatherMain);
      });
      container.appendChild(card);
    } else {
      container.innerHTML = `<p style="color:red;">${data.message}</p>`;
    }
  } catch (error) {
    container.innerHTML = `<p style="color:red;">Error fetching weather</p>`;
    console.error(error);
  }
}

function showWeatherEffect(weatherType) {
  const modal = document.getElementById("weather-modal");
  const effectContainer = document.getElementById("effect-container");

  let bg = "";
  if (weatherType.includes("rain")) {
    bg = "url('https://media.giphy.com/media/3o7btXJQm5DD8F5p4w/giphy.gif')";
  } else if (weatherType.includes("thunder")) {
    bg = "url('https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif')";
  } else if (weatherType.includes("snow")) {
    bg = "url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')";
  } else if (weatherType.includes("clear")) {
    bg = "url('https://media.giphy.com/media/3oz8xLd9DJq2l2VFtu/giphy.gif')";
  } else {
    bg = "url('https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif')";
  }

  effectContainer.style.backgroundImage = bg;
  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("weather-modal").classList.add("hidden");
}

// Clock
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  document.getElementById("clock").innerText = `🕒 Time: ${time}`;
  document.getElementById("current-date").innerText = `📅 Date: ${date}`;
}
setInterval(updateClock, 1000);
updateClock();
