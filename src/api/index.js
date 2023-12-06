module.exports = (app, container) => {
  require('./messageApi')(app, container)
  require('./channelApi')(app, container)
}
