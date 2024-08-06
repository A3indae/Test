//이거요
const vehs = [.2, .07, 0, 1] //비행기, 자동차, 도보, 할모닝
var D = 0
const selectElement1 = document.getElementById("carA");
const selectElement2 = document.getElementById("carB");

async function initMap() {

    //기본설정ㄹ
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { Map } = await google.maps.importLibrary("maps");
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();

    var IsOne = true;
    var Extented = false;

    var routeMode = 'DRIVING'

    const mapOptions = {
        center: {lat: 39, lng: 125},
        zoom: 7,
        myTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        mapId: "4504f8b37365c3d0",
        minZoom: 4
    }
    //맵!
    const map = new Map(document.getElementById("map"), mapOptions)
    directionsRenderer.setMap(map);

    var Attachment0 = new AdvancedMarkerElement({
        map,
        position: { lat: 38.5023713788343, lng: 125.76390677172103},
      });
      var Attachment1 = new AdvancedMarkerElement({
        map,
        position: { lat: 39.03430015157314, lng: 125.76240577936426},
      });

    //마커
    map.addListener("click", (e) => {
        if (IsOne) {Attachment0.position = e.latLng} else {Attachment1.position = e.latLng}
        calcRoute();
        IsOne = !IsOne
    });

    //펑션!
    function getTotalDistance(result) {
      var totalDistance = 0;
      const route = result.routes[0];

      for (var i = 0; i < route.legs.length; i++) {
        totalDistance += route.legs[i].distance.value;
      }
      return totalDistance;
    }

    function calcRoute() {
      directionsRenderer.set('directions', null);
      var start = Attachment0.position;
      var end = Attachment1.position;
      var request = {
        origin: start,
        destination: end,
        travelMode: routeMode
      };
      directionsService.route(request, function(result, status) {
        console.log(status)
        if (status == 'OK') {
          directionsRenderer.setDirections(result);
          D = getTotalDistance(result);
          console.log(D);
          document.getElementById("plane").innerText = "약 " + (D * vehs[0]) + "g"
          document.getElementById("car").innerText = "약 " + (D * vehs[1]) + "g"
          document.getElementById("halmony").innerText = "약 " + (D * vehs[3]) + "g"
          DisplayResult()
        }
      });
    }

    //기타등등
    const targetElement = document.querySelector("#butIcon");

    const info = document.getElementById("sulMeoung")

    const infoButton = document.getElementById("moreInfo")
    infoButton.addEventListener("click", function() {
      if (Extented) {info.style.display = "none"; targetElement.style.setProperty("--iconRotation", "rotate(0)");} else {info.style.display = "block"; targetElement.style.setProperty("--iconRotation", "rotate(90deg)");}
      Extented = !Extented
    })
    const DButton = document.getElementById("Acc")
    DButton.addEventListener("click", function() {
      if (routeMode == "DRIVING") {routeMode = "TRANSIT"; document.getElementById("ASDASDASD").innerHTML = "거리 정확성: 낮음";} else {routeMode = "DRIVING"; document.getElementById("ASDASDASD").innerHTML = "거리 정확성: 높음";}
      console.log(routeMode)
    })
}


window.initMap = initMap;

function DisplayResult() {
  var arg1 = D * vehs[selectElement1.value]
  var arg2 = D * vehs[selectElement2.value]
  var res = arg1 - arg2
  if (res < 0) {document.getElementById("Res").innerText = (-res) + "g의 탄소가 더 사용됩니다."} else {document.getElementById("Res").innerText = (res) + "g의 탄소가 절약됩니다."}
}

function AChanged() {
  console.log(D * vehs[selectElement1.value])
  DisplayResult()
}
function BChanged() {
  console.log(D * vehs[selectElement2.value])
  if (selectElement2.value == 3) {document.getElementById("basictxtS").innerText = "을 이용한다면"} else {document.getElementById("basictxtS").innerText = "를 이용한다면"}
  DisplayResult()
}