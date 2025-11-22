// let arr= [1,2,3,4,5]

// const data = arr.reduce((acc,item)=>{
// console.log("----- acc",acc)
// console.log("-----.",acc+item)
// return  acc+item,5
// })
// console.log(data)

const products = [
  { id: 1, name: "Laptop", category_name: "Electronics" },
  { id: 2, name: "Shirt", category_name: "Clothing" },
  { id: 3, name: "Phone", category_name: "Electronics" },
  { id: 4, name: "Jeans", category_name: "Clothing" },
  { id: 5, name: "Book", category_name: "Stationery" },
  { id: 6, name: "Table", category_name: null },
];

const grouped = products.reduce((acc, item) => {
  const category = item.category_name || "Uncategorized";
  if (!acc[category]) acc[category] = [];
  acc[category].push(item);
  return acc;
}, {});

console.log(grouped)
const xx={};
products.map((data)=>{
    if( !xx[data.category_name]){
         xx[data.category_name]=[]
    }
    xx[data.category_name].push(data)
    console.log(data.category_name)
})
// 
console.log("ccc",xx)
console.log("object entries",Object.entries(xx))
Object.entries(xx).map(([key,value])=>{
// console.log(`key: ${key}, value ;${value}`)
value.map((data)=>{
    console.log("key",key,"data",data);
})
})

console.log(2%3)

if(-1){
  console.log('00000')
}

const ar = Array(7).fill(8)
console.log("ar", ar.length)
console.log("ar", ar)