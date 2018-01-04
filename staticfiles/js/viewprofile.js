/* --- GLOBALS --- */
var $favButton = $("#favourite");
var userName = $("#userName").text();

/* --- EVENT HANDLERS --- */
// When document is loaded
$(document).ready(function () {
    var city = $("#city").text();
    var vector = generateMap()["vector"];
    addCityMarker(city, false, vector);

    // twick - Extra map removed
    console.log("Done");
    $('#map').children().last().remove();
});


// When focus returns to window
$(window).focus(function () {
    updateFriendButton();
});

// When add/remove favourite button is clicked
$favButton.click(function () {
    switch ($favButton.val()) {
        case "self":
            return;

        case "add":
            $.post(
                "edit_favourite",
                {
                    friend_name: userName,
                    action: "add"
                },
                function () {
                    updateFriendButton();
                });
            break;

        case "remove":
            $.post(
                "edit_favourite",
                {
                    friend_name: userName,
                    action: "remove"
                },
                function () {
                    updateFriendButton();
                }
            );
    }

});

/* --- PAGE ACTIONS --- */
function updateFriendButton() {
    $.post(
        "edit_favourite",
        {
            action: "check_status",
            friend_name: userName
        },
        function (data) {
            if ($favButton.val() === "self") {
                return;
            }

            $favButton
                .val(data["already_favourite"] ? "remove" : "add")
                .text(data["already_favourite"] ? "Remove favourite" : "Add favourite");

        }
    );
}

