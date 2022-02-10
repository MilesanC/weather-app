const APIkey = "5c22c923e1496b8c08f6409b48327fd6";
const searchBtn = document.querySelector(".button");
const searchBar = document.querySelector(".search-bar");
const secCard = document.querySelector(".section-card");
const city = document.querySelector(".city");
const daily = document.querySelector(".daily-container");

const getWeather = async function (location) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/find?q=${location}&units=metric&appid=${APIkey}`
    );
    const data = await res.json();
    const { lat: lat, lon: lon } = data.list[0].coord;

    const resForcast = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${APIkey}`
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
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const markupWeather = `
  <div class="card">
  <div class="info">
    <div class="temp-info">
      <h1 class="city">${weatherData.name}</h1>
      <span><p class="date">${date.getDate()} ${date
    .toDateString()
    .slice(4, 7)} ${date.getFullYear()}</p></span>
      <h2 class="temp">${Math.round(weatherData.main.temp)}°C</h2>
      <p class="weather">${weatherData.weather[0].main}</p>
      <p class="min-max">min: ${Math.round(
        weatherData.main.temp_min
      )}°C/max: ${Math.round(weatherData.main.temp_max)}°C</p>
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
  secCard.innerHTML = "";
  secCard.insertAdjacentHTML("afterbegin", markupWeather);

  const daysArr = dataForcast.daily
  const [day0, day1, day2, day3, day4, day5, day6] = daysArr;
  console.log(day0)

  const markupDaily = `
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 1) % 7]}</p>
            <p class="daily daily-weather">${day0.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day0.temp.day)}°C</p>
            <p class="daily daily-temp">Night: ${Math.round(day0.temp.night)}°C</p>
            <button class="daily button-daily" id="btn1">+</button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 2) % 7]}</p>
            <p class="daily daily-weather">${day1.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day1.temp.day)}°C</p>
            <p class="daily daily-temp">Night: ${Math.round(day1.temp.night)}°C</p>
            <button class="daily button-daily" id="btn2">+</button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 3) % 7]}</p>
            <p class="daily daily-weather">${day2.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day2.temp.day)}°C</p>
            <p class="daily daily-temp">Night: ${Math.round(day2.temp.night)}°C</p>
            <button class="daily button-daily" id="btn3">+</button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 4) % 7]}</p>
            <p class="daily daily-weather">${day3.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day3.temp.day)}°C</p>
            <p class="daily daily-temp">Night: ${Math.round(day3.temp.night)}°C</p>
            <button class="daily button-daily" id="btn4">+</button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 5) % 7]}</p>
            <p class="daily daily-weather">${day4.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day4.temp.day)}°C</p>
            <p class="daily daily-temp">Night: ${Math.round(day4.temp.night)}°C</p>
            <button class="daily button-daily" id="btn5">+</button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 6) % 7]}</p>
            <p class="daily daily-weather">${day5.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day5.temp.day)}°C</p>
            <p class="daily daily-temp">Night: ${Math.round(day5.temp.night)}°C</p>
            <button class="daily button-daily" id="btn6">+</button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 7) % 7]}</p>
            <p class="daily daily-weather">${day6.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day6.temp.day)}°C</p>
            <p class="daily daily-temp">Night: ${Math.round(day6.temp.night)}°C</p>
            <button class="daily button-daily" id="btn7">+</button>
          </div>
  `;
  daily.innerHTML = "";
  daily.insertAdjacentHTML("beforeend", markupDaily);
};

searchBtn.addEventListener("click", function () {
  getWeather(searchBar.value);
  searchBar.value = "";
});
