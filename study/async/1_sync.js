var sync1 = function (param){
    return param * 2;
}
var sync2 = function (param){
    return param * 3;
}
var sync3 = function (param){
    return param * 4;
}
var start = 1;
console.log(sync3(sync2(sync1(start))))
// 결과값 : 24
