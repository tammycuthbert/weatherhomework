/**
 * Weather App
 */
let latitude = 0;
let longitude = 0;

// Variable to store the list of city search
let searches = [];

// API_KEY for maps api
let API_KEY = "a8e71c9932b20c4ceb0aed183e6a83bb";

window.onload = function() {
  for(let i = 1; i < 6; i++) {
    let start = `<div id="" class="card text-white bg-primary mb-3" style="max-width: 10rem;">
                   <div class="card-body">
                     <h5 class="card-title">Date</h5>
                     <ul class="list-unstyled mt-3">
                       <li id="cardInfo">Temp : --°F</li> <br>  
                       <li id="cardInfo">Humidity : --%</li> <br>
                     </ul>
                   </div>
                 </div>`
    document.getElementById(`card${i.toString()}`).innerHTML = start;
  }
  document.addEventListener('keyup', pressEnter);
}

function pressEnter(event) {
  if(event.keyCode === 13){
    searchCity();
  }
}

function deleteAfterInput () {
  let input = `<input id="city-input" class="form-control form-control-lg" type="text" placeholder="Search city">
               <button type="button" onclick="searchCity()" class="btn btn-lg btn-primary"><i class="fas fa-search"></i></button>`
  document.getElementById('search-input').innerHTML = input;
}

/**
 * Retrieve weather data from openweathermap
 */
getWeatherData = (city) => {
  const URL = "https://api.openweathermap.org/data/2.5/weather";
  const FULL_URL = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
  const weatherPromise = fetch(FULL_URL);
  return weatherPromise.then((response) => {
    return response.json();
  });
};

/**
 * Retrieve weather data for UV Index
 */
get_UV_Index_Data = (lat,lon) => {
  const URL = "https://api.openweathermap.org/data/2.5/uvi";
  const FULL_URL = `${URL}?appid=${API_KEY}&lat=${lat}&lon=${lon}`;
  const weatherPromise = fetch(FULL_URL);
  return weatherPromise.then((response) => {
    return response.json();
  });
};

/**
 *  Get the weather forecast data for the next five days
 */
getFiveDayForecast = (lat,lon) => {
  const URL = "https://api.openweathermap.org/data/2.5/forecast";
  const FULL_URL = `${URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  const weatherPromise = fetch(FULL_URL);
  return weatherPromise.then((response) => {
    return response.json();
  });
};

/**
 * Retrieve city input and get the weather data
 */
searchCity = () => {
  const city = document.getElementById("city-input").value;
  getWeatherData(city)
    .then((res) => {
      showWeatherData(res);
      saveSearchHistory(city);
      displayHistory();
      showFiveDayForecast(); 
    })
    .catch((error) => {
      console.log(error);
      console.log("Wrong Input");
      document.getElementById("city-name").innerText = "Undefined";
      document.getElementById("tod-date").innerText = ""; // Gets date from -> "2019-12-9 10:30:15"
      document.getElementById("temperature").innerText = "----";
      document.getElementById("humidity").innerText = "----";
      document.getElementById("wind-speed").innerText = "----";
      document.getElementById("uv-index").innerText = "---";
      document.getElementById("img-container").src = "";
      for(let i = 1; i < 6; i++) {
        let start = `<div id="" class="card text-white bg-primary mb-3" style="max-width: 10rem;">
                       <div class="card-body">
                         <h5 class="card-title">Date</h5>
                         <ul class="list-unstyled mt-3">
                           <li id="cardInfo">Temp : --°F</li> <br>  
                           <li id="cardInfo">Humidity : --%</li> <br>
                         </ul>
                       </div>
                     </div>`
        document.getElementById(`card${i.toString()}`).innerHTML = start;
      }
    });
    deleteAfterInput();
};

/**
 * Show the weather data in HTML
 */
showWeatherData = (weatherData) => {
  console.log(weatherData);
  const dte = weatherData.dt;
  const Date = UNIX_To_Date(dte);
  document.getElementById("img-container").src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  document.getElementById("city-name").innerText = weatherData.name;
  document.getElementById("tod-date").innerText = `(${Date.slice(0,9)})`; // Gets date from -> "2019-12-9 10:30:15"
  document.getElementById("temperature").innerText = weatherData.main.temp;
  document.getElementById("humidity").innerText = weatherData.main.humidity;
  document.getElementById("wind-speed").innerText = weatherData.wind.speed;
  latitude = weatherData.coord.lat;
  longitude = weatherData.coord.lon
  get_UV_Index_Data(latitude, longitude)
    .then((res) => {
      console.log(res);
        document.getElementById("uv-index").innerText = res.value;
    })
    .catch((error) => {
      console.log("UV Index error:",error);
    });
  document.getElementById("weather-output").classList.add("visible");
};

/**
 * Show the five days forecast at the bottom
 */
showFiveDayForecast = () => {
  getFiveDayForecast(latitude, longitude)
    .then((response) => {
      console.log("Five day response",response);
      let x = 7;
      for(let i = 1; i < 6; i++,x+=8) {
        let dte = UNIX_To_Date(response.list[x].dt);
        let start = `<div id="" class="card text-white bg-primary mb-3" style="max-width: 10rem;">
                      <div class="card-body">
                        <h5 class="card-title">${dte.slice(0,9)}</h5>
                        <img id="card-img" src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png" alt="">
                        <ul class="list-unstyled mt-3 mb-4">
                          <li id="cardInfo">Temp: ${response.list[i].main.temp}°F</li> <br>
                          <li id="cardInfo">Humidity: ${response.list[i].main.humidity}%</li>
                        </ul>
                      </div>
                    </div>`
        document.getElementById(`card${i.toString()}`).innerHTML = start;
      }   
  })
};

/**
 * Save Search History 
 */
saveSearchHistory = (search) => {
  // capitalized = search[0].toUpperCase() + search.slice(1);
  capitalized = search[0].toUpperCase();
  for(let i = 1; i < search.length; i++) {
    if(search[i-1] === ' ') {
      capitalized += search[i].toUpperCase(); 
    } else {
        capitalized += search[i].toLowerCase();
    }
  }
  searches.push(capitalized);
}

/**
 * Convert Date from UNIX to Standard Format
 */
UNIX_To_Date = (dateInUNIX) => {
  let milliseconds = dateInUNIX * 1000;
  let dateObject = new Date(milliseconds);
  let humanDateFormat = dateObject.toLocaleString();
  return humanDateFormat;
}

/**
 * Display History 
 */
displayHistory = () => {
  let index = searches.length - 1; 
  let list = "<ul class='list-group'>";

  while (index >= 0) {
    list +=
      "<li class='list-group-item'><h5>" +
      searches[index] +
      "</h5></li>";
    index -= 1;
  }
  list += "</ul>";
  document.getElementById("history").innerHTML = list;
}
