const data = {
    arr: [1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5]
}

const modaData = (data) => {
    const dataCount = {}
    let max = 0
    let moda = 0
    data.forEach((i) => {
        if (dataCount[i]) {
            dataCount[i]++
        } else {
            dataCount[i] = 1
        }
    })
    for (const i in dataCount) {
        if (dataCount[i] > max) {
            moda = i
            max = dataCount[i]
        }
    }
    return moda
}

console.log(modaData(data.arr)) // 2