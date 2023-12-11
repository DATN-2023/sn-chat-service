module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { channelController } = container.resolve('controller')
  const { verifyInternalToken } = container.resolve('middleware')
  const { basePath } = serverSettings
  app.put(`${basePath}/cdc/channels/:id`, verifyInternalToken, channelController.updateChannel)
  app.delete(`${basePath}/cdc/channels/:id`, verifyInternalToken, channelController.deleteChannel)
  app.post(`${basePath}/cdc/channels`, verifyInternalToken, channelController.addChannel)
}
