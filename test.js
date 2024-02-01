const wagons = [
    {material: 'POLIMETALICO'},
    {material: 'POLIMETALICO'},
    {material: 'POLIMETALICO'},
    {material: 'ALABANDITA'},
    {material: 'ALABANDITA'},
    {material: 'Carbonato'},
]

// count automatically the number of type each material
const wagonsTransform = [
    {material: 'POLIMETALICO', count: 3},
    {material: 'ALABANDITA', count: 2}
]
// create a code to cnvert
const wagonsConverted = wagons.reduce((acc, wagon) => {
    const found = acc.find(w => w.material === wagon.material)
    if (found) {
        found.count++
    } else {
        acc.push({material: wagon.material, count: 1})
    }
    return acc
}, [])
console.log(wagonsConverted)

const fnTransform = (wagons) => {
    return wagons.reduce((acc, wagon) => {
        const found = acc.find(w => w.material === wagon.material)
        if (found) {
            found.count++
        } else {
            acc.push({material: wagon.material, count: 1})
        }
        return acc
    }, [])
}
console.log(fnTransform(wagons))