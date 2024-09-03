function async1(param){
    // return new Promise(function(resolve,reject){
    //     resolve(param * 2);
    // })
    return Promise.resolve(param*2)
}
function async2(param){
    return Promise.resolve(param*3)
}
function async3(param){
    return Promise.resolve(param*4)
}
var start = 1;
//1.치킨주문
async1(start)
    .then(async2)
    .then(async3)
    .then((result)=>{
        console.log(result); //결과값:24
    })
//2.마트가고
//3.생수사먹고