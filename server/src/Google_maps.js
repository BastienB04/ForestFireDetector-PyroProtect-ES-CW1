
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7749, lng: -122.4194},
    zoom: 8
  });

  var customOverlay = new google.maps.OverlayView();
  customOverlay.onAdd = function() {
    var div = document.createElement('div');
    ReactDOM.render(<Map_ />, div);
    this.getPanes().floatPane.appendChild(div);
  };
  customOverlay.setMap(map);
  customOverlay.position(new google.maps.LatLng(37.7749, -122.4194));
};





