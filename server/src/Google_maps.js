// import React from 'react';
// import ReactDOM from 'react-dom';
// import Map_ from './Map_';
function templateConcat(n, str){
  res = str
  for(i=0; i<n-1; i++){
      res+= " " + str
  }
  return res;
}

let map;
let zoomLevel = 7;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 51.4988, lng: 0.1349 },
    mapTypeId: "satellite",
  });

  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(51.4488, 0.1049),
    new google.maps.LatLng(51.5488, 0.1649)
  );

  class CustomOverlay extends google.maps.OverlayView {
    constructor(bounds) {
      super();
      this.bounds = bounds;
      this.div = null;
    }
  
    onAdd() {
      this.div = document.createElement('div');
      this.div.style.border = "none";
      this.div.style.borderWidth = "0px";
      this.div.style.position = "absolute";
      this.div.style.width = "100%";
      this.div.style.height = "100%";
      this.div.style.display = 'grid';
      this.div.style.gridTemplateColumns = templateConcat(10, '40px');
      this.div.style.gridTemplateRows = templateConcat(10, '40px');

      ReactDOM.render(<Map_ />, this.div);
      const panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div);
      this.div.addEventListener('click', (event) => {
        // check if the clicked element is a dot
        if (event.target.classList.contains('dot')) {
          // navigate to the href specified in the a tag
          window.location.href = event.target.parentNode.href;
        }
      });
      const mapDiv = this.getMap().getDiv();
  let isDraggingMap = false;

  // Prevent map drag and scroll while interacting with the object
  this.div.addEventListener("mousedown", () => {
    isDraggingMap = false;
    mapDiv.style.pointerEvents = "none";
    google.maps.event.addDomListener(mapDiv, "mouseleave", () => {
      isDraggingMap = true;
    });
  });

  // Restore map drag and scroll after interacting with the object
  document.addEventListener("mouseup", () => {
    if (!isDraggingMap) {
      mapDiv.style.pointerEvents = "auto";
      google.maps.event.clearListeners(mapDiv, "mouseleave");
    }
  });






    }
  
    onRemove() {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }
    
    draw() {
      const overlayProjection = this.getProjection();
      if (!overlayProjection) {
        return;
      }
  
      const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
  
      if (this.div) {
        this.div.style.left = sw.x + "px";
        this.div.style.top = sw.y + "px"; // Change to use ne.y instead of sw.y
        this.div.style.width = (100 / (zoomLevel-7)) + "%";
        this.div.style.he = (100 / (zoomLevel-7)) + "%";
        //this.div.style.width = ne.x - sw.x + "px";
        //this.div.style.height = sw.y - ne.y + "px"; // Change to use sw.y - ne.y instead of ne.y - sw.y
      }
      google.maps.event.addListener(map, "zoom_changed", function () {
        // Get the current zoom level
         zoomLevel = map.getZoom();
         console.log(zoomLevel);
      });
    }
  }
  
  

  const customOverlay = new CustomOverlay(bounds);
  customOverlay.setMap(map);
}


// function initMap() {
//   const map = new google.maps.Map(document.getElementById('map'), {
//     center: { lat: 51.4988, lng: 0.1749 },
//     zoom: 8
//   });

//   const customOverlay = new google.maps.OverlayView();
//   customOverlay.onAdd = function () {
//     const div = document.createElement('div');
//     div.id = 'grid';
//     div.style.display = "flex";
//     div.style.alignItems = "center";
//     div.style.justifyContent = "center";
//     div.style.position = "absolute";
//     div.style.width = "100%";
//     div.style.height = "100%";

//     ReactDOM.render(<Map_ />, div);
//     this.getPanes().floatPane.appendChild(div);
//   };

//   customOverlay.setMap(map);
// };