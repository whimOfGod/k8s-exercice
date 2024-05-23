require('dotenv').config()
const fetch = require('node-fetch')
const express = require('express')

const port = 1337
const nbTasks = parseInt(process.env.TASKS) || 100 

const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min
const taskType = () => (randInt(0, 2) ? 'mult' : 'add')

const args = () => ({ a: randInt(0, 40), b: randInt(0, 40) })

const generateTasks = (i) =>
  new Array(i).fill(1).map(() => ({ type: taskType(), args: args() }))

let workers = [];

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send(JSON.stringify(workers))
})

app.post('/register', (req, res) => {
  console.log(`Register `)
  const { url, id, specialization } = req.body

  workers.push({ url, id, specialization });
  console.log(`Register worker : adding ${url} worker: ${id} with specialization: ${specialization}`)
  
  res.send('ok')
})

let tasks = generateTasks(nbTasks)
let taskToDo = nbTasks

const wait = (mili) => new Promise((resolve) => setTimeout(resolve, mili))

const sendTask = async (worker, task) => {
  console.log(`=> ${worker.url}/${task.type}`, task)
  workers = workers.filter((w) => w.id !== worker.id)
  tasks = tasks.filter((t) => t !== task)
  try {
    const response = await fetch(`${worker.url}/${task.type}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task.args)
    })
    const result = await response.json()
    workers.push(worker)
    taskToDo -= 1
    console.log('---')
    console.log(nbTasks - taskToDo, '/', nbTasks, ':')
    console.log(task, 'has res', result)
    console.log('---')
    return result
  } catch (err) {
    console.error(task, 'failed', err.message)
    tasks.push(task)
    workers.push(worker)
  }
}

const main = async () => {
  console.log(tasks)
  while (taskToDo > 0) {
    await wait(100)
    if (tasks.length === 0) continue

    for (const task of tasks) {
      const availableWorkers = workers.filter(w => w.specialization === 'both' || w.specialization === task.type);
      if (availableWorkers.length === 0) continue
      await sendTask(availableWorkers[0], task)
    }
  }
  console.log('end of tasks')
  server.close()
}

const server = app.listen(port, () => {
  console.log(`Planner listening at http://localhost:${port}`)
  console.log('starting tasks...')
  main()
})