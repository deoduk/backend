var async1 = function (param, callback){
    callback(param * 2)
}
var async2 = function (param, callback){
    callback(param * 3);
}
var async3 = function (param, callback){
    callback(param * 4);
}
var start = 1;
async1(start, (result)=>{
    async2(result, (result)=>{
        async3(result, (result)=>{
            console.log(result); //결과값: 24
        })
    })
})
