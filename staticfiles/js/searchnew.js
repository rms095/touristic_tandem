/* --- GLOBALS --- */
// Spoken vs wanted languages

/* --- EVENT HANDLERS --- */
$(document).ready(function() {
    // Use data from server to fill the form

    var vector = generateMap()["vector"];

    getInfo(function(data) {
        processCities(vector, data["city"])
    });

     // ******************************    fill input city from select ****** sarra

     var $citySelect = $("#citySelect");
     $citySelect.change(function() {
        $("#city").val($citySelect.find(":selected").text());
        });


});

 // Define event handler for 'search' buttons
        $("#searchButton")
            .click(function() {
                var cityname = $("#city").val();
                var $partListid = $("#PartnersListid").html("");
                var $partListfname = $("#PartnersListfname").html("");
                var $partListlname = $("#PartnersListlname").html("");
                var $partListmod = $("#PartnersListmode").html("");

               if(cityname==""){
                    $partListid.append($("<p>").html("<b>No selected city!</b>"));
               }
               else{
               $.getJSON("InfoPartner", {cityName: cityname}, function(data) {
                   // for(var part in data["partners_names"]){
                      //var partnid = data["partners_id"];
                     // console.log(partnid);
                      //$("#PartnersList").append("<li> "+partn);
                  // }
                 var partid = data["partners_id"];
                 var partfname = data["partners_firstnames"];
                 var partlname = data["partners_lastnames"];
                 var partmod = data["partners_modes"];

                if (partid.length === 0) {
                    $partListid.append($("<p>").html("<b>No partners found!</b>"));
                }
                else {
                    //******** ids
                    $.each(partid, function(i, v) {
                        $partListid.append($("<p>")
                        .append($("<button>").text("View profile").click(function(){
                        alert("partner id is : "+v);
                        }))
                        );
                    })
                    //********** first names
                    $.each(partfname, function(i, v) {
                        $partListfname.append($("<p>").text(v)
                            );
                    })
                    //********** last names
                    $.each(partlname, function(i, v) {
                        $partListlname.append($("<p>").text(v)
                           );
                    })
                    //********** mode
                    $.each(partmod, function(i, v) {
                        $partListmod.append($("<p>").text(v+"  mode")
                           );
                    })
                }

                  

                 })
            }});


// Returns an event handler to attach to 'remove' buttons in language lists

function GoPartner(id){
console.log(id);
}

/* --- PAGE ACTIONS --- */
// Pre-fill the form

// Fill a language drop-down menu

function processCities(vector, homecity) {
    // Find and empty cities dropdown
    var $citySelect = $("#citySelect");
    $citySelect.html("<option disabled selected>Popular cities</option>");

    // For each known city ...
    getKnownCities(function(city) {
        // Add city to dropdown
        $citySelect.append($("<option>").attr("value", city).text(city));
        addCityMarker(city, city === homecity, vector);
    });
}


/* --- SERVER REQUESTS --- */

function getInfo(onSuccess) {
    $.getJSON("info", function(data) {
        onSuccess(data);
    }).fail(function() {
        console.log("Error");
    })
}

function getKnownItems(itemType, data, onSuccess) {
    $.getJSON("known_" + itemType, data, function(data) {
        $.each(data[itemType], function(_, item) {onSuccess(item)})
    })
}

// Get the list of all currently known cities
function getKnownCities(onSuccess) {
    getKnownItems("cities", {}, onSuccess);
}