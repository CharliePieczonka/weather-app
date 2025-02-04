import "./styles.css";
import { Weather } from "./weather";
import { Forecast } from "./forecast"; 

const vcAPIKey = "9D5KJ7SCMFSFNQ3NM8JHWSDKJ";
const weekday = ["Sun","Mon","Tues","Wed","Thurs","Fri" ,"Sat"];

// function that utilizes the visual crossing API to retrieve weather data
async function callWeatherAPI(location) {
    let responseCode;

    try {
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + '?key=' + vcAPIKey, {mode: 'cors'});
        responseCode = response.status;
        const responseJSON = await response.json();
        return responseJSON;
    }
    catch(error) {
        console.log("Error occured trying to fetch the data: " + error);
        return responseCode;
    }
}

let displayController = (function () {
    let city = document.querySelector(".city");
    let time = document.querySelector(".time");
    let temp =  document.querySelector(".temp");
    let condition = document.querySelector(".condition");
    let description = document.querySelector(".description");
    let forecastDayDivs = document.querySelectorAll(".day-div");
    let search = document.querySelector("#search");
    let currentWeather;

    // function that takes a location and creates the weather and forecast objects
    let newWeather = async (location) => {
        let data = await callWeatherAPI(location);
        console.log(data);

        // if an error has occured a response code will be returned
        if(!isNaN(data)) {
            let msg = "";
            if(400 <= data < 500) {
                // client error responses
                msg = "No data found.";
            }
            else {
                // >500 server error
                msg = "Error connecting to server, please wait and try again.";
            }

            currentWeather = new Weather(msg, "", "", "", "", "", "");
        }
        else {
            location = data.resolvedAddress.split(",");
            location = location[0] + ", " + location[1];
    
            let timeData = data.currentConditions.datetime.split(":");
            timeData = timeData[0] + ":" + timeData[1];
    
            let tempCelcius = Math.round((data.currentConditions.temp - 32) * (5 / 9));
            tempCelcius = tempCelcius.toString() + "˚C";
    
            currentWeather = new Weather(location, tempCelcius, data.currentConditions.humidity, timeData, 
                data.currentConditions.conditions, data.currentConditions.windspeed, data.description);
    
            let forecastData = data.days.slice(1, 8);
            console.log(forecastData);
    
            for(let i = 0; i < forecastData.length; i++) {
                let d = new Date(forecastData[i].datetime);
                let dayOfWeek = weekday[d.getDay()];
                
                let foreTempCelcius = Math.round((forecastData[i].feelslike - 32) * (5 / 9));
                foreTempCelcius = foreTempCelcius.toString() + "˚C";
    
                // extra forecast data (tempmin/max, conditions, desc) to remain in case of future update desiring more data
                currentWeather.forecast.push(new Forecast(dayOfWeek, foreTempCelcius, foreTempCelcius, "", ""));
            }
        }
    }

    // takes the weather object and updates the DOM
    let updateDisplay = () => {
        city.textContent = currentWeather.city;
        time.textContent = currentWeather.datetime;
        temp.textContent = currentWeather.temp;
        condition.textContent = currentWeather.conditions;
        description.textContent = currentWeather.description;

        for(let i = 0; i < forecastDayDivs.length; i++) {
            let day = forecastDayDivs[i].querySelector(".day");
            let foreTemp = forecastDayDivs[i].querySelector(".forecast-temp");
            
            try {
                day.textContent = currentWeather.forecast[i].date;
                foreTemp.textContent = currentWeather.forecast[i].tempMin;
            }
            catch {
                // if error has been thrown there is no forecast data
                day.textContent = "";
                foreTemp.textContent = "";
            }
            
        }
    }

    // event listener for searchbar to retrieve new weather data
    search.addEventListener("keypress", async (e) => {
        if(e.key === "Enter" && search.value != "") {
            await newWeather(search.value);
            updateDisplay();
            search.value = "";
        }
    });

    return { updateDisplay, newWeather }
})();

await displayController.newWeather("London");
displayController.updateDisplay();