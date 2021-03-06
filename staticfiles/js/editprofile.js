/* --- GLOBALS --- */
// Spoken vs wanted languages
const language_types = ["spoken", "wanted"];

// Current user's id
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var userId=getParameterByName("userId");

// Dummy variable, used to force reload profile image after it is changed
var pic_requests = 0;

/* --- EVENT HANDLERS --- */
$(document).ready(function () {
    // Use data from server to fill the form
    console.log("inside fill form Ready function");
    getInfo(fillForm);

    language_types.forEach(function (type) {
        // Define event handler for 'add' buttons
        $("#add" + type[0].toUpperCase() + type.slice(1) + "LangButton")
        .click(function () {
            addLanguage(type);
        });

        // Fill language drop-down and add event handler
        var $langSelect = $("#" + type + "LangSelect");
        $langSelect.change(function () {
            $("#add" + type[0].toUpperCase() + type.slice(1) + "LangField").val($langSelect.find(":selected").text());
        });
        fillLanguageList(type);
    });

    var vector = generateMap()["vector"];

    getInfo(function (data) {
        processCities(vector, data["city"])
    });

});

// Returns an event handler to attach to 'remove' buttons in language lists
function makeRemoveHandler(language, type) {
    return function () {
        $.get("remove_language", {language: language, type: type}, function () {
            getInfo(fillForm);
        })
    };
}

// 'Submit' button handler
$("#submitButton").click(function () {
    console.log("Inside submit button")
    var data = new FormData();
    data.append("f_name", $("#firstName").val());
    data.append("l_name", $("#lastName").val());
    data.append("city", $("#city").val());
    data.append("bio", $("#bio").val());
    data.append("picture", $("#filename").get(0).files[0]);
    data.append("mode", $("#mode").val());
    data.append("userId", userId);

    $.ajax({
        url: "result",
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: function () {
            $("#result").text("Success!");
            getInfo(fillForm);
        }
    });
});

$("#remove-pic").click(function () {
    $.get(
        "profile_picture",
        {
            userId: userId,
            action: "remove"
        },
        function () {
            getInfo(fillForm);
        })
});

/* --- PAGE ACTIONS --- */

// Pre-fill the form
function fillForm(data) {
    console.log("fill form function")
    $("#firstName").val(data["firstName"]);
    $("#lastName").val(data["lastName"]);
    $("#city").val(data["city"]);
    $("#bio").val(data["bio"]);
    $("#mode").val(data["mode"]);
    
    console.log("data :")
    console.log(data)

    userId = data["userId"];

    // (Re-)set profile picture
    var $pic = $("#profile_pic");
    $pic.attr("src", "");
    $pic.attr("src", "profile_picture?action=show&userId=" + userId + "&pic_requests=" + pic_requests++);

    // Add already entered languages
    function addLanguages(type) {
        var languages = data[type + "_languages"];
        var $langList = $("#" + type + "LangList").html("");
        if (languages.length === 0) {
            $langList.append($("<p>").html("<b>No languages yet!</b>"));
        }
        else {
            $.each(languages, function (i, v) {
                $langList.append($("<li>").text(v)
                    .append($("<button>").text("Remove").click(makeRemoveHandler(v, type))));
            })
        }
    }

    language_types.forEach(addLanguages);

    getFavourites(
        function (friend) {
            $("#friends")
                .append($("<li>").append(
                    $("<a>").attr("href", "viewprofile.html?user_name=" + friend).text(friend)
                    ).append(
                    $("<button>")
                        .text("Remove")
                        .click(removeFavourite(friend, function() {getInfo(fillForm);}))
                    )
                );
        },
        function () {
            $("#friends").html("No friends!");
        });

}

// Fill a language drop-down menu
function fillLanguageList(type) {
    console.log("inside fill language List")
    var $langSelect = $("#" + type + "LangSelect");
    $langSelect.html("<option disabled selected>Popular languages</option>");
    getInfo(function (data) {
        getKnownLanguages(data[type + "_languages"], function (language) {
            $langSelect.append($("<option>").attr("value", language).text(language));
        });
    });
}

function processCities(vector, homecity) {
    console.log("inside process cities")
    // Find and empty cities dropdown
    var $citySelect = $("#citySelect");
    $citySelect.html("<option disabled selected>Popular cities</option>");

    // For each known city ...
    getKnownCities(function (city) {
        // Add city to dropdown
        $citySelect.append($("<option>").attr("value", city).text(city));
        addCityMarker(city, city === homecity, vector);
    });
}


/* --- SERVER REQUESTS --- */

// Get current user's profile info
function getInfo(onSuccess) {
    console.log("inside GetInfo function")
    $.getJSON("info",{"userId":userId}, function (data) {
        onSuccess(data);
    }).fail(function (e) {
        console.log("Error" + e);
    })
}

// Add a language to a user's profile
function addLanguage(type) {
    console.log("inside add language function")
    var language = $("#add" + type[0].toUpperCase() + type.slice(1) + "LangField").val();
    var $warning = $("#" + type + "LangWarning");
    $warning.text("");


    // Check for duplicates
    getInfo(function (data) {
        if (data["spoken_languages"].includes(language) || data["wanted_languages"].includes(language)) {
            $warning.html("<b>The language you're trying to add is already on your list!</b>");
        }
        else {
            $.getJSON("add_language", {language: language, type: type, userId:userId}, function () {
                getInfo(fillForm);
                fillLanguageList(type);
            })
        }
    });

}

function getKnownItems(itemType, data, onSuccess) {
    console.log("inside get known Items")
    $.getJSON("known_" + itemType, data, function (data) {
        $.each(data[itemType], function (_, item) {
            onSuccess(item)
        })
    })
}

// Get the list of all currently known languages (across different users)
function getKnownLanguages(exclude, onSuccess) {
    console.log("inside get known language")
    getKnownItems("languages", {exclude: exclude.join("%")}, onSuccess);
}

// Get the list of all currently known cities
function getKnownCities(onSuccess) {
    console.log("inside get known cities")
    getKnownItems("cities", {}, onSuccess);
}

// Get the list of friends/favourites, then call onSuccess for each entry
function getFavourites(onSuccess, onEmpty) {
    console.log("inside favourites")
    $.getJSON(
        "get_friends",
        {userId : userId},
        function (data) {
            console.log("friends data : ");
            console.log(data);
            if (data["favourites"].length === 0) {
                onEmpty();
            }

            $.each(
                data["favourites"],
                function (_, v) {
                    onSuccess(v)
                }
                );
        });
}

function removeFavourite(friend, onSuccess) {
    console.log("inside remove favourites")
    return function () {
        $.post(
            "edit_favourite",
            {
                friend_name: friend,
                action: "remove"
            },
            function () {
                onSuccess();
            }
            );
    };
}