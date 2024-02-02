// const a = {key1:10,arr:[20]}
// const b = JSON.parse(JSON.stringify(a))
// b.arr[0]= 11
// console.log(a.arr[0]);

function f(){
    arguments[5]()
}

f(1,2,3,4,5,()=>{console.log("object")},1)