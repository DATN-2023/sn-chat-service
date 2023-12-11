module.exports = container => {
  const channelHandler = require('./channelHandler')(container)
  const messageHandler = require('./messageHandler')(container)

  return {
    channelHandler,
    messageHandler
  }
}
