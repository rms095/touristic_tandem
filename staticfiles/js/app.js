/*$(document).ready(function () {
    var websocket = null;

    function addNewMessage(packet) {
        var msgElem = generateMessage(packet);
        $('#messages').append(msgElem);
        scrollToLastMessage()
    }

        websocket.onmessage = function (event) {
            var packet;

            try {
                packet = JSON.parse(event.data);
                console.log(packet)
            } catch (e) {
                console.log(e);
            }

            switch (packet.type) {
                case "users-changed":
                    addNewUser(packet);
                    break

                case "new-message":
                    addNewMessage(packet);
                    break;

                case "new-message":
                    console.log('some one is typing...');
                    break;

                default:
                    console.log('error: ', event)
            }
        }
    }

    function broadCastMessage(message) {
        var newMessagePacket = JSON.stringify({
            type: 'new-message',
            username: getUsername(),
            message: message
        });
        websocket.send(newMessagePacket)
    }

    $('#chat-message').keypress(function (e) {
        if (e.which == 13 && this.value) {
            broadCastMessage(this.value);
            this.value = "";
            return false
        }
    });

    $('#btn-send-message').click(function (e) {
        var $chatInput = $('#chat-message');
        var msg = $chatInput.val();
        if (!msg) return;
        broadCastMessage($chatInput.val());
        $chatInput.val('')
    });


    setupChatWebSocket();
    scrollToLastMessage()
});
*/

var session_key = $("#session_key").val();
var base_ws_server_path = $("#ws_server_path").val() ;
var opponent_username = $("#opponent_username").val();

