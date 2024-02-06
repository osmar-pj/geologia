const data = [
    { id: 1, h: [1,1,2,3] },
    { id: 2, h: [4,5,6,6] },
    { id: 3, h: [7,8,9,9] }
]

// merge the arrays of objects
const merged = [].concat(...data.map(({ h }) => h))
console.log(merged)
const unique = [...new Set(merged)]
console.log(unique)