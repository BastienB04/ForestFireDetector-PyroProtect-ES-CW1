function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 51.4988, lng: 0.1749 },
    zoom: 8
  });

  const customOverlay = new google.maps.OverlayView();
  customOverlay.onAdd = function () {
    const div = document.createElement('div');
    div.id = 'grid';
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.style.position = "absolute";
    div.style.width = "100%";
    div.style.height = "100%";

    ReactDOM.render(<Map_ />, div);
    this.div.appendChild(div);
  };

  customOverlay.setMap(map);
  var southWest = new google.maps.LatLng(51.3988, 0.0749);
  var northEast = new google.maps.LatLng(51.4988,  0.1749); 
  var bounds = new google.maps.LatLngBounds(southWest, northEast);
  customOverlay.bounds = bounds;
};
