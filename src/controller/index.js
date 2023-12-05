module.exports = (container) => {
  const messageController = require('./messageController')(container)
  return { messageController }
}
