const apiKey = 'bf35cac91880cb98375230fb443a116f';
let units = 'metric';

const cities = [
  { id: 703448, name: 'Київ', elementId: 'kyiv' },
  { id: 2643743, name: 'Лондон', elementId: 'london' },
  { id: 5128581, name: 'Нью-Йорк', elementId: 'newyork' }
];

function fetchWeatherForCity(city){
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${apiKey}&units=${units}&lang=ua`;

fetch(url)
  .then(response => response.json())
  .then(data => showWeather(data, city.elementId))
  .catch(error => console.error(`Помилка для ${city.name}:`, error));
}


function showWeather(data, elementId) {
    const iconCode = data.weather[0].icon;
    const iconPath = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const tempUnit = units === 'metric' ? '°C' : '°F';

    const windSpeed = data.wind.speed;
    const windDeg = data.wind.deg;
    const pressure = data.main.pressure;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('uk-Ua', { hour: '2-digit', minute: '2-digit'});
    const sunset =  new Date(data.sys.sunset * 1000).toLocaleTimeString('uk-Ua', { hour: '2-digit', minute: '2-digit'});

   const rawDescription = data.weather[0].description;
   const description = rawDescription.charAt(0).toUpperCase() + rawDescription.slice(1);

    const container = document.getElementById(elementId);
    container.innerHTML = `
    <h2>${data.name}</h2>
    <div class="temp">${Math.round(data.main.temp)}°</div>
    <div class="desc">${description}</div>
    <div class="extra">
     Відчувається як: ${Math.round(data.main.feels_like)}°<br>
     Мін: ${Math.round(data.main.temp_min)}°, Макс: ${Math.round(data.main.temp_max)}°</div>
    <div class="details">
     Вітер: ${windSpeed} ${units === 'metric' ? 'м/с' : 'mph'}, напрямок: ${windDeg}°<br>
     Тиск: ${pressure} гПа<br>
     Схід: ${sunrise}, Захід: ${sunset}
     </div>
    <img src="${iconPath}" alt="${description}">

   `; 
   container.classList.remove('city');
   void container.offsetWidth;
   container.classList.add('city');
}

function fetchAllCities() {
  cities.forEach(city => fetchWeatherForCity(city));
}

fetchAllCities();

document.getElementById('unit-toggle').addEventListener('change', function () {
  units = this.checked ? 'imperial' : 'metric';
  fetchAllCities();
});

