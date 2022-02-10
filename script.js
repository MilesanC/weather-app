const APIkey = "5c22c923e1496b8c08f6409b48327fd6";
const searchBtn = document.querySelector(".button");
const searchBar = document.querySelector(".search-bar");
const secCard = document.querySelector(".section-card");
const city = document.querySelector(".city");

const getWeather = async function (location) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/find?q=${location}&units=metric&appid=${APIkey}`
    );
    const data = await res.json();
    const { lat: lat, lon: lon } = data.list[0].coord;
    const part = "current";

    const resForcast = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIkey}`
    );
    const dataForcast = await resForcast.json();
    renderWeather(data, dataForcast);
  } catch (err) {
    console.error(err);
  }
};

const renderWeather = function (data, dataForcast) {
  const weatherObject = data;
  const weatherData = weatherObject.list[0];
  const date = new Date();
  console.log(weatherData);
  const markup = `
  <div class="card">
  <div class="info">
    <div class="temp-info">
      <h1 class="city">${weatherData.name}</h1>
      <span><p class="date">${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}</p></span>
      <h2 class="temp">${Math.round(weatherData.main.temp)}°C</h2>
      <p class="weather">${weatherData.weather[0].main}</p>
      <p class="min-max">min: ${Math.round(weatherData.main.temp_min)}°C/max: ${Math.round(weatherData.main.temp_max)}°C</p>
    </div>
    <div class="other-info">
      <div class="humidity small-info">
        <p class="small-partange">${weatherData.main.humidity}%</p>
        <span class="small-text">Humidity</span>
      </div>
      <div class="wind small-info">
        <p class="small-partange">${weatherData.wind.speed}m/s</p>
        <span class="small-text">Wind speed</span>
      </div>
      <div class="cloudiness small-info">
        <p class="small-partange">${weatherData.clouds.all}%</p>
        <span class="small-text">Cloudiness</span>
      </div>
    </div>
  </div>
</div>
    `;
    secCard.innerHTML = '';
    secCard.insertAdjacentHTML("afterbegin", markup);
  console.log(dataForcast);
};

searchBtn.addEventListener("click", function () {
  getWeather(searchBar.value);
  searchBar.value = "";
});