require('dotenv').config()
const fetch = require('node-fetch')
const express = require('express')

const port = 1337
const nbTasks = parseInt(process.env.TASKS) || 4  

const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min
const taskType = () => (randInt(0, 2) ? 'mult' : 'add')

const args = () => ({ a: randInt(0, 40), b: randInt(0, 40) })

const generateTasks = (i) =>
  new Array(i).fill(1).map(() => ({ type: taskType(), args: args() }))

let workers = {
  add: [],
  mult: []
};

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send(JSON.stringify(workers))
})

app.post('/register', (req, res) => {
  console.log(`Register `)
  const { url, id } = req.body

  if (url.includes('worker-add')) {
    workers.add.push({ url, id });
    console.log(`Register worker-add : adding ${url} worker: ${id}`)
  } else if (url.includes('worker-mult')) {
    workers.mult.push({ url, id });
    console.log(`Register worker-mult : adding ${url} worker: ${id}`)
  }
  res.send('ok')
})

let tasks = generateTasks(nbTasks)
let taskToDo = nbTasks

const wait = (mili) => new Promise((resolve) => setTimeout(resolve, mili))

const sendTask = async (worker, task) => {
  console.log(`=> ${worker.url}/${task.type}`, task)
  workers[task.type] = workers[task.type].filter((w) => w.id !== worker.id)
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
    workers[task.type].push(worker)
    taskToDo -= 1
    console.log('---')
    console.log(nbTasks - taskToDo, '/', nbTasks, ':')
    console.log(task, 'has res', result)
    console.log('---')
    return result
  } catch (err) {
    console.error(task, 'failed', err.message)
    tasks.push(task)
    workers[task.type].push(worker)
  }
}

const main = async () => {
  console.log(tasks)
  while (taskToDo > 0) {
    await wait(100)
    if (tasks.length === 0) continue

    for (const task of tasks) {
      if (workers[task.type].length === 0) continue
      await sendTask(workers[task.type][0], task)
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