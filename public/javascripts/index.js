$(() => {
    const socket = io();
    const node = new Node();
    $("#dataForm").submit(evt => {
        evt.preventDefault();
        var txt = $("#text").val();
        $("#text").val("");
        node.processNewLocalData(txt);
    });


    node.peers.broadcast = function (data, tar) {
        if (tar) {
            data.tar = tar;
            addMessage("Send:" + data.msgName + " to " + tar);
            socket.emit('message', data);
        } else {
            addMessage("Broadcast:" + data.msgName);
            socket.emit('broadcast', data);
        }
    };


    node.init();

    socket.on('message', function (data) {
        switch (MSG.TYPE(data)) {
            case MSG.QUERY_ALL:
                return node.publishAll(data.src);
            case MSG.NEW_DATA:
                return node.processNewData(data.data);
            case MSG.PUBLISH_ALL:
                return node.discoverAll(Chain.parse(data.chain));
            case MSG.PUBLISH_ONE:
                return node.discover(Block.parse(data.block));
            case MSG.QUERY_ONE:
                addMessage("NYI msg received:" + data.msgName + " " + data.src);
                break;
            default:
                addMessage("UKN msg received:" + JSON.stringify(data));
        }
    });

});