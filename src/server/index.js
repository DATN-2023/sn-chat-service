const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const api = require('../api')
const { createServer } = require("http");
const { Server } = require("socket.io");
const socket = require('../socket')
const start = (container) => {
  return new Promise((resolve, reject) => {
    const { serverSettings } = container.resolve('config')
    const { port } = serverSettings
    const repo = container.resolve('repo')
    if (!repo) {
      reject(new Error('The server must be started with a connected repository'))
    }
    if (!port) {
      reject(new Error('The server must be started with an available port'))
    }
    const app = express()
    morgan.token('body', function (req) { return JSON.stringify(req.body) })
    app.use(morgan(':method :url :remote-addr :status :response-time ms - :res[content-length] :body - :req[content-length]'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(helmet())
    app.use(cors())
    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong!, err:' + err))
      res.status(500).send('Something went wrong!')
      return next()
    })
    api(app, container)
    const httpServer = createServer(app);
    const io = new Server(httpServer, {})
    const {onConnection} = socket(container)
    io.engine.use(helmet())
    io.engine.use(cors())
    io.on("connection", (socket) => onConnection(socket))
    container.registerValue('io', io)
    const server = httpServer.listen(port, () => resolve(server))
  })
}
module.exports = { start }
