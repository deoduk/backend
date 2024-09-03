/*-----------------------------------------
async란
-----------------------------------------*/
function myFunc(){
    return '동기함수결과입니다.';
}
async function myAsync(){
    return '비동기함수결과입니다.';
}
console.log(myFunc())
console.log(myAsync())
myAsync().then((result)=>{
    console.log(result)
})

/*-----------------------------------------
promise란?
-----------------------------------------*/
function delayP(sec){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(new Date().toISOString());
        }, sec*1000)
    })
}
console.log(delayP(3)) // 약속을 리턴한다.
delayP(3).then((result)=>{
    console.log(result);
})

/*-----------------------------------------
async + promise 복합사용
-----------------------------------------*/
function delayQ(sec){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(new Date().toISOString());
        }, sec*1000)
    })
}
async function myAsync2(){
    delayQ(3).then((result)=>{
        console.log(result)
    })
    return 'async';
}
console.log(myAsync2()); //예상결과: 약속1개+3초후 timestring
myAsync2().then((result)=>{
    console.log(result); //예상결과: 문자열+3초후 timestring
})