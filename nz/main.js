/*Neuseelandreise Skript*/
//einzelner Kommentar
var map = L.map('map').setView([-44.616667, 167.866667], 11);
                  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([-44.616667,167.866667 ]).addTo(map)
.bindPopup('<h3>Milford Sound </h3>.')
.openPopup();