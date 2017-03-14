const Node = (function () {
    function Node() {
        this.chain = new Chain();
        this.peers = {};
        this.peers.broadcast = function (data) {
            console.log("Broadcast:", data);
        };
    }

    Node.prototype.init = function () {
        this.peers.broadcast(MSG.QUERY_ALL());
    };


    Node.prototype.publishAll = function(){
        this.peers.broadcast(MSG.PUBLISH_ALL(
            this.chain.chain.map(b=>b.toString())
        ));
    };

    Node.prototype.processNewLocalData = function(data){
        this.peers.broadcast(MSG.NEW_DATA(data));
        this.processNewData(data);
    };

    Node.prototype.processNewData = function(data){
        let newBlock = this.chain.getLastBlock().createNextBlock(data);
        this.chain.push( newBlock );
        this.peers.broadcast(MSG.PUBLISH_ONE(this.chain.getLastBlock().toString()));
    };

    Node.prototype.discoverAll = function(chain){
        if (chain.length() > this.chain.length()) {
            if (chain.isValid()){
                this.chain = chain;
                console.log("discoverAll: chain replaced");
            } else {
                console.log("discoverAll: chain invalid");
            }
        } else {
            console.log("discoverAll: chain to old"+chain.length);
        }
    };

    Node.prototype.discover = function (block) {
        if (block.index > this.latest.index) {
            if (block.index === this.latest.index + 1 && block.prev.hash === this.latest.hash) {
                this.push(block);
            } else {
                this.peers.broadcast(MSG.QUERY_ALL());
            }
        } else {
            /* do nothing */
        }
    }

    return Node;
})();