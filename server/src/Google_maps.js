function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: { lat: 62.323907, lng: -150.109291 },
    mapTypeId: "satellite",
  });

  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(62.281819, -150.287132),
    new google.maps.LatLng(62.400471, -150.005608)
  );

  let image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/talkeetna.png";
  
  class CustomOverlay extends google.maps.OverlayView {
    bounds;
    image;
    div;
    constructor(bounds, image) {
      super();
      this.bounds = bounds;
      this.image = image;
    }

    onAdd() {
      this.div = document.createElement('div');
      this.div.style.borderStyle = "none";
      this.div.style.borderWidth = "0px";
      this.div.style.position = "absolute";

      const img = document.createElement("img");
      img.src = this.image;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.position = "absolute";
      ReactDOM.render(<Map_ />, div);
      this.div.appendChild(div);


      const panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div);
    }

    draw() {
      const overlayProjection = this.getProjection();
      const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

      if (this.div) {
        this.div.style.left = sw.x + "px";
        this.div.style.top = ne.y + "px";
        this.div.style.width = ne.x - sw.x + "px";
        this.div.style.height = sw.y - ne.y + "px";
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

  const customOverlay = new CustomOverlay(bounds, image);
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
