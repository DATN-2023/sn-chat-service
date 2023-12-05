module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { messageController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/messages`, messageController.getMessage)
  app.get(`${basePath}/messages/:id`, messageController.getMessageById)
  app.put(`${basePath}/messages/:id`, messageController.updateMessage)
  app.delete(`${basePath}/messages/:id`, messageController.deleteMessage)
  app.post(`${basePath}/messages`, messageController.addMessage)
}
