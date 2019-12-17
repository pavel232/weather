const htmlInterface = `<header class="header">
<div class="settings-block">
    <div id="refresh" class="settings-block__refresh">
        <img class="refresh__arrows" src="images/refresh.svg">
    </div>
    <div class="settings-block__settings-container">
        <div class="settings-block__language">
            <div id="en" class="settings-block__language--button active">EN</div>
            <div id="ru" class="settings-block__language--button">RU</div>
            <div id="be" class="settings-block__language--button">BE</div>
        </div>
        <div class="settings-block__degrees">
            <div id="fahrenheit" class="settings-block__degrees--button">°F</div>
            <div id="celsius" class="settings-block__degrees--button active">°С</div>
        </div>
    </div>
</div>
<div class="search-block">
    <input id="cityQuery" class="search-block__input" placeholder="Search city">
    <div id="search" class="search-block__search-button">search</div>
</div>
</header>

<main class="main">
<div class="weather">
    <div class="place">
        <div id="currentCity" class="place__city"></div>
        <div id="date" class="place__date"></div>
    </div>
    <div class="today">
        <span id="temperatureToday" class="today__temperature"></span>
        <div class="today__description">
            <img id="iconToday" class="today__description--icon">
            <div class="today__description--info">
                <div id="precipitation"></div>
                <div class="today__description--element">
                    <div id="feelsLike"></div>
                    <div id="feelsLikeValue"></div>
                </div>
                <div class="today__description--element">
                    <div id="wind"></div>
                    <div id="windValue"></div>
                    <div id="windUnits"></div>
                </div>
                <div class="today__description--element">
                    <div id="humidity"></div>
                    <div id="humidityValue"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="future">
        <div class="future-weather">
            <span id="day1" class="future-weather__day"></span>
            <div>
                <span id="day1Temp" class="future-weather__temperature"></span>
                <img id="day1Icon" class="future-weather__icon">
            </div>
        </div>
        <div class="future-weather">
            <span id="day2" class="future-weather__day">day</span>
            <div>
                <span id="day2Temp" class="future-weather__temperature"></span>
                <img id="day2Icon" class="future-weather__icon">
            </div>
        </div>
        <div class="future-weather">
            <span id="day3" class="future-weather__day">day</span>
            <div>
                <span id="day3Temp" class="future-weather__temperature"></span>
                <img id="day3Icon" class="future-weather__icon">
            </div>
        </div>
    </div>
</div>
<div class="map">
    <div id="map" class="map__draw"></div>
    <div class="map__coordinates">
        <div class="map__coordinates--element">
            <div id="latitude"></div>
            <div id="latitudeValue"></div>
        </div>
        <div class="map__coordinates--element">
            <div id="longitude"></div>
            <div id="longitudeValue"></div>
        </div>
    </div>
</div>
</main>`;

document.getElementById('wrapper').innerHTML = htmlInterface;
