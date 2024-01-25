import {
  weatherApi,
  removeAllChilds,
  get_city_coords,
  user_netWork_location,
} from "./model.js";

// Luxon Date and Time Modules
let DateTime = luxon.DateTime;

let latAndlon = await user_netWork_location();

//User Input
let usrInputContainer = document.getElementById("userInput");

// Current Location
let getCurrentLocationBtn = document.getElementById("currentLocationContainer");

// Current Weather Container data

let currentTemperature = document.getElementById("currentTemp");
let currentCondition = document.getElementById("currentCondition");
let place = document.getElementById("place");
let currentWeatherImageContainer = document.getElementById("currentWeatherImg");
let currTimeEl = document.getElementById("day");

// Air Elements

let airQualityIndexElement = document.getElementById("airQualityIndex");

let pmElement = document.getElementById("pm2_5El");
let so2Element = document.getElementById("so2El");
let no2Element = document.getElementById("no2El");
let o3Element = document.getElementById("o3El");

//Sunrise and Sunset Element

let sunriseElement = document.getElementById("sunriseTimeEl");
let sunsetElement = document.getElementById("sunsetTimeEl");

// Extra Elements

let visibilityElement = document.getElementById("visibilityEl");

let feelsLikeElement = document.getElementById("feelsLikeEl");

let pressureElement = document.getElementById("pressureEl");

let humidityElement = document.getElementById("humidityEl");

// All data Container

let weatherAMContainer = document.getElementById("amCintainer");

let weatherPMContainer = document.getElementById("pmContainer");

// 7 Day Container

let dayContainerEl = document.getElementById("daysCon");

//  Error Messagee 
let errCard = document.getElementById('errCard')

let clsBtn = document.getElementById('closeBtn');

//Overlay Button
let overLay = document.getElementById('overLay');
let bodyOver = document.getElementById('over');

// Current Weather Data append

function appendData(data) {
  let name = data.location.name;
  let temp = data.current.temp_c;
  let { text, icon } = data.current.condition;
  let { humidity, pressure_mb, feelslike_c } = data.current;
  let visibility = data.current.vis_km + " Km";
  let srcurl = "https:" + icon;
  let country = data.location.country

  let dateOfZone = DateTime.now().setZone(data.location.tz_id);
  let formatedDate = dateOfZone.toFormat("EEEE dd, MMM");
  currTimeEl.textContent = formatedDate;

  currentWeatherImageContainer.src = srcurl;
  currentTemperature.textContent = Math.floor(temp) + "°c";
  currentCondition.textContent = text;
  place.textContent = `${name}, ${country}`;

  humidityElement.textContent = humidity + "%";
  pressureElement.textContent = pressure_mb + "hPa";
  feelsLikeElement.textContent = Math.round(feelslike_c * 10) / 10 + "°c";
  visibilityElement.textContent = visibility;
}

// air Pollution Data

function appenAirPollution(data) {
  let { pm2_5, no2, so2, o3 } = data.current.air_quality;
  let quality = data.current.air_quality["us-epa-index"];

  switch (quality) {
    case 1:
      airQualityIndexElement.textContent = "Excellent";
      airQualityIndexElement.style.backgroundColor = "rgba(38, 255, 0, 0.844)";
      break;

    case 2:
      airQualityIndexElement.textContent = "Good";
      airQualityIndexElement.style.backgroundColor = "rgba(0, 255, 89, 0.782)";
      break;

    case 3:
      airQualityIndexElement.textContent = "Modrate";
      airQualityIndexElement.style.backgroundColor =
        "rgba(249, 249, 34, 0.711)";
      break;

    case 4:
      airQualityIndexElement.textContent = "Risk";
      airQualityIndexElement.style.backgroundColor =
        "rgba(243, 158, 30, 0.782)";
      break;

    case 5:
      airQualityIndexElement.textContent = "Unhealthy";
      airQualityIndexElement.style.backgroundColor =
        " rgba(238, 62, 27, 0.782)";
      break;

    case 6:
      airQualityIndexElement.textContent = "Hazardous";
      airQualityIndexElement.style.backgroundColor = "rgba(255, 0, 0, 0.782)";
      break;
  }

  pmElement.textContent = pm2_5;
  no2Element.textContent = no2;
  so2Element.textContent = so2;
  o3Element.textContent = o3;
  overLay.classList.add('d-none')
  
  spinner.classList.add('d-none')
}

//Sunrise and sunset data

function appendSunRiseAndSunSet(data) {
  let { sunrise, sunset } = data.forecast.forecastday[0].astro;

  sunriseElement.textContent = sunrise;
  sunsetElement.textContent = sunset;
  spinner.classList.add('d-none')
  
  overLay.classList.add('d-none')
}

// Forecast OF Day Container

