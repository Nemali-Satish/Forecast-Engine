let weather_API_Key = "6cdd75aa71e94b01be5153338241601";
let openWeather_API_Key = "4b596cc96f6a203c4c0ed2d6ef6d744e";

// user Network Location

export async function user_netWork_location() {
  let url = "https://ipinfo.io/json?token=25cf52ac737d76";
  let responce = await fetch(url);
  let data = await responce.json();
  return data.loc.split(",");
}

// Function to get corrdinates of the city Entered by user

export async function get_city_coords(city) {
  try{
  let url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeather_API_Key}`;
  let response = await fetch(url);
  const data = await response.json();
  let lat = data[0].lat;
  let lon = data[0].lon;
  let country = data[0].country;
  let arr = [lat, lon, country];
  return arr;}
  catch(error){
    return console.log(error)
  }
}

// Function to get Current Weather Data

export async function weatherApi(latitude, longitude) {
  try{
  let reso = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=6cdd75aa71e94b01be5153338241601&q=${latitude},${longitude}&days=6&aqi=yes&alerts=yes`
  );
  let data = await reso.json();
  return data;}
  catch(error){
    return console.log(error)
  }
}

// Function to remove the all child elements in the container

export function removeAllChilds(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}



