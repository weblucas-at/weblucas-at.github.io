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


    L.geoJSON(geojson, {
pointToLayer: function(geoJsonPoint,latlng) {
    //console.log(geoJsonPoint.properties.NAME);
    let popup = `
        <img src="${geoJsonPoint.properties.THUMBNAIL}"
        alt=""><br>
        <strong>${geoJsonPoint.properties.NAME}</strong>
        <hr>
        Adresse: ${geoJsonPoint.properties.ADRESSE}<br>
        <a href="${geoJsonPoint.properties.WEITERE_INF}
        ">Weblink</a>
    `;
    return L.marker(latlng, {
        icon: L.icon({
            iconUrl:"icons/photo.png",
            iconAnchor: [16, 37],
            popupAnchor: [0, -37]
        })
    }).bindPopup(popup);
}       
    }).addTo(overlay);
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
 
 
     L.geoJSON(geojson, {
        pointToLayer: function(geoJsonPoint,latlng) {
            //console.log(geoJsonPoint.properties.NAME);
            let popup = `
            <strong>${geoJsonPoint.properties.LINE_NAME}</strong><br>
            Station ${geoJsonPoint.properties.STAT_NAME}
                
            `;
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl:`icons/bus_${geoJsonPoint.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            }).bindPopup(popup);
        }       
            }).addTo(overlay);

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
 
 
     L.geoJSON(geojson, {
         style: function (feature) {
             console.log (feature)

             let colors = {
                    "Red Line": "#FF4136",
                    "Yellow Line": "y#FFDC00",
                    "Blue Line": "#0074D9",
                    "Green Line": "#2ECC40",
                    "Grey Line": "#AAAAAA",
                    "Orange Line": "#FF851B"
             };
             return{
                 color: `${colors[feature.properties.LINE_NAME]}`
             }
         }
     }).bindPopup(function (layer) {
        return`
        <h4>${layer.feature.properties.LINE_NAME}</h4>
        von: ${layer.feature.properties.FROM_NAME}
        <br> 
        nach: ${layer.feature.properties.TO_NAME}
        
        `;

        //return layer.feature.properties.LINE_NAME;

    }).addTo(overlay);
}
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json");

//Fußgänger
async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json();
    //console.log(geojson);

    let overlay = L.featureGroup()
    layerControl.addOverlay(overlay, "Fußgängerzonen Wien");
    overlay.addTo(map);

// die || sind der logical or operator, wenn dann "" ohne etwas drinnen ist dann steht da nichts falls nichts in der Angabe steht (vermeidet dass null dort steht)
    L.geoJSON(geojson, {
        style:function (feature) {
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.1,
                fillOpacity: 0.1
            }
        }
    }).bindPopup(function (layer) {
        return`
           <h4>Fußgängerzone ${layer.feature.properties.ADRESSE}</h4>
            <p>${layer.feature.properties.ZEITRAUM || ""}</p>
            <p>${layer.feature.properties.AUSN_TEXT || ""}</p>
        `;
    }).addTo(overlay);
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json");
/*async function loadZones(url) {
    let response = await fetch(url);
    let geojson = await response.json();

     //console.log(geojson);

     let overlay = L.featureGroup()

     layerControl.addOverlay(overlay, "Fußgängerzonen");
     overlay.addTo(map);

    L.geoJSON (geojson, {
        style:function (feature) {
        return {
            color: "#F012BE",
            weight:1,
            opacity: 0.1,
            fillOpacity: 0.1
        }
    }
    }).bindPopup(function(layer) {

        return`
        <h4> Fußgängerzone${layer.feature.properties.ADRESSE}
        <p> ${layer.feature.properties.ZEITRAUM ||""}</p>
        <p> ${layer.feature.properties.AUSN_TEXT||""}</p>
        `;
    }).addTo(overlay);
 
}
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")//Fußgänger
    */
    //Hotel
async function loadHotels(url) {
    let response = await fetch(url);
    let geojson = await response.json();

     console.log(geojson);

     let overlay = L.markerClusterGroup({
         disableClusteringAtZoom: 17

     });

     layerControl.addOverlay(overlay, "Hotels und Unterkünfte");
     overlay.addTo(map);
 
     L.geoJSON(geojson, {
        pointToLayer: function(geoJsonPoint,latlng) {
            console.log(geoJsonPoint.properties);
            let popup = `
            <strong>${geoJsonPoint.properties.BETRIEB}</strong><br>
             ${geoJsonPoint.properties.BETRIEBSART_TXT} <br>
             ${geoJsonPoint.properties.KATEGORIE_TXT} <br>
             Adresse:   ${geoJsonPoint.properties.ADRESSE} <br>
             Telefonnummer:   ${geoJsonPoint.properties.KONTAKT_TEL} <br>
             <hr>
             <a href="${geoJsonPoint.properties.KONTAKT_EMAIL}">E-Mail</a><br>
             <a href="${geoJsonPoint.properties.WEBLINK1}">Weblink</a>

            `;
            if
            (geoJsonPoint.properties.BETRIEBSART =="H"){
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl:"icons/hotel_0star.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
    }).bindPopup(popup);
} else if (geoJsonPoint.properties.BETRIEBSART == "P") {
    return L.marker(latlng, {
        icon: L.icon({
            iconUrl: "icons/lodging_0star.png",
            iconAnchor: [16, 37],
            popupAnchor: [0, -37]
        })
    }).bindPopup(popup);
            }else{
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl:"icons/apartment-2.png",
                        iconAnchor: [16, 37],
                        popupAnchor: [0, -37]
                    })
    }).bindPopup(popup);
}
        }
    }).addTo(overlay);
}
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")

//DOC Hotels anzeigen
let popup = `
<h3>${hotel.name}</h3>
<h4>${hotel.Betriebsart}</h4>
<h5>${hotel.Kategorie}</h5>
<h6>${hotel.Adresse}</h6>
<h7>${hotel.Telefonnummer}</h7>
<hr>
<img src="${hotel.image}" alt="Vorschaubild">
<hr>
<a href="${hotel.link}" target=Hotels> Link zum Hotel</a>
<a href="${hotel.emailadresse}" target=Hotels> Link zum Hotel</a>
`;
