module.exports = (container) => {
  const messageController = require('./messageController')(container)
  const channelController = require('./channelController')(container)
  const cdcController = require('./cdcController')(container)
  return { messageController, channelController, cdcController }
}
