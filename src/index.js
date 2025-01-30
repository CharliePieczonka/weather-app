import "./styles.css";
import { Weather } from "./weather";
import { Forecast } from "./forecast"; 

let vcAPIKey = "9D5KJ7SCMFSFNQ3NM8JHWSDKJ";
let city = "London";

async function callWeatherAPI(location) {
    try {
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + '?key=' + vcAPIKey, {mode: 'cors'});
        const responseJSON = await response.json();
        return responseJSON;
    }
    catch(error) {
        console.log("Error occured trying to fetch the data: " + error);
    }
}

let data = await callWeatherAPI(city);
console.log(data);

let currentWeather = new Weather(data.address, data.currentConditions.temp, data.currentConditions.humidity, data.currentConditions.datetime, 
    data.currentConditions.conditions, data.currentConditions.windspeed, data.description);

console.log(currentWeather.city);
console.log(currentWeather.temp);
console.log(currentWeather.humidity);
console.log(currentWeather.datetime);
console.log(currentWeather.conditions);
console.log(currentWeather.wind);
console.log(currentWeather.description);