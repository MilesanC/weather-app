const APIkey = "5c22c923e1496b8c08f6409b48327fd6";
const searchForm = document.querySelector(".form");
const searchBar = document.querySelector(".search-bar");
const secCard = document.querySelector(".section-card");
const city = document.querySelector(".city");
const daily = document.querySelector(".daily-container");
const overlayModel = document.querySelector(".overlay");
const model = document.querySelector(".model");
const btnCloseModel = document.querySelector(".close-model");
const modelInfo = document.querySelector(".model-info");

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
    const markupErr = `
          <div class="error-msg">
            <svg class="svg-icon__error" viewBox="0 0 20 20">
            <path d="M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221"></path>
            </svg>
            <p class="error-info">City not found!</p>
            <p class="error-info">Check for mistakes in spelling or try to find another city</p>
          </div>
    `;
    const markupErrDaily = `
            <p class="info-msg">
              Writte in english the name of the city you want to check the
              weather!
            </p>
    `;
    secCard.innerHTML = "";
    secCard.insertAdjacentHTML("afterbegin", markupErr);
    daily.innerHTML = "";
    daily.insertAdjacentHTML("beforeend", markupErrDaily);
  }
};

const getIcon = function (weather) {
  const iconId = (weather.weather[0].id + "").slice(0, -2);
  if (iconId === "2") {
    const iconSvg = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M10.841,13.784c0-0.232-0.188-0.421-0.42-0.421c-0.116,0-0.222,0.048-0.297,0.124l-2.522,2.521c-0.076,0.077-0.123,0.183-0.123,0.298c0,0.232,0.188,0.421,0.42,0.421h1.508l-1.805,1.805c-0.076,0.076-0.123,0.182-0.123,0.298c0,0.232,0.188,0.42,0.42,0.42c0.116,0,0.222-0.047,0.298-0.123l2.522-2.523c0.076-0.075,0.123-0.181,0.123-0.297c0-0.232-0.188-0.42-0.42-0.42h0H8.913l1.805-1.805C10.794,14.005,10.841,13.9,10.841,13.784 M6.216,14.205c-0.116,0-0.221,0.047-0.297,0.123l-2.522,2.522c-0.077,0.076-0.124,0.181-0.124,0.297c0,0.232,0.188,0.421,0.421,0.421c0.116,0,0.221-0.047,0.297-0.123l2.523-2.523c0.077-0.075,0.123-0.181,0.123-0.297C6.636,14.394,6.448,14.205,6.216,14.205M16.722,5.063c0.001-0.036,0.006-0.072,0.006-0.109c0-1.393-1.13-2.523-2.523-2.523c-0.635,0-1.215,0.237-1.658,0.625C11.648,1.671,10.094,0.75,8.318,0.75c-2.533,0-4.623,1.867-4.985,4.299C1.853,5.401,0.75,6.729,0.75,8.318c0,1.857,1.506,3.363,3.364,3.363h11.773c1.857,0,3.363-1.506,3.363-3.363C19.25,6.75,18.174,5.436,16.722,5.063 M15.887,10.841H4.114c-1.391,0-2.523-1.132-2.523-2.523c0-1.172,0.796-2.18,1.938-2.451c0.334-0.079,0.587-0.354,0.638-0.694c0.303-2.042,2.088-3.582,4.152-3.582c1.425,0,2.321,0.299,3.102,1.502c0.132,0.205,0.768,0.762,1.009,0.796c0.039,0.006,0.117,0.008,0.117,0.008c0.202,0,0.398-0.072,0.554-0.208c0.307-0.269,0.699-0.417,1.104-0.417c0.928,0,1.683,0.755,1.682,1.691l-0.005,0.062c-0.018,0.398,0.246,0.754,0.632,0.853c1.116,0.286,1.896,1.289,1.896,2.44C18.409,9.709,17.277,10.841,15.887,10.841 M15.045,14.205c-0.116,0-0.221,0.047-0.297,0.123l-2.522,2.522c-0.076,0.076-0.123,0.181-0.123,0.297c0,0.232,0.188,0.421,0.42,0.421c0.116,0,0.221-0.047,0.298-0.123l2.522-2.523c0.076-0.075,0.123-0.181,0.123-0.297C15.466,14.394,15.277,14.205,15.045,14.205"></path>
  </svg>`;
    return iconSvg;
  } else if (iconId === "3") {
    const iconSvg = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M16.903,5.793c0.001-0.037,0.006-0.074,0.006-0.111c0-1.431-1.161-2.591-2.591-2.591c-0.653,0-1.248,0.244-1.704,0.642c-0.922-1.424-2.518-2.369-4.342-2.369c-2.601,0-4.748,1.918-5.119,4.415C1.633,6.141,0.5,7.504,0.5,9.136c0,1.908,1.546,3.455,3.455,3.455h12.09c1.908,0,3.455-1.547,3.455-3.455C19.5,7.525,18.395,6.176,16.903,5.793 M16.045,11.728H3.955c-1.429,0-2.591-1.162-2.591-2.591c0-1.203,0.818-2.239,1.99-2.518c0.343-0.081,0.603-0.364,0.654-0.712C4.32,3.809,6.153,2.228,8.272,2.228c1.464,0,2.385,0.306,3.186,1.543c0.136,0.21,0.789,0.783,1.037,0.817c0.04,0.006,0.119,0.008,0.119,0.008c0.208,0,0.41-0.074,0.568-0.213c0.315-0.276,0.72-0.429,1.136-0.429c0.952,0,1.727,0.775,1.726,1.736l-0.003,0.063c-0.02,0.409,0.252,0.774,0.648,0.876c1.146,0.294,1.947,1.324,1.947,2.506C18.637,10.565,17.475,11.728,16.045,11.728 M9.136,15.182c0,0.477,0.387,0.863,0.864,0.863c0.477,0,0.864-0.387,0.864-0.863c0-0.863-0.864-1.727-0.864-1.727S9.136,14.318,9.136,15.182 M4.818,17.772c0,0.478,0.387,0.864,0.863,0.864c0.477,0,0.864-0.387,0.864-0.864c0-0.863-0.864-1.728-0.864-1.728S4.818,16.909,4.818,17.772M13.454,16.909c0,0.477,0.388,0.863,0.864,0.863s0.863-0.387,0.863-0.863c0-0.864-0.863-1.728-0.863-1.728S13.454,16.045,13.454,16.909"></path>
  </svg>`;
    return iconSvg;
  } else if (iconId === "5") {
    const iconSvg = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M9.153,14.656c0-0.233-0.189-0.423-0.423-0.423c-0.117,0-0.223,0.047-0.299,0.124l-2.539,2.539c-0.077,0.078-0.125,0.183-0.125,0.3c0,0.234,0.19,0.423,0.423,0.423c0.117,0,0.223-0.047,0.299-0.123l2.54-2.54C9.106,14.88,9.153,14.773,9.153,14.656 M6.614,14.656c0-0.233-0.19-0.423-0.423-0.423c-0.117,0-0.223,0.047-0.3,0.124l-2.539,2.539c-0.077,0.078-0.125,0.183-0.125,0.3c0,0.234,0.19,0.423,0.423,0.423c0.117,0,0.223-0.047,0.299-0.123l2.54-2.54C6.566,14.88,6.614,14.773,6.614,14.656 M11.693,14.656c0-0.233-0.19-0.423-0.424-0.423c-0.116,0-0.223,0.047-0.299,0.124l-2.539,2.539c-0.077,0.078-0.125,0.183-0.125,0.3c0,0.234,0.19,0.423,0.423,0.423c0.117,0,0.223-0.047,0.299-0.123l2.54-2.54C11.646,14.88,11.693,14.773,11.693,14.656 M13.81,14.233c-0.116,0-0.223,0.047-0.3,0.124l-2.539,2.539c-0.078,0.078-0.125,0.183-0.125,0.3c0,0.234,0.189,0.423,0.423,0.423c0.117,0,0.223-0.047,0.3-0.123l2.539-2.54c0.077-0.076,0.124-0.183,0.124-0.3C14.232,14.423,14.043,14.233,13.81,14.233 M16.767,6.724c0.002-0.037,0.006-0.073,0.006-0.11c0-1.402-1.138-2.54-2.54-2.54c-0.64,0-1.223,0.238-1.67,0.629c-0.903-1.396-2.468-2.322-4.256-2.322c-2.549,0-4.654,1.88-5.018,4.328C1.798,7.063,0.688,8.401,0.688,10c0,1.87,1.516,3.387,3.386,3.387h11.852c1.87,0,3.387-1.517,3.387-3.387C19.312,8.421,18.229,7.099,16.767,6.724 M15.926,12.54H4.074c-1.4,0-2.54-1.14-2.54-2.54c0-1.18,0.802-2.194,1.951-2.468c0.336-0.079,0.59-0.356,0.642-0.698c0.306-2.056,2.103-3.606,4.18-3.606c1.436,0,2.337,0.3,3.122,1.513c0.134,0.206,0.773,0.768,1.017,0.801c0.039,0.006,0.117,0.008,0.117,0.008c0.204,0,0.402-0.073,0.558-0.209c0.31-0.271,0.705-0.42,1.112-0.42c0.935,0,1.693,0.759,1.692,1.702l-0.004,0.062c-0.018,0.401,0.247,0.759,0.637,0.858c1.123,0.288,1.908,1.298,1.908,2.457C18.466,11.4,17.326,12.54,15.926,12.54"></path>
  </svg>`;
    return iconSvg;
  } else if (iconId === "6") {
    const iconSvg = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M7.409,12.653c-0.477,0-0.864,0.388-0.864,0.863c0,0.478,0.387,0.864,0.864,0.864s0.864-0.387,0.864-0.864C8.273,13.041,7.886,12.653,7.409,12.653 M4.818,16.972c-0.477,0-0.864,0.387-0.864,0.863c0,0.478,0.387,0.864,0.864,0.864c0.476,0,0.863-0.387,0.863-0.864C5.682,17.358,5.294,16.972,4.818,16.972 M3.091,14.381c-0.477,0-0.864,0.387-0.864,0.863s0.387,0.864,0.864,0.864s0.864-0.388,0.864-0.864S3.567,14.381,3.091,14.381 M10,16.108c-0.477,0-0.864,0.387-0.864,0.863S9.523,17.835,10,17.835s0.864-0.387,0.864-0.863S10.477,16.108,10,16.108 M14.318,14.381c0-0.477-0.388-0.864-0.864-0.864s-0.863,0.388-0.863,0.864c0,0.478,0.387,0.863,0.863,0.863S14.318,14.858,14.318,14.381 M16.903,4.992c0.002-0.037,0.006-0.074,0.006-0.111c0-1.431-1.16-2.591-2.591-2.591c-0.653,0-1.248,0.244-1.704,0.642c-0.922-1.424-2.518-2.369-4.341-2.369c-2.601,0-4.748,1.918-5.119,4.415C1.633,5.34,0.5,6.703,0.5,8.335c0,1.908,1.547,3.455,3.455,3.455h12.091c1.907,0,3.454-1.547,3.454-3.455C19.5,6.724,18.396,5.375,16.903,4.992 M16.046,10.926H3.955c-1.429,0-2.591-1.162-2.591-2.591c0-1.204,0.817-2.238,1.99-2.517c0.343-0.081,0.603-0.364,0.655-0.713C4.32,3.007,6.153,1.426,8.273,1.426c1.464,0,2.384,0.306,3.185,1.543c0.136,0.21,0.789,0.783,1.037,0.817c0.04,0.006,0.119,0.009,0.119,0.009c0.208,0,0.41-0.075,0.568-0.214c0.315-0.275,0.72-0.428,1.136-0.428c0.952,0,1.728,0.775,1.726,1.737L16.04,4.953c-0.019,0.409,0.253,0.775,0.648,0.876c1.147,0.293,1.948,1.324,1.948,2.506C18.637,9.764,17.475,10.926,16.046,10.926 M16.909,15.244c-0.477,0-0.863,0.388-0.863,0.864c0,0.478,0.387,0.863,0.863,0.863s0.863-0.386,0.863-0.863C17.772,15.632,17.386,15.244,16.909,15.244 M14.318,17.835c-0.477,0-0.864,0.387-0.864,0.864c0,0.477,0.388,0.863,0.864,0.863s0.863-0.387,0.863-0.863C15.182,18.222,14.795,17.835,14.318,17.835"></path>
  </svg>`;
    return iconSvg;
  } else if (iconId === "7") {
    const iconSvg = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M1.686,3.327h16.754c0.356,0,0.645-0.288,0.645-0.644c0-0.356-0.288-0.645-0.645-0.645H1.686
      c-0.356,0-0.644,0.288-0.644,0.645C1.042,3.039,1.33,3.327,1.686,3.327z M4.263,6.549c-0.356,0-0.644,0.288-0.644,0.645
      c0,0.356,0.288,0.644,0.644,0.644h11.599c0.356,0,0.645-0.288,0.645-0.644c0-0.356-0.288-0.645-0.645-0.645H4.263z M18.439,11.06
      H1.686c-0.356,0-0.644,0.288-0.644,0.644c0,0.356,0.288,0.645,0.644,0.645h16.754c0.356,0,0.645-0.288,0.645-0.645
      C19.084,11.348,18.796,11.06,18.439,11.06z M15.218,15.57H5.552c-0.356,0-0.645,0.288-0.645,0.645c0,0.355,0.289,0.644,0.645,0.644
      h9.666c0.355,0,0.645-0.288,0.645-0.644C15.862,15.858,15.573,15.57,15.218,15.57z"></path>
  </svg>`;
    return iconSvg;
  } else if (weather.weather[0].id === 800) {
    const iconSvg = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M5.114,5.726c0.169,0.168,0.442,0.168,0.611,0c0.168-0.169,0.168-0.442,0-0.61L3.893,3.282c-0.168-0.168-0.442-0.168-0.61,0c-0.169,0.169-0.169,0.442,0,0.611L5.114,5.726z M3.955,10c0-0.239-0.193-0.432-0.432-0.432H0.932C0.693,9.568,0.5,9.761,0.5,10s0.193,0.432,0.432,0.432h2.591C3.761,10.432,3.955,10.239,3.955,10 M10,3.955c0.238,0,0.432-0.193,0.432-0.432v-2.59C10.432,0.693,10.238,0.5,10,0.5S9.568,0.693,9.568,0.932v2.59C9.568,3.762,9.762,3.955,10,3.955 M14.886,5.726l1.832-1.833c0.169-0.168,0.169-0.442,0-0.611c-0.169-0.168-0.442-0.168-0.61,0l-1.833,1.833c-0.169,0.168-0.169,0.441,0,0.61C14.443,5.894,14.717,5.894,14.886,5.726 M5.114,14.274l-1.832,1.833c-0.169,0.168-0.169,0.441,0,0.61c0.168,0.169,0.442,0.169,0.61,0l1.833-1.832c0.168-0.169,0.168-0.442,0-0.611C5.557,14.106,5.283,14.106,5.114,14.274 M19.068,9.568h-2.591c-0.238,0-0.433,0.193-0.433,0.432s0.194,0.432,0.433,0.432h2.591c0.238,0,0.432-0.193,0.432-0.432S19.307,9.568,19.068,9.568 M14.886,14.274c-0.169-0.168-0.442-0.168-0.611,0c-0.169,0.169-0.169,0.442,0,0.611l1.833,1.832c0.168,0.169,0.441,0.169,0.61,0s0.169-0.442,0-0.61L14.886,14.274z M10,4.818c-2.861,0-5.182,2.32-5.182,5.182c0,2.862,2.321,5.182,5.182,5.182s5.182-2.319,5.182-5.182C15.182,7.139,12.861,4.818,10,4.818M10,14.318c-2.385,0-4.318-1.934-4.318-4.318c0-2.385,1.933-4.318,4.318-4.318c2.386,0,4.318,1.933,4.318,4.318C14.318,12.385,12.386,14.318,10,14.318 M10,16.045c-0.238,0-0.432,0.193-0.432,0.433v2.591c0,0.238,0.194,0.432,0.432,0.432s0.432-0.193,0.432-0.432v-2.591C10.432,16.238,10.238,16.045,10,16.045"></path>
  </svg>`;
    return iconSvg;
  } else {
    const iconSvg = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M16.888,8.614c0.008-0.117,0.018-0.233,0.018-0.352c0-2.851-2.311-5.161-5.16-5.161c-1.984,0-3.705,1.121-4.568,2.763c-0.32-0.116-0.664-0.182-1.023-0.182c-1.663,0-3.011,1.348-3.011,3.01c0,0.217,0.024,0.427,0.067,0.631c-1.537,0.513-2.647,1.96-2.647,3.67c0,2.138,1.733,3.87,3.871,3.87h10.752c2.374,0,4.301-1.925,4.301-4.301C19.486,10.792,18.416,9.273,16.888,8.614 M15.186,16.003H4.433c-1.66,0-3.01-1.351-3.01-3.01c0-1.298,0.827-2.444,2.06-2.854l0.729-0.243l-0.16-0.751C4.02,8.993,4.003,8.841,4.003,8.692c0-1.186,0.965-2.15,2.151-2.15c0.245,0,0.49,0.045,0.729,0.131l0.705,0.256l0.35-0.664c0.748-1.421,2.207-2.303,3.807-2.303c2.371,0,4.301,1.929,4.301,4.301c0,0.075-0.007,0.148-0.012,0.223l-0.005,0.073L15.99,9.163l0.557,0.241c1.263,0.545,2.079,1.785,2.079,3.159C18.626,14.46,17.082,16.003,15.186,16.003"></path>
  </svg>`;
    return iconSvg;
  }
};

const getMoonPhase = function (day) {
  const moon = day.moon_phase;
  if (moon === 0 || moon === 1) {
    const markupMoon = `
    <svg class="svg-icon" viewBox="0 0 20 20">
							<path fill="none" d="M9.875,0.625C4.697,0.625,0.5,4.822,0.5,10s4.197,9.375,9.375,9.375S19.25,15.178,19.25,10S15.053,0.625,9.875,0.625"></path>
						</svg> New moon
    `;
    return markupMoon;
  } else if (moon <= 0.25) {
    const markupMoon = `
    <svg class="svg-icon" viewBox="0 0 20 20">
							<path fill="none" d="M10,0.542c-5.224,0-9.458,4.234-9.458,9.458c0,5.223,4.235,9.459,9.458,9.459c5.224,0,9.458-4.236,9.458-9.459C19.459,4.776,15.225,0.542,10,0.542 M8.923,18.523C4.685,17.992,1.402,14.383,1.402,10c0-4.383,3.283-7.993,7.521-8.524C6.919,3.749,5.701,6.731,5.701,10C5.701,13.27,6.919,16.25,8.923,18.523"></path>
						</svg> Quarter moon
    `;
    return markupMoon;
  } else if (moon <= 0.5) {
    const markupMoon = `
    <svg class="svg-icon" viewBox="0 0 20 20">
							<path fill="none" d="M10,0.562c-5.195,0-9.406,4.211-9.406,9.406c0,5.195,4.211,9.406,9.406,9.406c5.195,0,9.406-4.211,9.406-9.406C19.406,4.774,15.195,0.562,10,0.562 M10,18.521c-4.723,0-8.551-3.829-8.551-8.552S5.277,1.418,10,1.418s8.552,3.828,8.552,8.551S14.723,18.521,10,18.521"></path>
						</svg> Full moon
            `;
    return markupMoon;
  } else if (moon <= 0.75) {
    const markupMoon = `
    <svg class="svg-icon" viewBox="0 0 20 20">
							<path fill="none" d="M10,0.375c-5.229,0-9.469,4.239-9.469,9.469S4.771,19.312,10,19.312s9.469-4.239,9.469-9.469S15.229,0.375,10,0.375 M11.079,18.377c2.005-2.275,3.225-5.262,3.225-8.533c0-3.272-1.22-6.258-3.225-8.533c4.243,0.531,7.529,4.145,7.529,8.533C18.608,14.232,15.322,17.846,11.079,18.377"></path>
						</svg> Quarter moon
    `;
    return markupMoon;
  }
};

const renderWeather = function (data, dataForcast) {
  const weatherObject = data;
  const weatherData = weatherObject.list[0];
  const icon = getIcon(weatherData);
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
  const daysArr = dataForcast.daily;
  const [day0, day1, day2, day3, day4, day5, day6] = daysArr;

  const markupWeather = `
  <div class="card">
  <div class="info">
    <div class="temp-info">
      <h1 class="city">${weatherData.name}</h1>
      <span><p class="date">${date.getDate()} ${date
    .toDateString()
    .slice(4, 7)} ${date.getFullYear()}</p></span>
      <h2 class="temp">${Math.round(weatherData.main.temp)}??C</h2>
      <p class="weather">${weatherData.weather[0].main} ${icon}</p>
      <p class="min-max">min: ${Math.round(
        weatherData.main.temp_min
      )}??C/max: ${Math.round(weatherData.main.temp_max)}??C</p>
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

  const markupDaily = `
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 1) % 7]}</p>
            <p class="daily daily-weather">${day0.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day0.temp.day)}??C</p>
            <p class="daily daily-temp">Night: ${Math.round(
              day0.temp.night
            )}??C</p>
            <button class="daily button-daily"><svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"></path>
          </svg></button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 2) % 7]}</p>
            <p class="daily daily-weather">${day1.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day1.temp.day)}??C</p>
            <p class="daily daily-temp">Night: ${Math.round(
              day1.temp.night
            )}??C</p>
            <button class="daily button-daily"><svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"></path>
          </svg></button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 3) % 7]}</p>
            <p class="daily daily-weather">${day2.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day2.temp.day)}??C</p>
            <p class="daily daily-temp">Night: ${Math.round(
              day2.temp.night
            )}??C</p>
            <button class="daily button-daily"><svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"></path>
          </svg></button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 4) % 7]}</p>
            <p class="daily daily-weather">${day3.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day3.temp.day)}??C</p>
            <p class="daily daily-temp">Night: ${Math.round(
              day3.temp.night
            )}??C</p>
            <button class="daily button-daily"><svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"></path>
          </svg></button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 5) % 7]}</p>
            <p class="daily daily-weather">${day4.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day4.temp.day)}??C</p>
            <p class="daily daily-temp">Night: ${Math.round(
              day4.temp.night
            )}??C</p>
            <button class="daily button-daily"><svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"></path>
          </svg></button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 6) % 7]}</p>
            <p class="daily daily-weather">${day5.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day5.temp.day)}??C</p>
            <p class="daily daily-temp">Night: ${Math.round(
              day5.temp.night
            )}??C</p>
            <button class="daily button-daily"><svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"></path>
          </svg></button>
          </div>
          <div class="daily-forecast">
            <p class="daily daily-day">${days[(date.getDay() + 7) % 7]}</p>
            <p class="daily daily-weather">${day6.weather[0].main}</p>
            <p class="daily daily-temp">Day: ${Math.round(day6.temp.day)}??C</p>
            <p class="daily daily-temp">Night: ${Math.round(
              day6.temp.night
            )}??C</p>
            <button class="daily button-daily"><svg class="svg-icon" viewBox="0 0 20 20">
            <path fill="none" d="M2.25,12.584c-0.713,0-1.292,0.578-1.292,1.291s0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291S2.963,12.584,2.25,12.584z M2.25,14.307c-0.238,0-0.43-0.193-0.43-0.432s0.192-0.432,0.43-0.432c0.238,0,0.431,0.193,0.431,0.432S2.488,14.307,2.25,14.307z M5.694,6.555H18.61c0.237,0,0.431-0.191,0.431-0.43s-0.193-0.431-0.431-0.431H5.694c-0.238,0-0.43,0.192-0.43,0.431S5.457,6.555,5.694,6.555z M2.25,8.708c-0.713,0-1.292,0.578-1.292,1.291c0,0.715,0.579,1.292,1.292,1.292c0.713,0,1.292-0.577,1.292-1.292C3.542,9.287,2.963,8.708,2.25,8.708z M2.25,10.43c-0.238,0-0.43-0.192-0.43-0.431c0-0.237,0.192-0.43,0.43-0.43c0.238,0,0.431,0.192,0.431,0.43C2.681,10.238,2.488,10.43,2.25,10.43z M18.61,9.57H5.694c-0.238,0-0.43,0.192-0.43,0.43c0,0.238,0.192,0.431,0.43,0.431H18.61c0.237,0,0.431-0.192,0.431-0.431C19.041,9.762,18.848,9.57,18.61,9.57z M18.61,13.443H5.694c-0.238,0-0.43,0.193-0.43,0.432s0.192,0.432,0.43,0.432H18.61c0.237,0,0.431-0.193,0.431-0.432S18.848,13.443,18.61,13.443z M2.25,4.833c-0.713,0-1.292,0.578-1.292,1.292c0,0.713,0.579,1.291,1.292,1.291c0.713,0,1.292-0.578,1.292-1.291C3.542,5.412,2.963,4.833,2.25,4.833z M2.25,6.555c-0.238,0-0.43-0.191-0.43-0.43s0.192-0.431,0.43-0.431c0.238,0,0.431,0.192,0.431,0.431S2.488,6.555,2.25,6.555z"></path>
          </svg></button>
          </div>
  `;
  daily.innerHTML = "";
  daily.insertAdjacentHTML("beforeend", markupDaily);

  const renderWeatherModel = function (day) {
    const icon = getIcon(day);
    const moonPhase = getMoonPhase(day);
    const markupModel = `
    <div class="model-info-boxes">
            <h3>Temperature</h3>
            <div class="box-info">
              <p>Morning: ${Math.round(day.temp.morn)}??C</p>
              <p>Day: ${Math.round(day.temp.day)}??C</p>
              <p>Evening: ${Math.round(day.temp.eve)}??C</p>
              <p>Night: ${Math.round(day.temp.night)}??C</p>
            </div>
          </div>
          <div class="model-info-boxes">
            <h3>Feels like</h3>
            <div class="box-info">
              <p>Morning: ${Math.round(day.feels_like.morn)}??C</p>
              <p>Day: ${Math.round(day.feels_like.day)}??C</p>
              <p>Evening: ${Math.round(day.feels_like.eve)}??C</p>
              <p>Night: ${Math.round(day.feels_like.night)}??C</p>
            </div>
            <div class="model-info-boxes">
              <div class="box-info">
                <span
                  ><h3>Max. temp.</h3>
                  <p>${Math.round(day.temp.max)}??C</p></span
                >
                <span
                  ><h3>Min. temp.</h3>
                  <p>${Math.round(day.temp.min)}??C</p></span
                >
                <span
                  ><h3>Weather</h3>
                  <p>${icon} ${day.weather[0].main}</p></span
                >
                <span
                  ><h3>Moon phase</h3>
                  <p>${moonPhase}</p></span
                >
              </div>
            </div>
            <div class="model-info-boxes">
              <div class="box-info">
                <span
                  ><h3>Humidity</h3>
                  <p>${day.humidity}%</p></span
                >
                <span
                  ><h3>Wind speed</h3>
                  <p>${day.wind_speed} m/s</p></span
                >
                <span
                  ><h3>Cloudiness</h3>
                  <p>${day.clouds}%</p></span
                >
                <span
                  ><h3>Pressure</h3>
                  <p>${day.pressure} hPa</p></span
                >
              </div>
            </div>
          </div>
    `;
    modelInfo.innerHTML = "";
    modelInfo.insertAdjacentHTML("beforeend", markupModel);
  };
  const btnsModel = document.querySelectorAll(".button-daily");

  for (let i = 0; i < btnsModel.length; i++) {
    btnsModel[i].addEventListener("click", function () {
      renderWeatherModel(daysArr[i]);
      model.classList.remove("hidden");
      overlayModel.classList.remove("hidden");
    });
  }

  const closeModel = function () {
    model.classList.add("hidden");
    overlayModel.classList.add("hidden");
  };

  btnCloseModel.addEventListener("click", closeModel);
  overlayModel.addEventListener("click", closeModel);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !model.classList.contains("hidden")) {
      closeModel();
    }
  }); 
};

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  secCard.innerHTML = "";
  daily.innerHTML = "";
  secCard.insertAdjacentHTML(
    "afterbegin",
    "<div class='spinner'><h1>Loading...</h1><div>"
  );
  getWeather(searchBar.value);
  searchBar.value = "";
});