$(document).ready(function () {
    var websocket = null;
    var monitor = null;

    function initReadMessageHandler(containerMonitor, elem) {
        var id = $(elem).data('id');
        var elementWatcher = containerMonitor.create(elem);
        elementWatcher.enterViewport(function () {
            var opponent_username = getOpponnentUsername();
            var packet = JSON.stringify({
                type: 'read_message',
                session_key: session_key,
                username: opponent_username,
                message_id: id
            });
            $(elem).removeClass('msg-unread').addClass('msg-read');
            websocket.send(packet);
        });
    }

    function initScrollMonitor() {
        var containerElement = $("#messages");
        var containerMonitor = scrollMonitor.createContainer(containerElement);
        $('.msg-unread').each(function (i, elem) {
            if ($(elem).hasClass('opponent')){
                initReadMessageHandler(containerMonitor, elem);
            }

        });
        return containerMonitor
    }

    function getOpponnentUsername() {
        return opponent_username;
    }

            // TODO: Use for adding new dialog
            function addNewUser(packet) {
                $('#user-list').html('');
                packet.value.forEach(function (userInfo) {
                    if (userInfo.username == getUsername()) return;
                    var tmpl = Handlebars.compile($('#user-list-item-template').html());
                    $('#user-list').append(tmpl(userInfo))
                });
            }

            function addNewMessage(packet) {
                var msg_class = "";
                if (packet['sender_name'] == $("#owner_username").val()) {
                    msg_class = "pull-left";
                } else {
                    msg_class = "pull-right";
                }
                var msgElem =
                $('<div class="row msg-unread" data-id="' + packet.message_id + '">' +
                    '<p class="' + msg_class + '">' +
                    '<span class="username">' + packet['sender_name'] + ': </span>' +
                    packet['message'] +
                    ' <span class="timestamp">&ndash; <span data-livestamp="' + packet['created'] + '"> ' + packet['created'] + '</span></span> ' +
                    '</p> ' +
                    '</div>');
                $('#messages').append(msgElem);
                scrollToLastMessage()
            }

            function scrollToLastMessage() {
                var $msgs = $('#messages');
                $msgs.animate({"scrollTop": $msgs.prop('scrollHeight')})
            }

            function generateMessage(context) {
                var tmpl = Handlebars.compile($('#chat-message-template').html());
                return tmpl({msg: context})
            }

            function setUserOnlineOffline(username, online) {
                var elem = $("#user-" + username);
                if (online) {
                    elem.attr("class", "btn btn-success");
                } else {
                    elem.attr("class", "btn btn-danger");
                }
            }

            function gone_online() {
                $("#offline-status").hide();
                $("#online-status").show();
            }

            function gone_offline() {
                $("#online-status").hide();
                $("#offline-status").show();
            }

            function flash_user_button(username) {
                var btn = $("#user-" + username);
                btn.fadeTo(700, 0.1, function () {
                    $(this).fadeTo(800, 1.0);
                });
            }

            function setupChatWebSocket() {
                var opponent_username = getOpponnentUsername();
                websocket = new WebSocket(base_ws_server_path + session_key + '/' + opponent_username);

                websocket.onopen = function (event) {
                    var opponent_username = getOpponnentUsername();

                    var onOnlineCheckPacket = JSON.stringify({
                        type: "check-online",
                        session_key: session_key,
                        username: opponent_username
                    });
                    var onConnectPacket = JSON.stringify({
                        type: "online",
                        session_key: session_key

                    });

                    console.log('connected, sending:', onConnectPacket);
                    websocket.send(onConnectPacket);
                    console.log('checking online opponents with:', onOnlineCheckPacket);
                    websocket.send(onOnlineCheckPacket);
                    monitor = initScrollMonitor();
                };


                window.onbeforeunload = function () {

                    var onClosePacket = JSON.stringify({
                        type: "offline",
                        session_key: session_key,
                        username: opponent_username,
                    });
                    console.log('unloading, sending:', onClosePacket);
                    websocket.send(onClosePacket);
                    //websocket.close();
                };


                websocket.onmessage = function (event) {
                    var packet;

                    try {
                        packet = JSON.parse(event.data);
                        console.log(packet)
                    } catch (e) {
                        console.log(e);
                    }

                    switch (packet.type) {
                        case "new-dialog":
                            // TODO: add new dialog to dialog_list
                            break;
                            case "user-not-found":
                            // TODO: dispay some kind of an error that the user is not found
                            break;
                            case "gone-online":
                            if (packet.usernames.indexOf(opponent_username) != -1) {
                                gone_online();
                            } else {
                                gone_offline();
                            }
                            for (var i = 0; i < packet.usernames.length; ++i) {
                                setUserOnlineOffline(packet.usernames[i], true);
                            }
                            break;
                            case "gone-offline":
                            if (packet.username == opponent_username) {
                                gone_offline();
                            }
                            setUserOnlineOffline(packet.username, false);
                            break;
                            case "new-message":
                            var username = packet['sender_name'];
                            if (username == opponent_username || username == $("#owner_username").val()){
                                addNewMessage(packet);
                                if (username == opponent_username) {
                                    initReadMessageHandler(monitor, $("div[data-id='" + packet['message_id'] + "']"));
                                }
                            } else {
                                if ($("#user-"+username).length == 0){
                                    var new_button = $(''+
                                        '<a href="/'+ username + '"' +
                                        'id="user-'+username+'" class="btn btn-danger">{% trans "Chat with" %} '+username+'</a>');
                                    $("#user-list-div").find("ul").append()
                                }
                                flash_user_button(username);

                            }
                            break;
                            case "opponent-typing":
                            var typing_elem = $('#typing-text');
                            if (!typing_elem.is(":visible")) {
                                typing_elem.fadeIn(500);
                            } else {
                                typing_elem.stop(true);
                                typing_elem.fadeIn(0);
                            }
                            typing_elem.fadeOut(3000);
                            break;
                            case "opponent-read-message":
                            if (packet['username'] == opponent_username) {
                                $("div[data-id='" + packet['message_id'] + "']").removeClass('msg-unread').addClass('msg-read');
                            }
                            break;

                            default:
                            console.log('error: ', event)
                        }
                    }
                }

                function sendMessage(message) {
                    var opponent_username = getOpponnentUsername();
                    var newMessagePacket = JSON.stringify({
                        type: 'new-message',
                        session_key: session_key,
                        username: opponent_username,
                        message: message
                    });
                    websocket.send(newMessagePacket)
                }

                $('#chat-message').keypress(function (e) {
                    if (e.which == 13 && this.value) {
                        sendMessage(this.value);
                        this.value = "";
                        return false
                    } else {
                        var opponent_username = getOpponnentUsername();
                        var packet = JSON.stringify({
                            type: 'is-typing',
                            session_key: session_key,
                            username: opponent_username,
                            typing: true
                        });
                        websocket.send(packet);
                    }
                });

                $('#btn-send-message').click(function (e) {
                    var $chatInput = $('#chat-message');
                    var msg = $chatInput.val();
                    if (!msg) return;
                    sendMessage($chatInput.val());
                    $chatInput.val('')
                });

                setupChatWebSocket();
                scrollToLastMessage();
            });
