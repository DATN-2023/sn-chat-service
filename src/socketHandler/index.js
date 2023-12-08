module.exports = container => {
  const channelHandler = require('./channelHandler')(container)

  return {
    channelHandler
  }
}
