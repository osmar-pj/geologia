const data = {
    arr: [1,1,1,2,2,2,2,3,3,3]
}

const unique = (arr) => {
    return arr.filter((v, i, a) => a.indexOf(v) === i)
}

const result = unique(data.arr)
console.log(data.arr.filter((v, i, a) => a.indexOf(v) === i))