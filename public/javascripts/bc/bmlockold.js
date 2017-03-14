const Block = (function () {
    function SHA256(str) {
        return CryptoJS.SHA256(str).toString();
    }

    function isString(s) {
        return typeof(s) === 'string' || s instanceof String;
    }

    function Block(index, prev, data, timestamp, hash) {
        this.index = index;
        this.prev = ((prev instanceof Block) ? prev : new HashBlock(prev) );
        this.data = data;
        this.timestamp = timestamp;
        this.hash = hash;
    }

    Block.prototype.computeHash = function () {
        return SHA256(
            this.index +
            this.prev.hash +
            this.timestamp +
            JSON.stringify(this.data)
        ).toString();
    }

    Block.prototype.hasProofOfWork = function () {
        var length = 3;
        var sub = this.hash.substr(this.hash.length - length);
        return sub === '000';
    }

    Block.prototype.toString = function () {
        return JSON.stringify({
            index: this.index,
            prev: this.prev.hash,
            date: this.data,
            timestamp: this.timestamp,
            hash: this.hash
        });
    }

    Block.prototype.isValid = function (prev) {

        if (!prev) prev = this.prev;

        if (this.index !== prev.index + 1) {
            console.log("invalid index");
            return false;
        } else if (this.prev.hash != prev.hash) {
            console.log("invalid prev hash");
            return false;
        } else if (this.hash !== this.computeHash()) {
            console.log("invalid hash");
            return false;
        } else if (!prev.isValid()) {
            console.log("invalid prev block");
            return false;
        } else {
            return true;
        }
    }

    function BlockChain(prevBlock, data) {
        if (!data) throw "BlockChain constructor exprects data";
        var copy = (data instanceof Block );
        Block.call(this,
            (copy ? data.index :
                prevBlock.index + 1),
            prevBlock,
            (copy ? data.data : {data: data, pow: 0}),
            (copy ? data.timestamp : new Date().getTime()),
            (copy ? data.hash : undefined)
        );
        if (!copy) {
            this.hash = this.computeHash();
            while (!this.hasProofOfWork()) {
                this.data.pow = this.data.pow + 1;
                this.hash = this.computeHash();
            }

        }
    }

    BlockChain.prototype = Object.create(Block.prototype);
    BlockChain.prototype.constructor = BlockChain;

    BlockChain.prototype.push = function (block) {
        if (block.isValid(this)) {
            return new BlockChain(this, block);
        } else {
            return this;
        }
    }

    BlockChain.prototype.toArray = function () {
        var arr = this.prev.toArray();
        arr.push(this);
        return arr;
    }

    function HashBlock(hash) {
        this.hash = hash;
    }

    HashBlock.prototype = Object.create(Block.prototype);
    HashBlock.prototype.constructor = HashBlock;

    function GenesisBlock() {
        Block.call(this, 0);
        this.hash = this.computeHash();
    }

    GenesisBlock.prototype = Object.create(Block.prototype);
    GenesisBlock.prototype.constructor = GenesisBlock;

    GenesisBlock.prototype.isValid = function () {
        return this === BlockChain.genesisBlock;
    }

    GenesisBlock.prototype.toArray = function () {
        return [this];
    }

    BlockChain.genesisBlock = new GenesisBlock();
    BlockChain.parseBlock = function (str) {
        var obj = JSON.parse(str);
        return new Block(
            obj.index,
            obj.prev,
            obj.data,
            obj.timestamp,
            obj.hash
        );
    };

    BlockChain.parseChain = function(arr){
        arr = arr.map(BlockChain.parseBlock);
        return arr.reduce((chain,block)=>{
            console.log(chain);
            chain.push(block), BlockChain.genesisBlock
        });
    }

    return BlockChain;
})();