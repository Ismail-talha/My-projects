
var lat = 0; // user's latitude
var lon = 0; // user's longitude
var address;


function loadMapAll() {
//alert('loadMapAll');
    var def = $.Deferred(),
    requests = [];
    cities = [];
    var count = 0;
    $('#waterwheelcarousel img').each(function (index, value) {
        try {
            var dfd = $.Deferred();
            var _this = this;

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': $(_this).attr("address") }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var mapid = "map-" + $(_this).attr("locationid");

                    cities.push([$(_this).attr("locationid").toString(), eval(results[0].geometry.location.lat()).toString(), eval(results[0].geometry.location.lng()).toString(), $(_this).attr("location")]);
                    var myLatLng = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
                    console.log(myLatLng);


                    var map = new google.maps.Map(document.getElementById(mapid), {
                        zoom: 15,
                        disableDefaultUI: true,
                        center: myLatLng
                    });
                    var image = '../images/cd-icon-location.png';
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        title: $(_this).attr("address"),
                        icon: image
                    });



                    count++;

                    if (count == LocationLen) {
                       // alert(JSON.stringify(cities));
                        initMap();
                        document.getElementById("PreLoader").setAttribute("style", "display:none");
                    }

                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                    document.getElementById("PreLoader").setAttribute("style", "display:none");
                }
            });



            dfd.resolve();
            requests.push(dfd);
        }
        catch (ex) {

        }
    });
    $.when.apply($, requests).then(function () {

                    // setTimeout(function(){
                        locationId = sessionStorage.getItem("locationId");
                        session = sessionStorage.getItem("sessionId");
                        // alert("#map-"+locationId);
                        console.log($("#map-"+locationId).next());
                        $("#map-"+locationId).next().attr('src', "../images/select-map.png");
                        
                        $("#map-"+locationId).next().removeAttr("style");
                        $("#map-"+locationId).addClass("mapbox-hide");
                        RefreshObjectArray();
                  //      },1500)

        console.log('requests done');
        def.resolve();
    });

    return def.promise();

}

function loadMapAll_old()
{



            $('#waterwheelcarousel img').each(function (index, value) {
      

                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': $(this).attr("address") }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {

                        //In this case it creates a marker, but you can get the lat and lng from the location.LatLng


                        alert(JSON.stringify(results[0].geometry.location));

                        var mapid = "map-" + $(this).attr("locationid");

                        var myLatLng = { lat: parseFloat($(this).attr("lat")), lng: parseFloat($(this).attr("lng")) };
                        console.log(myLatLng);
                        var map = new google.maps.Map(document.getElementById(mapid), {
                            zoom: 16,
                            center: myLatLng
                        });

                        var marker = new google.maps.Marker({
                            position: myLatLng,
                            map: map,
                            title: 'Hello World!'
                        });


                 
                       // return results[0].geometry.location;

                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });




                //var mapid="map-"+$(this).attr("locationid");

                //var myLatLng = { lat: parseFloat($(this).attr("lat")), lng: parseFloat($(this).attr("lng")) };
                //console.log(myLatLng);
                //var map = new google.maps.Map(document.getElementById(mapid), {
                //    zoom: 16,
                //    center: myLatLng
                //});

                //var marker = new google.maps.Marker({
                //    position: myLatLng,
                //    map: map,
                //    title: 'Hello World!'
                //});

            });


    
}


function initMap() {
    google.maps.visualRefresh = true;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 18,
        draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true,
    });
    var infoWindow = new google.maps.InfoWindow({ map: map });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            lat = pos.lat;
            lon = pos.lng;
            NearestCity(lat, lon);
            infoWindow.setPosition(pos);
            infoWindow.setContent('Nearest Location Found.<br/> ' + address);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    setTimeout(function() {
             map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
            //google.maps.event.trigger(map,'resize');
        
        }, 1000);



}
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}




var closest;
function NearestCity(latitude, longitude) {


    var mindif = 99999;
    //var closest;
    for (index = 0; index < cities.length; ++index) {
        var dif = PythagorasEquirectangular(latitude, longitude, cities[index][1], cities[index][2]);

        if (dif < mindif) {
            closest = index;
            mindif = dif;
        }
    }


    console.log("Your Nearest Location is done: " + cities[closest]);
    address = cities[closest];





    ////$('#map-' + cities[closest][0]).removeClass("mapbox-hide");
    //$('#map-' + cities[closest][0]).addClass("mapbox-hide");


    //$('.map-box').next().attr("style", "display:none");
    //$('#map-' + cities[closest][0]).next().removeAttr("style");


    ////  $('#waterwheelcarousel img').attr('src', "../images/map.png");
    //$('#map-' + cities[closest][0]).next().attr('src', "../images/select-map.png");


    //var $newCenterItem = $('#map-' + cities[closest][0]).next();
    //setTimeout(function () {

    //    locationId = $newCenterItem.attr("locationid");
    //    session = $newCenterItem.attr("sessionId");

    //    var deliveryCharges = $newCenterItem.attr("deliveryCharges");
    //    var deliveryTime = $newCenterItem.attr("deliveryTime");
    //    var minOrderAmount = $newCenterItem.attr("minOrderAmount");

    //    // alert(locationId)
    //    objWebOrder = null;

    //    sessionStorage.setItem("locationId", locationId);
    //    sessionStorage.setItem("session", session);

    //    sessionStorage.setItem("deliveryCharges", deliveryCharges);
    //    sessionStorage.setItem("deliveryTime", deliveryTime);
    //    sessionStorage.setItem("minAmount", minOrderAmount);

    //    $('.AmtDelivery').html(deliveryCharges);
    //    $('.deliveryTime').html(deliveryTime);
    //    $('.minAmount').html(minOrderAmount);

    //   // gotoTab('step2', 2);


    //}, 500);




}


function Deg2Rad(deg) {
    return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
}




// Callback function for asynchronous call to HTML5 geolocation
function UserLocation(position) {

    NearestCity(position.coords.latitude, position.coords.longitude);
}

