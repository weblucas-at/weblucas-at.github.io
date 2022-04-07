/*Neuseelandreise Skript*/
//einzelner Kommentar
let lat = -44.616667;
let lng = 167.866667;
let zoom = 11;

  let coords = [ -39.13, 175.65];
console.log (coords);   
console.log(coords [0]);
console.log(coords [1]);
console.log(coords.length);

let map = L.map('map').setView([lat, lng], zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([lat,lng ]).addTo(map)
.bindPopup('<h3>Milford Sound </h3>.')
.openPopup();