function forcastdataAppend(data) {
  let timeEl = data.time.split(" ")[1].split(":");
  let time = Number(timeEl[0]);
  var AmOrPm = time >= 12 ? " PM" : " AM";
  let hours = time % 12 || 12;
  let finalTime = hours + AmOrPm;

  let temp = data.temp_c;
  let icon = "https:" + data.condition.icon;

  let divCon = document.createElement("div");
  divCon.classList.add("extraContainer");
  let timeEle = document.createElement("p");
  timeEle.textContent = finalTime;
  divCon.appendChild(timeEle);
  let imgEle = document.createElement("img");
  imgEle.src = icon;
  divCon.appendChild(imgEle);

  let tempEl = document.createElement("p");
  tempEl.textContent = `${Math.floor(temp)}°C`;
  divCon.appendChild(tempEl);

  if (time >= 12) {
    weatherAMContainer.appendChild(divCon);
  } else {
    weatherPMContainer.appendChild(divCon);
  }
  spinner.classList.add('d-none');
  
  overLay.classList.add('d-none')
}

// 7 Days Data Container

function appendWeekData(data, i) {

  let we = DateTime.now()
    .setZone(data.location.tz_id)
    .plus({ days: [i] });
  let middleTime = we.toFormat("MMM d");
  let day = we.toFormat("EEE");
  // let vc = DateTime.now().plus({ days: [i] });

  let wethIcon = "http:" + data.forecast.forecastday[i].day.condition.icon;
  let dayTemp = data.forecast.forecastday[i].day.avgtemp_c;

  let dayContainer = document.createElement("div");
  dayContainer.setAttribute("class", "days");

  let imgContainer = document.createElement("div");

  let weathericon = document.createElement("img");
  weathericon.setAttribute("src", wethIcon);
  imgContainer.appendChild(weathericon);

  let degereEl = document.createElement("span");
  degereEl.textContent = Math.floor(dayTemp) + "°c";
  imgContainer.appendChild(degereEl);

  dayContainer.appendChild(imgContainer);

  let dateEl = document.createElement("p");
  dateEl.classList.add("mt-2");
  dateEl.textContent = middleTime;
  dayContainer.appendChild(dateEl);

  let dayEl = document.createElement("p");
  dayEl.textContent = day;
  dayEl.classList.add("mt-2");
  dayContainer.appendChild(dayEl);

  dayContainerEl.appendChild(dayContainer);
  spinner.classList.add('d-none')
  
  overLay.classList.add('d-none')
}

function appendFoecastData(data) {
  removeAllChilds(weatherAMContainer);
  removeAllChilds(weatherPMContainer);

  let fra = [];
  let forecastArray = data.forecast.forecastday[0].hour;
  fra.push(forecastArray);
  let a = 0;
  for (let each of fra[0]) {
    if (a % 2 === 0) {
      forcastdataAppend(each);
    }
    a++;
  }
  spinner.classList.add('d-none');
  
  overLay.classList.add('d-none')
}

function weekForcast(data) {
  removeAllChilds(dayContainerEl);
  let dataLen = data.forecast.forecastday.length;
  for (let i = 1; i < dataLen; i++) {
    appendWeekData(data, i);
  }
  spinner.classList.add('d-none')
  
  overLay.classList.add('d-none')

  bodyOver.classList.remove('over')
}


clsBtn.onclick = function closeBtn(){
  errCard.classList.add('d-none')
  overLay.classList.add('d-none')
  bodyOver.classList.remove('over')

}

async function fail() {
  let data = await weatherApi(latAndlon[0], latAndlon[1]);
  appendData(data);
  appenAirPollution(data);
  appendSunRiseAndSunSet(data);
  appendFoecastData(data);
  weekForcast(data);
}

async function success(usrLocation) {
  let latitude = usrLocation.coords.latitude;
  let longitude = usrLocation.coords.longitude;
  let data = await weatherApi(latitude, longitude);
  appendData(data);
  appenAirPollution(data);
  appendSunRiseAndSunSet(data);
  appendFoecastData(data);
  weekForcast(data);
}

getCurrentLocationBtn.addEventListener("click", async function () {
  navigator.geolocation.getCurrentPosition(success, fail);
});

usrInputContainer.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && usrInputContainer.value !== "") {
    overLay.classList.remove('d-none')
    bodyOver.classList.add('over')
    spinner.classList.remove('d-none')
    
    let city = usrInputContainer.value;
    async function append() {
      let coords = await get_city_coords(city);
      if (coords === undefined) {
        // 
        bodyOver.classList.add('over')
        spinner.classList.add('d-none')
        errCard.classList.remove('d-none')
        // alert(`City not found: ${city}`);


      } else {
        
        let latitude = coords[0];
        let longitude = coords[1];
        let data = await weatherApi(latitude, longitude);
        console.log(data)
        appendData(data);
        appenAirPollution(data);
        appendSunRiseAndSunSet(data);
        appendFoecastData(data);
        weekForcast(data);
      }
    }
    append();
    usrInputContainer.value = "";
  }
});

navigator.geolocation.getCurrentPosition(success, fail);
