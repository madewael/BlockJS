const Chain = (function () {
    function Chain(chain) {
        this.chain = chain || [Block.genesisBlock];
    }

    Chain.prototype.data = function () {
        let res = [];
        for (let i = 1; i < this.chain.length; i++) {
            res.push(this.chain[i].data);
        }
        return res;
    };


    Chain.prototype.isValid = function () {
        for (let i = 1; i < this.chain.length; i++) {
            if (!this.chain[i].isValid(this.chain[i - 1])) {
                return false;
            }
        }
        return true;
    };

    Chain.prototype.getLastBlock = function() {
        return this.chain[this.chain.length-1];
    };

    Chain.prototype.length = function(){ return this.chain.length; };

    Chain.prototype.push = function(block) {
        if (block.isValid(this.getLastBlock())){
            this.chain.push(block);
        } else {
            LOG("Could not push new block with idx" + block.index);
        }
        return this;
    }

    Chain.parse = function(arr){
        arr.shift();
        return arr
            .map(Block.parse)
            .reduce((c,b)=>c.push(b), new Chain());
    };

    return Chain;
})();