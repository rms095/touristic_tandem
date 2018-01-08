/* --- GLOBALS --- */
// Spoken vs wanted languages
const language_types = ["spoken", "wanted"];

// Current user's id
var userId;

// Dummy variable, used to force reload profile image after it is changed
var pic_requests = 0;

/* --- EVENT HANDLERS --- */
$(document).ready(function() {
    // Use data from server to fill the form
    getInfo(fillForm);

    language_types.forEach(function(type) {
        // Define event handler for 'add' buttons
        $("#add" + type[0].toUpperCase() + type.slice(1) + "LangButton")
            .click(function() {
                addLanguage(type);
            });

        // Fill language drop-down and add event handler
        var $citySelect = $("#citySelect");
        $citySelect.change(function() {
            $("#add" + type[0].toUpperCase() + type.slice(1) + "LangField").val($citySelect.find(":selected").text());
        });
        fillLanguageList(type);
    });

    // ******************************    fill input city from select ****** sarra

        $("#citySelect").change(function() {
            $("#addWantedCityField").eq($(this).index()).val(this.value);
        }).change();

    // ******************************    Add buttom ****** sarra

         $("#addSpokenLangButton")
            .click(function() {
                addLanguage(type);
            });

    // finish here


    var vector = generateMap()["vector"];

    getInfo(function(data) {
        processCities(vector, data["city"])
    });

});

// Returns an event handler to attach to 'remove' buttons in language lists
function makeRemoveHandler(language, type) {
    return function() {
        $.get("remove_language", {language: language, type: type}, function() {
            getInfo(fillForm);
        })
    };
}

$("#submitButton").click(function() {

    var data = new FormData();
    data.append("f_name", $("#firstName").val());
    data.append("l_name", $("#lastName").val());
    data.append("city", $("#city").val());
    data.append("bio", $("#bio").val());
    data.append("picture", $("#filename").get(0).files[0]);
    data.append("mode", $("#mode").val());

    $.ajax({
        url: "result",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: function() {
            $("#result").text("Success!");
            getInfo(fillForm);
        }});
});

$("#remove-pic").click(function() {
    $.get(
        "profile_picture",
        {
            userId: userId,
            action: "remove"
        },
        function() {
            getInfo(fillForm);
        })
});

/* --- PAGE ACTIONS --- */
// Pre-fill the form
function fillForm(data) {
    $("#firstName").val(data["firstName"]);
    $("#lastName").val(data["lastName"]);
    $("#city").val(data["city"]);
    $("#bio").val(data["bio"]);
    $("#mode").val(data["mode"]);

    userId = data["userId"];

    function addLanguages(type) {
        var partners = data["partners_names"];
        var $partList = $("#PartnersList").html("");
        if (partners.length === 0) {
            $partList.append($("<p>").html("<b>No partner found! </b>"));
        }
        else {
            $.each(partners, function(i, v) {
                $partList.append($("<li>").text(v)
                   // .append($("<button>").text("Remove").click(makeRemoveHandler(v, type)))
                    );
            })
        }
    }
    language_types.forEach(addLanguages);
}

// Fill a language drop-down menu
function fillLanguageList(type) {
    var $langSelect = $("#" + type + "LangSelect");
    $langSelect.html("<option disabled selected>Popular languages</option>");
    getInfo(function(data) {
        getKnownLanguages(data[type + "_languages"], function(language) {
            $langSelect.append($("<option>").attr("value", language).text(language));
        });
    });
}

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
// Get current user's profile info
function getInfo(onSuccess) {
    var city = $("#addWantedCityField").val();
    $.getJSON("InfoPartner", {cityName: city}, function(data) {
        onSuccess(data);
    }).fail(function() {
        console.log("Error");
    })
}


// search for partners by city

function addLanguage(type) {
    var language = $("#addWantedCityField").val();
    var $warning = $("#wantedCityWarning");
    $warning.text("");


    // Check city
    getInfo(function(data) {
        if (language == "") {
            $warning.html("<b>You did not select any city!</b>");
        }
        else {
                getInfo(fillForm);
               // fillLanguageList(language);

        }
    });

}

function getKnownItems(itemType, data, onSuccess) {
    $.getJSON("known_" + itemType, data, function(data) {
        $.each(data[itemType], function(_, item) {onSuccess(item)})
    })
}

// Get the list of all currently known languages (across different users)
function getKnownLanguages(exclude, onSuccess) {
    getKnownItems("languages", {exclude: exclude.join("%")}, onSuccess);
}

// Get the list of all currently known cities
function getKnownCities(onSuccess) {
    getKnownItems("cities", {}, onSuccess);
}