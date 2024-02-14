const workers = [
    {
        name: 'John',
        skills: ['JavaScript', 'React', 'Node'],
    },
    {
        name: 'Jane',
        skills: ['JavaScript', 'Nginx', 'Vue'],
    },
    {
        name: 'Tom',
        skills: ['JQuery', 'React', 'Node', 'Nginx', 'PHP'],
    }
]

const skillsTogether = workers.reduce((allSkills, worker) => {
    return [...allSkills, ...worker.skills]
}, [])

console.log(skillsTogether)