export async function getLinkToImage(description) {
  const url = `https://api.unsplash.com/photos/random?query=${description}&client_id=658a67d9c97fa7ec1a24960dc7e837177c74d8d70cd84ae216e6619df6f93842`;

  try {
    return await fetch(url).then((res) => res.json()).then((data) => data.urls.regular);
  } catch (ERROR) {
    alert(`Failed to load background image, maybe the number of requests exceeded (50 per hour). Try it at the beginning of a new hour. Error code: ${error.message}`);
  }
}

// load weather information from 'http://api.openweathermap.org/'
export async function getWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=en&units=metric&APPID=03002feb4716ae6a2619917df860988c`;

  try {
    return await fetch(url).then((res) => res.json()).then((data) => data);
  } catch (ERROR) {
    alert('Failed to load weather information');
  }
}

// load selected place information from 'https://geocode-maps.yandex.ru'
export async function getPlace(place, lang) {
  const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=af0dbd6a-6887-43bb-8160-57e861593da4&geocode=${place}&lang=${lang}`;

  try {
    return await fetch(url)
      .then((response) => response.json())
      .then((data) => data.response.GeoObjectCollection.featureMember[0].GeoObject);
  } catch (ERROR) {
    alert('Please input correct city name');
  }
}
