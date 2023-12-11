module.exports = (io, container) => {
  const channelSocket = require('./channelSocket')(container)
  const messageSocket = require('./messageSocket')(container)
  const { verifySocketToken } = container.resolve('middleware')
  io.use(verifySocketToken)
  const onConnection = (socket) => {
    channelSocket(socket)
    messageSocket(socket)
  }

  return { onConnection }
}
