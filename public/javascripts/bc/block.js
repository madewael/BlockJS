const Block = (function () {
    function SHA256(str) {
        return CryptoJS.SHA256(str).toString();
    }

    function Block(index, prevHash, data, timestamp, hash) {
        this.index = index;
        this.prevHash = prevHash;
        this.data = data;
        this.timestamp = timestamp;
        this.hash = hash;

        if(!hash) this.initHash();
    }

    Block.prototype.initHash = function(){
        this.hash = this.computeHash();
    };

    Block.prototype.computeHash = function () {
        return SHA256(
            this.index +
            this.prevHash +
            this.timestamp +
            JSON.stringify(this.data)
        ).toString();
    };

    function length2suffix(length){
        let res= "";
        for(let i=0;i<length;i++)res+='0';
        return res;
    }

    Block.prototype.hasProofOfWork = function () {
        const length = 3;
        const sub = this.hash.substr(this.hash.length - length);
        return sub === length2suffix(length);
    };

    Block.prototype.toString = function () {
        return JSON.stringify({
            index: this.index,
            prev: this.prevHash,
            date: this.data,
            timestamp: this.timestamp,
            hash: this.hash
        });
    };



    Block.prototype.isValid = function (prevBlock) {
        if(!prevBlock && !(prevBlock instanceof Block))
            throw {src:Block.prototype.isValid, msg:"prevBlock must be instance of Block", value: prevBlock};
        if (this===Block.genesisBlock) {
            return true;
        } else if (this.index !== prevBlock.index + 1) {
            console.log("invalid index",prevBlock,this);
            return false;
        } else if (this.prevHash != prevBlock.hash) {
            console.log("invalid prev hash");
            return false;
        } else if (this.hash !== this.computeHash()) {
            console.log("invalid hash");
            return false;
        } else {
            return true;
        }
    };

    Block.prototype.createNextBlock = function(data) {
        data = data || "(empty)";

        let newBlock = new Block(
            this.index+1,
            this.hash,
            {data: data, pow: 0},
            new Date().getTime(),
            undefined
        );

        while (!newBlock.hasProofOfWork()) {
            newBlock.data.pow++;
            newBlock.initHash();
        }

        return newBlock;
    };

    Block.genesisBlock = new Block(0, undefined, null, 0, undefined, null);

    Block.parse = function (str) {
        let obj = JSON.parse(str);
        return new Block(
            obj.index,
            obj.prev,
            obj.data,
            obj.timestamp,
            obj.hash
        );
    };



    return Block;
})();