const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;
        this.date = 
        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            this.forecast = data.list;
            this.drawWeather();
        });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        // clear previous blocks
        this.resultsBlock.innerHTML = '';

        // add current weather block
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;

            const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
        let data = dateTimeString.split('.')[0];
        let tab = document.getElementById(data);;
        tab.appendChild(weatherBlock);
        }

        // add forecast weather blocks
        if (this.forecast && this.forecast.length > 0) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

                const temperature = weather.main.temp;
                const feelsLikeTemperature = weather.main.feels_like;
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;

                const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
                let data = dateTimeString.split('.')[0];
        let tab = document.getElementById(data);
        tab.appendChild(weatherBlock);
            }
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherBlock = document.createElement("div");
        let temp = new Date();
        let data = dateString.split('.')[0];
        let tab = document.getElementById(data);
        if(tab == null){
            tab = document.createElement("div");
            let p = document.createElement("p");
            let temp = dateString.split('.');
            p.innerText=temp[0]+'.'+temp[1]+' '+temp[2].split(' ')[0];
            tab.className = 'c';
            tab.setAttribute('id',data);
            document.getElementById('results').appendChild(tab);
            tab.appendChild(weatherBlock);
            tab.appendChild(p);
        }
        tab.appendChild(weatherBlock);
        let godzina = dateString.split(' ')[1].slice(0, 5);
        weatherBlock.className = `weather-block-${data} hovertext`;
        let opis = `Temperatura odczuwalna: ${Math.round(feelsLikeTemperature)} °C, ${description}`; 
        weatherBlock.setAttribute('data-hover',opis )

        let hourBlock = document.createElement("div");
        hourBlock.className = "weather-hour";
        hourBlock.innerText = godzina;
        weatherBlock.appendChild(hourBlock);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${Math.round(temperature)} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#results");

document.querySelector("#Button").addEventListener("click", function() {
    const query = document.querySelector("#Input").value;
    document.weatherApp.getWeather(query);
});
