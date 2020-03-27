import {
  background, refresh, en, ru, be, fahrenheit, celsius, search, city,
  currentTemp, day1Temp, day2Temp, day3Temp, feelsLike, feelsLikeValue, wind, windValue,
  windUnits, humidity, humidityValue, precipitation,
  latitudeElement, longitudeElement,
} from './variables.js';

import {
  getPlace, getWeather, getLinkToImage,
} from './requests.js';


let weatherId;
let lang = 'en';
let langStream;
let units = 'celsius';
let latitude = 0;
let longitude = 0;
let myMap;
let timeZone = 0;


window.onload = () => {
  navigator.geolocation.getCurrentPosition(success, error);
  localStorageLoad();
};


// select settings items
function selectItem(form, item) {
  if (form === 'language') {
    en.className = 'settings-block__language--button';
    ru.className = 'settings-block__language--button';
    be.className = 'settings-block__language--button';
    item.className = 'settings-block__language--button active';
    lang = item.id;
  }
  if (form === 'degrees') {
    fahrenheit.className = 'settings-block__degrees--button';
    celsius.className = 'settings-block__degrees--button';
    item.className = 'settings-block__degrees--button active';
    units = item.id;
  }
}


// set days names on 3-days forward
function setDays() {
  const days = new Date();
  days.setDate(days.getUTCDate());
  days.setHours(days.getUTCHours() + timeZone + 24);
  const day1 = days.toString().toLowerCase().slice(0, 3);
  days.setHours(days.getHours() + 24);
  const day2 = days.toString().toLowerCase().slice(0, 3);
  days.setHours(days.getHours() + 24);
  const day3 = days.toString().toLowerCase().slice(0, 3);

  document.getElementById('day1').innerHTML = langStream[`${day1}Full`] ? langStream[`${day1}Full`] : 'day1';
  document.getElementById('day2').innerHTML = langStream[`${day2}Full`] ? langStream[`${day2}Full`] : 'day2';
  document.getElementById('day3').innerHTML = langStream[`${day3}Full`] ? langStream[`${day3}Full`] : 'day3';
}


// get weather id codes
function getWeatherId(id) {
  const idFirstLetter = id.toString().slice(1, 0);
  if (idFirstLetter === 2) {
    return '2xx';
  } if (idFirstLetter === 3) {
    return '3xx';
  }
  return +id;
}


// change language
async function setLanguage(mode) {
  let languageFile;
  switch (lang) {
    case 'en':
      languageFile = './languages/english.json';
      break;
    case 'ru':
      languageFile = './languages/russian.json';
      break;
    case 'be':
      languageFile = './languages/belorussian.json';
      break;
  }

  await fetch(languageFile)
    .then((res) => res.json())
    .then((data) => { langStream = data; });

  feelsLike.innerHTML = langStream.feelsLike;
  wind.innerHTML = langStream.wind;
  windUnits.innerHTML = langStream.units;
  humidity.innerHTML = langStream.humidity;
  latitudeElement.innerHTML = langStream.lat;
  longitudeElement.innerHTML = langStream.lon;
  city.placeholder = langStream.searchPlaceholder;
  search.innerHTML = langStream.searchButton;
  precipitation.innerHTML = (weatherId === undefined) ? '' : langStream.weatherId[getWeatherId(weatherId)];
  setDays();
  if (mode !== 'withoutUpdateCity') {
    getLocation('updateCity');
  }
}


// set background image from url image
function setBackground(link) {
  if (typeof link !== 'undefined') {
    background.style.backgroundImage = `url(${link})`;
  } else alert('Failed to load background image');
}


// refresh place coordinates
function refreshCoordinates(setLat, setLon) {
  latitude = setLat;
  longitude = setLon;

  const tmpLat = latitude.toString().split('.');
  const tmpLon = longitude.toString().split('.');

  document.getElementById('latitudeValue').innerHTML = `<pre> ${tmpLat[0]}°${tmpLat[1].slice(0, 2)}'</pre>`;
  document.getElementById('longitudeValue').innerHTML = `<pre> ${tmpLon[0]}°${tmpLon[1].slice(0, 2)}'</pre>`;
}


