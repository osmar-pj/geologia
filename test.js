const data = [
    { id: 1, "observaci�n": 'John Doe', age: 25 },
    { id: 2, "observaci�n": 'Carlos Huy', age: 43 },
    { id: 3, "observaci�n": 'Miguel Fea', age: 23 },
    { id: 4, "observaci�n": 'Luis Veo', age: 33 },
    { id: 5, "observaci�n": 'Juan Cei', age: 53 }
]

// change key name from "observaci�n" to "observacion" and age to "edad" and id to "identificador"
const newData = data.map(({ id, "observaci�n": observacion, age }) => ({ identificador: id, observacion, edad: age }))