module.exports = (io, container) => {
  const channelSocket = require('./channelSocket')(container)
  const {verifySocketToken} = container.resolve('middleware')
  io.use(verifySocketToken)
  const onConnection = (socket) => {
    channelSocket(socket)
  }

  return { onConnection }
}