// change units
function setUnits(value, mode) {
  if (mode === 'change') {
    if (units === 'celsius') {
      currentTemp.innerHTML = `${Math.round((5 * (currentTemp.innerHTML.slice(0, -1) - 32)) / 9)}°`;
      day1Temp.innerHTML = `${Math.round((5 * (day1Temp.innerHTML.slice(0, -1) - 32)) / 9)}°`;
      day2Temp.innerHTML = `${Math.round((5 * (day2Temp.innerHTML.slice(0, -1) - 32)) / 9)}°`;
      day3Temp.innerHTML = `${Math.round((5 * (day3Temp.innerHTML.slice(0, -1) - 32)) / 9)}°`;
      feelsLikeValue.innerHTML = `<pre> ${Math.round((5 * (feelsLikeValue.innerHTML.slice(6, -7) - 32)) / 9)}°</pre>`;
    } else {
      currentTemp.innerHTML = `${Math.round((9 / 5) * currentTemp.innerHTML.slice(0, -1) + 32)}°`;
      day1Temp.innerHTML = `${Math.round((9 / 5) * day1Temp.innerHTML.slice(0, -1) + 32)}°`;
      day2Temp.innerHTML = `${Math.round((9 / 5) * day2Temp.innerHTML.slice(0, -1) + 32)}°`;
      day3Temp.innerHTML = `${Math.round((9 / 5) * day3Temp.innerHTML.slice(0, -1) + 32)}°`;
      feelsLikeValue.innerHTML = `<pre> ${Math.round((9 / 5) * feelsLikeValue.innerHTML.slice(6, -7) + 32)}°</pre>`;
    }
  } else {
    if (units === 'celsius') {
      return Math.round(value);
    }
    return Math.round((9 / 5) * value + 32);
  }
}


// get weather information
async function refreshWeather() {
  const weatherObject = await getWeather(latitude, longitude);
  const weatherDescription = weatherObject.list[0].weather[0].description;
  weatherId = weatherObject.list[0].weather[0].id;
  const midDay = weatherObject.list.filter((reading) => reading.dt_txt.includes('12:00:00'));

  timeZone = weatherObject.city.timezone / 3600;

  const { temp } = weatherObject.list[0].main;
  currentTemp.innerHTML = `${setUnits(temp, 'set')}°`;
  day1Temp.innerHTML = `${setUnits(midDay[1].main.temp, 'set')}°`;
  day2Temp.innerHTML = `${setUnits(midDay[2].main.temp, 'set')}°`;
  day3Temp.innerHTML = `${setUnits(midDay[3].main.temp, 'set')}°`;

  const { icon } = weatherObject.list[0].weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  const iconUrlDay1 = `https://openweathermap.org/img/wn/${midDay[1].weather[0].icon}@2x.png`;
  const iconUrlDay2 = `https://openweathermap.org/img/wn/${midDay[2].weather[0].icon}@2x.png`;
  const iconUrlDay3 = `https://openweathermap.org/img/wn/${midDay[3].weather[0].icon}@2x.png`;
  document.getElementById('iconToday').src = iconUrl;
  document.getElementById('day1Icon').src = iconUrlDay1;
  document.getElementById('day2Icon').src = iconUrlDay2;
  document.getElementById('day3Icon').src = iconUrlDay3;

  const windUpd = weatherObject.list[0].wind.speed;
  const humidityUpd = weatherObject.list[0].main.humidity;
  const feelsLikeUpd = weatherObject.list[0].main.feels_like;
  precipitation.innerHTML = langStream.weatherId[getWeatherId(weatherId)];
  feelsLikeValue.innerHTML = `<pre> ${setUnits(feelsLikeUpd, 'set')}°</pre>`;
  windValue.innerHTML = `<pre> ${windUpd} </pre>`;
  humidityValue.innerHTML = `<pre> ${humidityUpd}%</pre>`;

  const link = await getLinkToImage(weatherDescription);
  setBackground(link);
  setDays();
}


