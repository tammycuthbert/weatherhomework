const element = document.querySelector("className");

const notificationElement=document.querySelector(".notification");
const iconElement=document.querySelector(".weather-icon");
const tempElement=document.querySelector(".temperature-value p");
const descElement=document.querySelector(".temperature-description p");
const locationElement=document.querySelector(".location p");

const weather = {
    temperature : {
        value:18,
        unit: "fahrenheight"
    },
    description : "few-clouds",
    iconId : "Old",
    city : "Nashville",
    country : "US"
};

displayWeather(){
iconElement.innerHTML = '<img src=icons/${weather.iconId}.png"/>';

tempElement.innerHTML = '${weather.temperature.value}'<span>F</span>;

descElement.innerHTML  = weather.description;

locationElement.innerHTML = '${weather.city}, ${weather.country}';
}


tempElement.addEventListener("click",function(){

    if(weather.temperatutre.unit ==="celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.vale);

        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = '${fahrenheit} <span>F</span>';

        weather.temperatutre.unit = "fahrenheit";
    }else{

        tempElement.innerHTML = '${weather.temperature.value}'; <span>C</span>;

        weather.temperatutre.unit = "celsius";
    
    }
})
