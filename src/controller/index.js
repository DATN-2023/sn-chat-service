module.exports = (container) => {
  const messageController = require('./messageController')(container)
  const channelController = require('./channelController')(container)
  return { messageController, channelController }
}
