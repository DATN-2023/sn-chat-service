module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { sdpController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/sdp/messages`, sdpController.getMessage)
  app.get(`${basePath}/sdp/messages/:id`, sdpController.getMessageById)
}
