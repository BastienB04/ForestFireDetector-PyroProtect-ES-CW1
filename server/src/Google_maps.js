// import React from 'react';
// import ReactDOM from 'react-dom';
// import Map_ from './Map_';

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 51.4988, lng: 0.1349 },
    mapTypeId: "satellite",
  });

  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(51.4488, 0.1049),
    new google.maps.LatLng(51.5488, 0.1649)
  );

  class CustomOverlay extends google.maps.OverlayView {
    bounds;
    div;
    map;
    constructor(bounds, map) {
      super();
      this.bounds = bounds;
      this.map = map;
    }
  
    onAdd() {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      this.div.style.width = "100%";
      this.div.style.height = "100%";
      ReactDOM.render(<Map_ />, this.div);
      this.getPanes().floatPane.appendChild(this.div);
    }
  
    draw() {
      const overlayProjection = this.getProjection();
      if (!overlayProjection) {
        return;
      }
  
      const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
      if (!sw || !ne) {
        return;
      }
  
      const offsetX = sw.x;
      const offsetY = ne.y;
      const width = ne.x - sw.x;
      const height = sw.y - ne.y;
  
      this.div.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      this.div.style.width = `${width}px`;
      this.div.style.height = `${height}px`;
  
      // Get the zoom level of the map and use it to adjust the scale of the grid
      const zoom = this.map.getZoom();
      this.div.style.transform += ` scale(${1 / Math.pow(2, zoom - 7)})`;
    }
  
    onRemove() {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }
  
    hide() {
      if (this.div) {
        this.div.style.visibility = "hidden";
      }
    }
  
    show() {
      if (this.div) {
        this.div.style.visibility = "visible";
      }
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