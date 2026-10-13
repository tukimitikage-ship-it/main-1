const search = document.querySelector(`.search_button`)
const search_box = document.querySelector(`.city_input`)
const cityNameElement = document.querySelector('.city_name')
const tempElement = document.querySelector('.temperature')
const weatherConditionElement = document.querySelector('.weather_condition')
const advaiceElement = document.querySelector('.advice')
const getweatherData = async cityName => {
    const apiKey = `4814900c4b01bef1abcf49d850238201`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=metric&lang=ja`;
    const response = await fetch(url);
    const data = await response.json();
    const temp = Math.round(data.main.temp);    
    cityNameElement.textContent = data.name;
    tempElement.textContent = `${temp}℃`
    weatherConditionElement.textContent = data.weather[0].description;
}
search_box.addEventListener(`input`, _ => {
    const city = search_box.selectedOptions[0].value;
    getweatherData(city)
})
 