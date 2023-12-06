const repo = (container) => {
  const messageRepo = require('./messageRepo')(container)
  const channelRepo = require('./channelRepo')(container)
  return { messageRepo, channelRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
