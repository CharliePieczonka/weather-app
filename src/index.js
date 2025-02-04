import "./styles.css";
import { Weather } from "./weather";
import { Forecast } from "./forecast"; 

const vcAPIKey = "9D5KJ7SCMFSFNQ3NM8JHWSDKJ";
const weekday = ["Sun","Mon","Tues","Wed","Thurs","Fri" ,"Sat"];

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

let displayController = (function () {
    let city = document.querySelector(".city");
    let time = document.querySelector(".time");
    let temp =  document.querySelector(".temp");
    let condition = document.querySelector(".condition");
    let description = document.querySelector(".description");
    let forecastDayDivs = document.querySelectorAll(".day-div");
    let currentWeather;

    // function that takes a city or address and creates the weather and forecast objects
    let newWeather = async (address) => {
        let data = await callWeatherAPI(address);
        console.log(data);

        address = data.resolvedAddress.split(",");
        address = address[0] + ", " + address[1];

        let timeData = data.currentConditions.datetime.split(":");
        timeData = timeData[0] + ":" + timeData[1];

        let tempCelcius = Math.round((data.currentConditions.temp - 32) * (5 / 9));
        tempCelcius = tempCelcius.toString() + "˚C";

        currentWeather = new Weather(address, tempCelcius, data.currentConditions.humidity, timeData, 
            data.currentConditions.conditions, data.currentConditions.windspeed, data.description);

        let forecastData = data.days.slice(1, 8);
        console.log(forecastData);

        for(let i = 0; i < forecastData.length; i++) {
            let d = new Date(forecastData[i].datetime);
            let dayOfWeek = weekday[d.getDay()];
            
            let foreTempCelcius = Math.round((forecastData[i].feelslike - 32) * (5 / 9));
            foreTempCelcius = foreTempCelcius.toString() + "˚C";

            // extra forecast data (tempmin/max, conditions, desc) remain in case of future update desiring more data
            currentWeather.forecast.push(new Forecast(dayOfWeek, foreTempCelcius, foreTempCelcius, "", ""));
        }
    }

    let updateDisplay = () => {
        city.textContent = currentWeather.city;
        time.textContent = currentWeather.datetime;
        temp.textContent = currentWeather.temp;
        condition.textContent = currentWeather.conditions;
        description.textContent = currentWeather.description;

        for(let i = 0; i < currentWeather.forecast.length; i++) {
            let day = forecastDayDivs[i].querySelector(".day");
            let foreTemp = forecastDayDivs[i].querySelector(".forecast-temp");

            day.textContent = currentWeather.forecast[i].date;
            foreTemp.textContent = currentWeather.forecast[i].tempMin;
        }
    } 

    return { updateDisplay, newWeather }
})();

await displayController.newWeather("London");
displayController.updateDisplay();