module.exports = (container) => {
  const channelSocket = require('./channelSocket')(container)
  const onConnection = (socket) => {
    channelSocket(socket)
  }

  return { onConnection }
}
