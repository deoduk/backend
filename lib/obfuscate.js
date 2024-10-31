/**
 * 아래의 난독화 함수는 서버Side 에서만 실행되어야합니다.
 * 소스코드가 노출될 수 있는 클라이언트 Side = 리엑트 + 일렉트론 + JavaScript
 *   에서 존재해서는 안됩니다.
 * 서버로 API 호출을 통해 실행하게끔 해야합니다.
 */
/*
const sourceKey = "00 00000001111111111122222222233333333334444444444555555555566666666667777777777888888888899999"
const sourceKey = "12 34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234"
*/
const sourceKey = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
const targetKey = "!\"=$%&'()*+,-./W6dUcGtJ0b:;<|>?@qa14wzBDEpF5HK8sLORh7Xg9iy[\]^_`uQ2eYTo3MrnCfZjSNklmVPvIxA{#}~"

const test11111 = () => {
	let aaa = "eyJ0b2tlbiI6IjIwMjEtMDgtMjcgMDk6MDk6MjkiLCJDb3JwQ29kZSI6IlQwMzU3OCIsIk9yZ0NvZGUiOiI0MyIsIlVzZXJJRCI6InBhbnVrZXIiLCJEb2NObyI6IjgyMjEiLCJ0aW1lc3RhbXAiOiIyMDIxLTA4LTI3IDA5OjA5OjI5In0="
	let bbb = Obfuscate(aaa)
	let ccc = UnObfuscate(bbb)
	console.log("[ Original ] " + aaa)
	console.log("[ Obfuscate ] "  + bbb)
	console.log("[ UnObfuscate ] " + ccc)
}

String.prototype.left = function(length){
	if(this.length <= length){
		 return this;
	}else{
		 return this.substring(0, length);
	}
}

String.prototype.right = function(length){
	if(this.length <= length){
		 return this;
	}else{
		 return this.substring(this.length - length, this.length);
	}
}

const Obfuscate = (arg1) => {
	arg1 = arg1 + ("0000" + arg1.length.toString()).right(4) // 문자열길이4자리
	let today = new Date();   
	arg1 = ("00" + today.getSeconds().toString()).right(2) 
				+ arg1 
				+ ("00" + today.getMinutes().toString()).right(2) // 앞2글자(초),뒤2글자(분)'
	let ret="", one="", j=0 
	for (i=0; i < arg1.length; i++) {
		one = arg1.substring(i,i+1)
		// sPos = one.codePointAt(0) - 32 - 1
		j = sourceKey.indexOf(one)
		ret = ret + targetKey.substring(j,j+1)
	}
	return ret
}

const UnObfuscate = (arg1) => {
	if (arg1.length > 4) arg1 = arg1.substring(2,arg1.length-2) // 앞2+뒤2 제거
	let ret="", one="", j=0
	for (i=0; i < arg1.length; i++){
		one = arg1.substring(i,i+1)
		j = targetKey.indexOf(one)
		if (j > 0) ret = ret + sourceKey.substring(j,j+1)
	}
	iLen = Number(ret.right(4))
	if (isNaN(iLen)) return
	if (ret.length-4 !== iLen) return
	return ret.left(ret.length-4)
}

module.exports = {
	Obfuscate,
	UnObfuscate
}

/*
function Obfuscate(arg1)
	arg1 = arg1 & right("0000" & len(arg1),4) '문자열길이4자리
	arg1 = right("00"&Second(now()),2) & arg1 & right("00"&Minute(now()),2) '앞2글자(초),뒤2글자(분)'
	ret=""
	for i=1 to len(arg1)
		one = mid(arg1,i,1)
		ret = ret & mid(targetKey,asc(one)-32,1)
	next
	Obfuscate = ret
end function

function UnObfuscate(arg1)
	ret = ""
	if len(arg1)>4 then arg1 = mid(arg1,3,len(arg1)-4) '앞2+뒤2 제거
	for i=1 to len(arg1)
		one = mid(arg1,i,1)
		j = instr(targetKey,one)
		if j > 0 then ret = ret & mid(sourceKey,j,1)
	next
	iLen = right(ret,4)
	if isNumeric(iLen)=false then exit function
	if len(ret)-4 <> cint(iLen) then exit function
	UnObfuscate = left(ret,len(ret)-4)
end function
*/