function generateMap() {
    // Adapted from tutorials at https://openlayers.org/en/latest/doc/quickstart.html and https://openlayers.org/en/latest/examples/feature-move-animation.html?q=marker
    var vector = new ol.source.Vector({
        features: []
    });

    var map = new ol.Map({
        target: "map",
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                source: vector
            })
        ],

        view: new ol.View({
            center: ol.proj.fromLonLat([-46, 30]),
            zoom: 1
        })
    });

    // See tutorial at https://openlayers.org/workshop/en/basics/popup.html
    // When map is clicked
    map.on("click", setCityFromMap(map));

    // Return references to map components that we want to manipulate later on
    return {
        vector: vector
    }
}

function setCityFromMap(map) {
    return function(clickEvent) {
        var features = map.getFeaturesAtPixel(clickEvent.pixel);
        if (features) {
            var city = features[0]["P"]["name"];
            $("#city").val(city);
            $("#citySelect").val("...");
        }
    }
}

function addCityMarker(city, home, vector) {
    // Add city to map
    $.getJSON("https://maps.googleapis.com/maps/api/geocode/json",
        {
            key: "AIzaSyBS51Ie62oop80DusSgDqGwP14FktYXp04",
            sensor: true,
            address: city
        },
        function(data) {
            var location = data["results"][0]["geometry"]["location"];
            var cityMarker = new ol.Feature({
                name: city,
                type: "geoMarker",
                geometry: new ol.geom.Point(ol.proj.fromLonLat([location["lng"], location["lat"]]))
            });

            if (home) {
                cityMarker.setStyle(new ol.style.Style({
                    image: new ol.style.Icon({
                        scale: 0.8,
                        src: "https://openlayers.org/en/v4.6.4/examples/data/dot.png"
                    })
                }));
            }
            vector.addFeature(cityMarker);
        }
    );
}
