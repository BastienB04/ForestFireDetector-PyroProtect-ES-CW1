import React from 'react';
import ReactDOM from 'react-dom';
import Map_ from './Map_';

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 51.4988, lng: 0.1749 },
    mapTypeId: "satellite",
  });

  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(51.4488, 0.1249),
    new google.maps.LatLng(51.5488, 0.2249)
  );

  class CustomOverlay extends google.maps.OverlayView {
    bounds;
    div;
    constructor(bounds) {
      super();
      this.bounds = bounds;
    }

    onAdd() {
      this.div = document.createElement('div');
      this.div.style.borderStyle = "none";
      this.div.style.borderWidth = "0px";
      this.div.style.position = "absolute";

      this.div.style.width = "100%";
      this.div.style.height = "100%";
      this.div.style.position = "absolute";
      ReactDOM.render(<Map_ />, this.div);

      this.getPanes().floatPane.appendChild(this.div);
    }

    draw() {
      const overlayProjection = this.getProjection();
      const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
    
      if (this.div) {
        this.div.style.left = sw.x + "px";
        this.div.style.top = sw.y + "px";
        this.div.style.width = ne.x - sw.x + "px";
        this.div.style.height = ne.y - sw.y + "px";
      }
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
};


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
//   var southWest = new google.maps.LatLng(51.3988, 0.0749);
//   var northEast = new google.maps.LatLng(51.4988,  0.1749); 
//   var bounds = new google.maps.LatLngBounds(southWest, northEast);
//   customOverlay.bounds = bounds;
// };
