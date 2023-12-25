module.exports = (app, container) => {
  require('./cdcApi')(app, container)
  require('./messageApi')(app, container)
  require('./channelApi')(app, container)
  require('./sdpApi')(app, container)
}
