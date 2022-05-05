/* OGD Wien Beispiel */


let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom"
};

let startLayer = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [stephansdom.lat, stephansdom.lng],
    zoom: 12,
    layers: [
        startLayer
    ],
});

let layerControl = L.control.layers({
    "BasemapAT Grau": startLayer,
    "Basemap Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "Basemap High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "Basemap Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "Basemap Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "Basemap Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "Basemap Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "Basemap mit Orthofoto und Beschriftung": L.layerGroup([
            L.tileLayer.provider("BasemapAT.orthofoto"),
            L.tileLayer.provider("BasemapAT.overlay"),

        ]

    )
}).addTo(map);
layerControl.expand();

/*
let sightLayer = L.featureGroup();

layerControl.addOverlay(sightLayer, "Sehenswürdigkeit");

let mrk = L.marker ([stephansdom.lat, stephansdom.lng]). addTo(sightLayer);
sightLayer.addTo(map);
*/

//Maßstab hinzugefügt
L.control.scale({
    imperial: false,
}).addTo(map);

L.control.fullscreen().addTo(map);

let miniMap = new L.Control.MiniMap(
    L.tileLayer.provider("BasemapAT"), {
        "toggleDisplay": "True"
    }).addTo(map);

//Sehenswürdigkeiten
async function loadSites(url) {
    let response = await fetch(url);
    let geojson = await response.json();


    //console.log(geojson);

    let overlay = L.featureGroup();

    layerControl.addOverlay(overlay, "Sehenswürdigkeit");
    overlay.addTo(map);


    L.geoJSON(geojson).addTo(overlay);
}
    loadSites("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");


    //Touristische Kraftfahrlinien
async function loadStops(url) {
    let response = await fetch(url);
    let geojson = await response.json();

     //console.log(geojson);

     let overlay = L.featureGroup();

     layerControl.addOverlay(overlay, "Haltestellen Vienna Sightseeing");
     overlay.addTo(map);
 
 
     L.geoJSON(geojson).addTo(overlay);
}
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");

  //Linien
  async function loadLines(url) {
    let response = await fetch(url);
    let geojson = await response.json();

     //console.log(geojson);

     let overlay = L.featureGroup();

     layerControl.addOverlay(overlay, "Linien Vienna Sightseeing");
     overlay.addTo(map);
 
 
     L.geoJSON(geojson).addTo(overlay);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

//Fußgänger
async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json();

     //console.log(geojson);

     let overlay = L.featureGroup();

     layerControl.addOverlay(overlay, "Fußgängerzonen");
     overlay.addTo(map);
 
 
     L.geoJSON(geojson).addTo(overlay);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")//Fußgänger
    
    //Hotel
async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json();

     //console.log(geojson);

     let overlay = L.featureGroup();

     layerControl.addOverlay(overlay, "Hotels und Unterkünfte");
     overlay.addTo(map);
 
 
     L.geoJSON(geojson).addTo(overlay);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")