// load selected place information from 'https://geocode-maps.yandex.ru'
export async function getPlace(place, lang) {
  let placeName;
  const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=af0dbd6a-6887-43bb-8160-57e861593da4&geocode=${place}&lang=${lang}`;

  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      placeName = data.response.GeoObjectCollection.featureMember[0].GeoObject;
    })
    .catch((err) => alert(`Please input correct city name.\n ${err}`));

  return placeName;
}

export async function getWeather(latitude, longitude) {
  const url = 'https://api.openweathermap.org/data/2.5/forecast';
  const params = `lat=${latitude}&lon=${longitude}&lang=en&units=metric`;
  const apiKey = '03002feb4716ae6a2619917df860988c';

  return fetch(`${url}?${params}&APPID=${apiKey}`)
    .then((res) => res.json());
}

export async function getBackgroundUrl(description) {
  const url = 'https://api.unsplash.com/photos/random';
  const apiKey = '658a67d9c97fa7ec1a24960dc7e837177c74d8d70cd84ae216e6619df6f93842';

  return fetch(`${url}?query=${description}&client_id=${apiKey}`)
    .then((res) => res.json());
}
