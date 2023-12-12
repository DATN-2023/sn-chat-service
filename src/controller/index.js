module.exports = (container) => {
  const messageController = require('./messageController')(container)
  const channelController = require('./channelController')(container)
  const cdcController = require('./cdcController')(container)
  const sdpController = require('./sdpController')(container)
  return { messageController, channelController, cdcController, sdpController }
}
