String.prototype.supplant = function (o) {
  return this.replace(/{([^{}]*)}/g, function (a, b) { var r = o[b]; return typeof r === 'string' || typeof r === 'number' ? r : a; });
};

$(document).ready(function() {

  function initialize_map() {
    var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(49.8037633,15.4749126),
      scrollwheel: true,
      panControl: false,
      streetViewControl: false,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.Vm,
        position: google.maps.ControlPosition.TOP_LEFT
      }
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var markerCluster = new MarkerClusterer(map);
    var infoWindow = new google.maps.InfoWindow();
    var markers = [];

    var image = 'assets/images/pin_normal.png';
    var window_template = '<div class="startup"><div class="heading"><h4><a href="{url}" target="_blank">{name}</a><br><small>{address}</small></h4></div><hr><div class="body"><p>{description}</p></div></div>'
    var menu_template   = '<a href="#" data-index="{index}" class="startup list-group-item">{name}</a>'

    $.ajax({
      url: "/feed.json", // "http://www.startupjobs.cz/map.php"
      type: "GET",
      dataType: "json",
      crossDomain: true,
      // xhrFields: { withCredentials: true },
      data: {},
      success: function (data) {
        $(data).each(function() {
          var position = new google.maps.LatLng(this.latutide, this.longitude);
          var marker = new google.maps.Marker({ title: this.name, position: position, map: map, icon: image, data: this });

          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setOptions({
              content: window_template.supplant({ url: marker.data.url, name: marker.data.name, address: marker.data.address, description: marker.data.description }),
              maxWidth: 280
            });
            infoWindow.open(map, marker);
          });

          var link = menu_template.supplant({ url: marker.data.url, name: marker.data.name, address: marker.data.address, index: markers.length });
          $("#sidebar-wrapper nav").append(link);

          markers.push(marker);

        });
        var markerCluster = new MarkerClusterer(map, markers, { gridSize: 50, maxZoom: 13 });

        $('#sidebar-wrapper #counter').text($('#sidebar-wrapper nav a.startup').length);
        $('#sidebar-wrapper nav a.startup').on('click', function() {
          focusStartup($(this).data('index'));
          return false;
        });

      },
      error: function (xhr, ajaxOptions, thrownError) {
        alert( 'Could not load data.' );
      }
    });

    $('a#logo').click(function() {
      map.setOptions(mapOptions);
      return false;
    });

    function focusStartup(index) {
      var marker = markers[index];
      map.setCenter(marker.position);
      map.setZoom(14);

      infoWindow.setOptions({
        content: window_template.supplant({ url: marker.data.url, name: marker.data.name, address: marker.data.address, description: marker.data.description }),
        maxWidth: 280
      });
      infoWindow.open(map, marker);
    };

  };

  google.maps.event.addDomListener(window, 'load', initialize_map);

});
