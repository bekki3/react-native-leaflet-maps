const initialCoords = [41.322093, 69.253952];
const from = document.getElementById("fromInputField");
const to = document.getElementById("toInputField");
const geocoder = new L.Control.Geocoder.Nominatim();
const placeSuggestionContainer = document.getElementById("placeSuggestionContainer");

const map = L.map('map', { zoomControl: false }).setView(initialCoords, 12);

var myIcon = L.icon({
    iconUrl: 'pickup-icon3.png',
    iconSize: [34, 36],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],

});


const marker = L.marker(initialCoords, {icon: myIcon}).addTo(map);;

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function getLocation() {
  navigator.geolocation.getCurrentPosition(function (res) {
    const coords = [res.coords.latitude, res.coords.longitude];
    marker.setLatLng(coords);
    map.setView(coords, 16);
  });
}

map.on('move', function() {
    const center = map.getCenter();
    marker.setLatLng(center);
});

map.on('moveend', function() {
    const center = map.getCenter();
    console.log(`Marker coordinates: ${center}`);
});

function showWindow() {
  document.getElementById("myWindow").style.animation = "fadein 0.5s ease-in-out";
  document.getElementById("myWindow").style.display = "block";
}

function closeWindow() {
  document.getElementById("myWindow").style.animation = "fadeOut 0.5s ease-in-out";
  document.getElementById("myWindow").style.display = "none";

}

from.addEventListener('input', ()=>{
    suggestPlace("from");
});
to.addEventListener('input', ()=>{
    suggestPlace("to");
});


function suggestPlace(option) {
    let ul = "";
    if(option==="from"){
        geocoder.geocode(from.value, (res) => {
            res.forEach((element, index) => {
                ul+=`<li class="suggestionList" onclick="from.value = ('${res[index].name}')">${element.name}</li>`;
            })
            placeSuggestionContainer.innerHTML = ul;
          })
    }else if(option==="to"){
        geocoder.geocode(to.value, (res) => {
            res.forEach((element, index) => {
                ul+=`<li class="suggestionList" onclick="to.value = ('${res[index].name}')">${element.name}</li>`;
            })
            placeSuggestionContainer.innerHTML = ul;
          })
    }
}

function createRoute() {
    closeWindow();

  geocoder.geocode(from.value, function (fromResults) {
    geocoder.geocode(to.value, function (toResults) {
      if (fromResults.length === 0) {
        console.log('No results found for ' + from.value)
      } else if (toResults.length === 0) {
        console.log('No results found for ' + to.value)
      } else {
        var fromLatLng = fromResults[0].center;
        var toLatLng = toResults[0].center;

        var routingControl = L.Routing.control({
          waypoints: [
            fromLatLng,
            toLatLng
          ],
          routeWhileDragging: true
        }).addTo(map);
      }
    });
  });
}

function onMapClick(e) {
  console.log(e.latlng);
}

map.on('click', onMapClick);