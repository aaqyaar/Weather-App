const API_KEY = "YOUR_API_KEY";
const list_card = document.querySelector(".list-card");
const list = document.querySelector(".list");
const searchCity = document.querySelector("#searchCity");
const cityName = document.querySelector("#cityName");
const weatherTxt = document.querySelector("#weatherTxt");
const degrees = document.querySelector("#degrees");
const imageTime = document.querySelector("#image-Time");

const getCityName = async (city) => {
  const url =
    "http://dataservice.accuweather.com/locations/v1/cities/autocomplete";
  const query = `?apikey=${API_KEY}&q=${city}`;
  const response = await fetch(url + query);
  const data = await response.json();

  return data;
};

searchCity.addEventListener("keyup", (e) => {
  if (e.target.value.length === 0) {
    list_card.classList.add("d-none");
  } else {
    list.innerHTML = "";
    getCityName(e.target.value.trim().toLowerCase())
      .then((data) => {
        data.forEach((cities) => {
          list.innerHTML += `<li class='list-group-item target_class'>${cities.LocalizedName}</li>`;
          list_card.classList.remove("d-none");
        });
      })
      .catch((err) => console.log(err));
  }
});

list.addEventListener("click", (event) => {
  updateTheUI(event.target.innerText.toLowerCase());
});

const getCityCode = async (city) => {
  const url = "http://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${API_KEY}&q=${city}`;
  const response = await fetch(url + query);
  const data = await response.json();

  return data[0];
};
const updateTheUI = (city) => {
  getCityCode(city).then((data) => {
    cityName.innerHTML = `${data.LocalizedName}, ${data.Country.LocalizedName}`;
    searchCity.value = "";
    // console.log(data);
    return getWeatherInfo(data.Key).then((data) => {
      weatherTxt.innerHTML = `${data.WeatherText}`;
      console.log(data);
      degrees.innerHTML = `${data.Temperature.Metric.Value} &deg;${data.Temperature.Metric.Unit}`;
      if (data.IsDayTime == true) {
        imageTime.setAttribute("src", "./assets/day.jpg");

        document.body.style.backgroundImage = "url(./assets/day.jpg)";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
      } else {
        imageTime.setAttribute("src", "./assets/night.jpg");
        document.body.style.backgroundImage = "url(./assets/night.jpg)";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
      }
    });
  });
  list_card.classList.add("d-none");

  localStorage.setItem("city", city);
};

const getWeatherInfo = async (cityCode) => {
  const url = "http://dataservice.accuweather.com/currentconditions/v1/";
  const query = `${cityCode}?apikey=${API_KEY}`;
  const response = await fetch(url + query);
  const data = await response.json();

  return data[0];
};

if (localStorage.getItem("city").length > 0) {
  updateTheUI(localStorage.getItem("city"));
}
