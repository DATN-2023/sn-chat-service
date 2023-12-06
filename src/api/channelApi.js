module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { channelController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/channels`, channelController.getChannel)
  app.get(`${basePath}/channels/:id`, channelController.getChannelById)
  app.put(`${basePath}/channels/:id`, channelController.updateChannel)
  app.delete(`${basePath}/channels/:id`, channelController.deleteChannel)
  app.post(`${basePath}/channels`, channelController.addChannel)
}
