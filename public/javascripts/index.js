const socket = io();
const node = new Node();

$(()=>{
    $("#dataForm").submit(evt=>{
        evt.preventDefault();
        var txt = $("#text").val();
        $("#text").val("");
        node.processNewLocalData(txt);
    });
});

node.peers.broadcast = function (data) {
    addMessage("Broadcast:" + JSON.stringify(data));
    socket.emit('broadcast', data);
};

node.init();

socket.on('message', function (data) {
    switch( MSG.TYPE(data) ){
        case MSG.QUERY_ALL:   return node.publishAll();
        case MSG.NEW_DATA:    return node.processNewData(data.data);
        case MSG.PUBLISH_ALL: return node.discoverAll(Chain.parse(data.chain));
        case MSG.QUERY_ONE:
        case MSG.PUBLISH_ONE:
            addMessage("NYI msg received:"+ JSON.stringify(data));
            break;
        default: addMessage("UKN msg received:"+ JSON.stringify(data));
    }
});

function addMessage(message) {
    var text = document.createTextNode(message),
        el = document.createElement('li'),
        messages = document.getElementById('messages');

    el.appendChild(text);
    messages.appendChild(el);
}