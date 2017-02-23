//GLOBALS
var POS;


$(document).ready(function () {
  
    onPageLoad();

    $("#Swipe-Container").dragend({
        direction: "horizontal",
        afterInitialize: function () {
            $('.collapsible').collapsible();
        }
    });

    $('.btn_Logout').click(function () {
        
        $.ajax({
            type: "POST",
            headers: {
                Authorization: "Bearer " + sessionStorage.apiAccessToken
            },
            url: ServiceBaseUrl + "/api/Account/Logout",

            success: function (data, status, xhr) {
                console.log(data);
                sessionStorage.clear();
                location.href = '/';
            },

            error: function (xhr, status, err) {
                console.log(xhr);
            }
        });

        
    });

    $('#floatBtn_AddAddress').click(function () {
        $("#Swipe-Container").dragend("left");
    });

    $('#floatBtn_ViewAddress').click(function () {
        $("#Swipe-Container").dragend("right");
    });

    $('#searchBar_BtnClose').click(function () {
        $('#search').val("");
    });

    $('#btn_Address').click(function () {
        var data = {
            Label: $('#Add_Label').val(),
            Title: $('#Add_Title').val(),
            Line1: $('#Add_Line1').val(),
            Line2: $('#Add_Line2').val(),
            City: $('#Add_City').val(),
            State: $('#Add_State').val(),
            ZipCode: $('#Add_Zip').val(),
            Phone: $('#Add_Phone').val(),
            Pin: POS,
        };

        console.log(data);

        $.ajax({
            type: "POST",
            headers: {
                Authorization: "Bearer " + sessionStorage.apiAccessToken
            },
            url: ServiceBaseUrl + "/api/Address",
            data: data,
            success: function (data, status, jqXHR) {
                MakeToast("Success");
                location.reload();
            },
            error: function (xhr, status, error) {
                console.log("ServerResponse:", xhr);
                MakeToast("Error");
                if (xhr.responseJSON && xhr.responseJSON.ModelState)
                {
                    $.each(xhr.responseJSON.ModelState,
                        function (index, value) {

                            $.each(value,
                                function (ix, va) {
                                    MakeToast(va);
                                });
                        });
                }
                else if (xhr.responseJSON && xhr.responseJSON.ExceptionMessage)
                {
                    MakeToast(xhr.responseJSON.ExceptionMessage);
                }

            }
        });

    });

});//END of Ready


function onPageLoad()
{
    $('#PersonalInformationDiv').html(GetPersonalInformationAsHTML());

    $.ajax({
        type: "GET",
        headers: {
            Authorization: "Bearer " + sessionStorage.apiAccessToken
        },
        url: ServiceBaseUrl + "/api/Address",

        success: function (data, status, xhr) {
            console.log(data);
            DisplayAddresses(data);
        },

        error: function (xhr, status, err) {
            console.log(xhr);
        }
    });
}

function GetPersonalInformationAsHTML()
{
    return '<span> Email: '+ sessionStorage.userName +' </span>';
}

function DisplayAddresses(addresses)
{
    var AddrList = $('#AddressListTable');
    AddrList.empty();

    for(var i=0; i<addresses.length; i++)
    {
        AddrList.append(RenderAddress(addresses[i]));
    }
}

function RenderAddress(addr)
{
    return  '<tr>\
            <td><h5>'+ addr.Label +'</h5></td>\
            <td>' + RenderAddressText(addr.Address) + '</td>\
            <td><a class="btn-large orange" \
                    href="./lookup.html?q=' + addr.Label + '"> Navigate </a></td>\
            </tr>';
}
function RenderAddressText(addr)
{
    var NN = '<br />';
    return addr.Title + NN + addr.Line1 + NN + addr.Line2 + NN + addr.City + ', ' + addr.State + ', ' + addr.ZipCode + NN +
            'Phone: ' + addr.Phone;
}

function InitMap()
{
    var pos = {
        lat: 42.3279578,
        lng: -83.22514799999999
    }

    var map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('search');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            POS = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            console.log(place.geometry.location.lat());
            console.log(place.geometry.location.lng());

            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                draggable: true
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });//End of SearchBox Add Listener

    //if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(function (position) {
    //        var pos = {
    //            lat: position.coords.latitude,
    //            lng: position.coords.longitude
    //        };

           

    //    });//End of getCurrentPosition
    //}
}
