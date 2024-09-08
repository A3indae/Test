
const carPerMeter = .2255
const busPerMeter = .1331

const busSpeed = 800/3
const carSpeed = 500
const humanSpeed = 200/3

let Case1 = 0
let Case2 = 1

let Times = [0,0,0]
let Grams = [0,0,0]

let time = 0
async function initMap() {
    //기본설정ㄹ

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { Map } = await google.maps.importLibrary("maps");
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();

    let IsAttachment0 = true;
    let routeMode = 'DRIVING'

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

    let Attachment0 = new AdvancedMarkerElement({
        map,
        position: { lat: 38.5023713788343, lng: 125.76390677172103},
      });
      let Attachment1 = new AdvancedMarkerElement({
        map,
        position: { lat: 39.03430015157314, lng: 125.76240577936426},
    });

    //마커
    map.addListener("click", (e) => {

        let now = new Date();
        let minutes = now.getMinutes() * 60 * 1000
        let seconds = now.getSeconds() * 1000
        let milliseconds = now.getMilliseconds()

        if (minutes + seconds + milliseconds - time < 1000) {return}
        time = minutes + seconds + milliseconds

        if (IsAttachment0) {Attachment0.position = e.latLng} else {Attachment1.position = e.latLng}
        calcRoute();
        IsAttachment0 = !IsAttachment0
    });

    //펑션!
    function getTotalDistance(result) {
      let totalDistance = 0;
      const route = result.routes[0];

      for (let i = 0; i < route.legs.length; i++) {
        totalDistance += route.legs[i].distance.value;
      }
      return totalDistance;
    }

    function calcRoute() {
      directionsRenderer.set('directions', null);
      let start = Attachment0.position;
      let end = Attachment1.position;
      let request = {
        origin: start,
        destination: end,
        travelMode: routeMode
      };
      directionsService.route(request, function(result, status) {
        console.log(status)
        if (status == 'OK') {
          directionsRenderer.setDirections(result);
          let D = getTotalDistance(result);
          
          if (D>10000){
            document.getElementById("Total").innerText = "총 거리: "+ (Math.round(D/100)/10) +"km"
          }
          else{
            document.getElementById("Total").innerText = "총 거리: "+D+"m"
          }
          DisplayResult(D)
        }
      });
    }

    //설명서
    let Extented = false;
    const infoButton = document.getElementById('infoButton');
    const description = document.getElementById('description');

    infoButton.addEventListener('click', function() {
        if (Extented){
            this.style.transform = 'rotate(0deg)'
            description.style.height = '0px'
            description.style.opacity = 0
        }
        else{
            this.style.transform = 'rotate(90deg)'
            description.style.height = '5em'
            description.style.opacity = 1
        }
        Extented = !Extented
    })

    //정확도
    const DButton = document.getElementById("DistanceButton")
    DButton.addEventListener("click", function() {
      if (routeMode == "DRIVING") {routeMode = "TRANSIT"; document.getElementById("DistanceButton").innerText = "거리 정확성: 낮음";} else {routeMode = "DRIVING"; document.getElementById("DistanceButton").innerText = "거리 정확성: 높음";}
    })
    //자가용 비교
    const ifMove1 = document.getElementById("ifMove1")
    const ifMove2 = document.getElementById("ifMove2")
    const ulll = document.getElementById("ulll")

    ifMove1.addEventListener("click", function() {
      Case1 += 1
      if (Case1 >= 3) {Case1=0}
      switch(Case1){
        case 0:
          ifMove1.innerText = "자가용"
          break
        case 1:
          ifMove1.innerText = "대중교통"
          break
        default:
          ifMove1.innerText = "걷기"

      }
      calculateThings()
    })
    ifMove2.addEventListener("click", function() {
      Case2 += 1
      if (Case2 >= 3) {Case2=0}
      switch(Case2){
        case 0:
          ifMove2.innerText = "자가용"
          ulll.innerText = "을"
          break
        case 1:
          ifMove2.innerText = "대중교통"
          ulll.innerText = "을"
          break
        default:
          ifMove2.innerText = "걷기"
          ulll.innerText = "를"

      }
      calculateThings()
    })
}

window.initMap = initMap;
function DisplayResult(Distance) {

  Grams[0] = Distance*carPerMeter
  Grams[1] = Distance*busPerMeter

  let carCO2string = Math.round(Grams[0])+"g"
  let busCO2string = Math.round(Grams[1])+"g"

  if (Grams[0] >= 1000){carCO2string = (Math.round(Grams[0]/100)/10)+"kg"}
  if (Grams[1] >= 1000){busCO2string = (Math.round(Grams[1]/100)/10)+"kg"}

  Times[0] = Distance/carSpeed
  Times[1] = Distance/busSpeed
  Times[2] = Distance/humanSpeed

  let carTimestring = Math.round(Times[0])+"분"
  let busTimestring = Math.round(Times[1])+"분"
  let humanTimestring = Math.round(Times[2])+"분"

  if (Times[0]>=60){ carTimestring = Math.round(Times[0]/60)+"시간 "+Math.floor(Times[0]%60)+"분" }
  if (Times[1]>=60){ busTimestring = Math.round(Times[1]/60)+"시간 "+Math.floor(Times[1]%60)+"분" }
  if (Times[2]>=60){ humanTimestring = Math.round(Times[2]/60)+"시간 "+Math.floor(Times[2]%60)+"분" }

  document.getElementById("caseCar").innerText = "자가용을 이용하였을 때: "+carCO2string+", "+carTimestring
  document.getElementById("caseBus").innerText = "대중교통을 이용하였을 때: "+busCO2string+", "+busTimestring
  document.getElementById("caseWalk").innerText = "걸어간다면: "+humanTimestring
  calculateThings()
}

function calculateThings(){
  let RelGram = Grams[Case2] - Grams[Case1]
  let RelTime = Times[Case2] - Times[Case1]

  if (RelGram<0){
    document.getElementById("resultG").innerText = "그리고 "+Math.round(-RelGram)+"g의 탄소 덜 사용됨."
  }
  else {
    document.getElementById("resultG").innerText = "그리고 "+Math.round(RelGram)+"g의 탄소 더 사용됨."
  }

  if (RelTime<0){
    document.getElementById("resultT").innerText = Math.round(-RelTime)+"분 덜 소요됨."
  }
  else {
    document.getElementById("resultT").innerText = Math.round(RelTime)+"분 더 소요됨."
  }
}