// get selected location
async function getLocation(mode) {
  let place;
  if (!city.value) {
    place = await getPlace(`${longitude},${latitude}`, lang);
  } else place = await getPlace(city.value, lang);

  if (place) {
    const placeCountry = place.metaDataProperty.GeocoderMetaData.Address.Components
      .filter((reading) => reading.kind.includes('country'))[0];
    const placeCityName = place.metaDataProperty.GeocoderMetaData.Address.Components
      .filter((reading) => reading.kind.includes('locality'))[0];

    let currentCity;
    if (placeCityName !== undefined) {
      currentCity = `${placeCityName.name}, ${placeCountry.name}`;
    } else {
      currentCity = `${place.name}, ${placeCountry.name}`;
    }

    if (mode !== 'updateCity') {
      refreshCoordinates(place.Point.pos.split(' ')[1], place.Point.pos.split(' ')[0]);
      myMap.setCenter([latitude, longitude], 11);
      refreshWeather();
    }
    document.getElementById('currentCity').innerHTML = currentCity;
  }
}


// click settings items
en.addEventListener('mousedown', () => {
  selectItem('language', en);
  setLanguage();
});
ru.addEventListener('mousedown', () => {
  selectItem('language', ru);
  setLanguage();
});
be.addEventListener('mousedown', () => {
  selectItem('language', be);
  setLanguage();
});

fahrenheit.addEventListener('mousedown', () => {
  if (units !== 'fahrenheit') {
    selectItem('degrees', fahrenheit);
    setUnits(0, 'change');
  }
});
celsius.addEventListener('mousedown', () => {
  if (units !== 'celsius') {
    selectItem('degrees', celsius);
    setUnits(0, 'change');
  }
});

search.addEventListener('mousedown', () => {
  if (!document.getElementById('cityQuery').value) {
    alert(langStream.emptyCity);
  } else getLocation();
});

city.addEventListener('keypress', (event) => {
  if (event.code === 'Enter') {
    if (!document.getElementById('cityQuery').value) {
      alert(langStream.emptyCity);
    } else getLocation();
  }
});

refresh.addEventListener('mousedown', () => refreshWeather());


// yandex map
function init() {
  myMap = new ymaps.Map('map', {
    center: [latitude, longitude],
    zoom: 11,
  });
  let myPlacemark = new ymaps.Placemark([latitude, longitude]);
  myMap.geoObjects.add(myPlacemark);
}

ymaps.ready(init);


// currently user position
function success(pos) {
  const crd = pos.coords;

  refreshCoordinates(crd.latitude, crd.longitude);
  getLocation();
}
function error(err) {
  alert(`ERROR(${err.code}): ${err.message}`);
}


// save & load Local Storage
function localStorageSave() {
  localStorage.setItem('Language', lang);
  localStorage.setItem('Units', units);
}

async function localStorageLoad() {
  if (localStorage.getItem('Units') === 'celsius') {
    selectItem('degrees', celsius);
  } else if (localStorage.getItem('Units') === 'fahrenheit') {
    selectItem('degrees', fahrenheit);
  }

  if (localStorage.getItem('Language') === 'en') {
    selectItem('language', en);
    await setLanguage('withoutUpdateCity');
  } else if (localStorage.getItem('Language') === 'ru') {
    selectItem('language', ru);
    await setLanguage('withoutUpdateCity');
  } else if (localStorage.getItem('Language') === 'be') {
    selectItem('language', be);
    await setLanguage('withoutUpdateCity');
  }
}

window.addEventListener('beforeunload', () => {
  localStorageSave();
});


// get date and time from current place
setInterval(() => {
  let date = new Date();
  date.setDate(date.getUTCDate());
  date.setHours(date.getUTCHours() + timeZone);
  const time = date.toTimeString().slice(0, 5);
  date = `${langStream[date.toDateString().slice(0, 3).toLowerCase()]} ${date.getDate()} ${langStream[date.getMonth()]} ${date.getFullYear()}`;
  date = `<pre>${date}     ${time}</pre>`;
  document.getElementById('date').innerHTML = date;
}, 1000);
