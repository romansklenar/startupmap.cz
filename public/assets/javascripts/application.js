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
    var infoWindow = new google.maps.InfoWindow();
    var markers = [];
    var markerCluster = new MarkerClusterer(map);
    var markerSpiderfier = new OverlappingMarkerSpiderfier(map);
    markerSpiderfier.addListener('click', function(marker, event) { openInfoWindow(marker); });
    markerSpiderfier.addListener('spiderfy', closeInfoWindow);

    var image = 'assets/images/pin_normal.png';
    var windowTemplate = '<div class="startup"><div class="heading"><h4><a href="{url}" target="_blank">{name}</a><br><small>{address}</small></h4></div><hr><div class="body"><p>{description}</p></div></div>'
    var menuTemplate   = '<a href="#" data-index="{index}" class="startup list-group-item">{name}</a>'

    $.ajax({
      url: "http://www.startupjobs.cz/map.php",
      type: "GET",
      dataType: "json",
      crossDomain: true,
      // xhrFields: { withCredentials: true },
      data: {},
      success: function (data) {
        $(data).each(function() {
          var position = new google.maps.LatLng(this.latutide, this.longitude);
          var marker = new google.maps.Marker({ title: this.name, position: position, map: map, icon: image, data: this });

          // disabled in favor of OverlappingMarkerSpiderfier
          // google.maps.event.addListener(marker, 'click', function() { openInfoWindow(marker); });
          // google.maps.event.addListener(map, 'click', closeInfoWindow);

          var link = menuTemplate.supplant({ url: marker.data.url, name: marker.data.name, address: marker.data.address, index: markers.length });
          $("#sidebar-wrapper nav div.list-group").append(link);

          markers.push(marker);
          markerSpiderfier.addMarker(marker);

        });
        var markerCluster = new MarkerClusterer(map, markers, { gridSize: 50, maxZoom: 13 });

        var startups = $('#sidebar-wrapper nav div.list-group a.startup');
        startups.on('click', function() {
          focusStartup($(this).data('index'));
          startups.removeClass('active');
          $(this).addClass('active');
          return false;
        });
        $('#sidebar-wrapper #counter').text(startups.length);

      },
      error: function (xhr, ajaxOptions, thrownError) {
        alert( 'Nelze načíst datový zdroj.' );
      }
    });

    $('a#logo').click(function() {
      map.setOptions(mapOptions);
      closeInfoWindow();
      return false;
    });

    $(".list-group").niceScroll({ touchbehavior: false, cursorcolor: "#999", cursorborder: 'none', cursoropacitymax: 0.7, cursorwidth: 10, autohidemode: true });

    function focusStartup(index) {
      var marker = markers[index];
      map.setCenter(marker.position);
      map.setZoom(14);
      openInfoWindow(marker);
    };

    function openInfoWindow(marker) {
      var content = windowTemplate.supplant({ url: marker.data.url, name: marker.data.name, address: marker.data.address, description: marker.data.description });
      infoWindow.setOptions({ content: content, maxWidth: 280 });
      infoWindow.open(map, marker);
    };

    function closeInfoWindow() {
      infoWindow.close();
      $('#sidebar-wrapper nav a.startup').removeClass('active');
    };

  };

  google.maps.event.addDomListener(window, 'load', initialize_map);

});
