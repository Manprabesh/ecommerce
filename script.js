const nums = [1, 2, 3, 4];

const sum = nums.reduce((acc, curr) => {
    console.log("accumulator",acc)
    acc[curr] = 1
    return acc
}, {});

console.log(sum); // 10
