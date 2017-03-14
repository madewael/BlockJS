/**
 * Created by mattias.de.wael on 07/03/2017.
 */
const MSG = {
    QUERY_ALL   : ()=>      {return {msgId:0,msgName:"QUERY_ALL"}},
    QUERY_ONE   : ()=>      {return {msgId:1,msgName:"QUERY_ONE"}},
    PUBLISH_ALL : (chain)=> {return {msgId:2,msgName:"PUBLISH_ALL",chain:chain}},
    PUBLISH_ONE : (block)=> {return {msgId:3,msgName:"PUBLISH_ONE",block:block}},
    NEW_DATA    : (data)=>  {return {msgId:4,msgName:"NEW_DATA",data:data}},
    TYPE : (msg) => {
        switch(msg.msgId){
            case 0: return MSG.QUERY_ALL;
            case 1: return MSG.QUERY_ONE;
            case 2: return MSG.PUBLISH_ALL;
            case 3: return MSG.PUBLISH_ONE;
            case 4: return MSG.NEW_DATA;
            default: return null;
        }
    }
};