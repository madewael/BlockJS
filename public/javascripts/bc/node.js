const Node = (function () {
    function Node() {
        this.chain = new Chain();
        this.peers = {};
        this.peers.broadcast = function (data) {
            LOG("Broadcast:", data);
        };
    }

    Node.prototype.init = function () {
        this.peers.broadcast(MSG.QUERY_ALL());
    };


    Node.prototype.publishAll = function(tar){
        this.peers.broadcast(MSG.PUBLISH_ALL(
            this.chain.chain.map(b=>b.toString())
        ), tar);
    };

    Node.prototype.processNewLocalData = function(data){
        //this.peers.broadcast(MSG.NEW_DATA(data));
        this.processNewData(data);
    };

    Node.prototype.processNewData = function(data){
        let newBlock = this.chain.getLastBlock().createNextBlock(data);
        this.chain.push( newBlock );
        if (this.chain.getLastBlock()!==newBlock) throw "wtf";
        this.peers.broadcast(MSG.PUBLISH_ONE(this.chain.getLastBlock().toString()));
    };

    Node.prototype.discoverAll = function(chain){
        LOG("discoverAll: received chain to check ...");
        if (chain.length() > this.chain.length()) {
            if ( chain.isValid() ){
                this.chain = chain;
                LOG("discoverAll: chain replaced");
                LOG("discoverAll: " + JSON.stringify(this.chain.data()));
            } else {
                LOG("discoverAll: chain invalid");
            }
        } else {
            LOG("discoverAll: received chain older than ours"+
                chain.length() + ">" + this.chain.length());
        }
    };

    Node.prototype.discover = function (block) {
        let latestBlock = this.chain.getLastBlock();

        if (block.index > latestBlock.index) {
            if (block.index === latestBlock.index + 1 && block.prevHash === latestBlock.hash) {
                this.chain.push(block);
                if (latestBlock !== this.chain.getLastBlock()){
                    LOG("discover: block added " + this.chain.length());
                    LOG("discover: " + JSON.stringify(this.chain.data()));
                } else {
                    LOG("discover: block NOT added (invalid)");
                }
            } else {
                this.peers.broadcast(MSG.QUERY_ALL());
                LOG("discover: block is not next block, query all");
            }
        } else {
            /* do nothing */
            this.log("discover: block is to old");
        }
    }

    return Node;
})();