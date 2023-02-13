
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.4988, lng: 0.1749},
    zoom: 8
  });

  var customOverlay = new google.maps.OverlayView();
  customOverlay.onAdd = function() {
    var div = document.createElement('div');
    div.id = 'grid';
    div.style.justifyContent = "center";
    div.style.position = "absolute";
    div.style.top = "50%";
    div.style.left = "50%";

    ReactDOM.render(<Map_ />, div);
    this.getPanes().floatPane.appendChild(div);
  };
  customOverlay.setMap(map);
  customOverlay.position(new google.maps.LatLng(51.4988, 0.1749));
};





