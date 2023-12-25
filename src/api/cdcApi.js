module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { cdcController } = container.resolve('controller')
  const { verifyInternalToken } = container.resolve('middleware')
  const { basePath } = serverSettings
  app.put(`${basePath}/cdc/channels/:id`, verifyInternalToken, cdcController.updateChannel)
  app.delete(`${basePath}/cdc/channels/:id`, verifyInternalToken, cdcController.deleteChannel)
  app.post(`${basePath}/cdc/channels`, verifyInternalToken, cdcController.addChannel)
}
