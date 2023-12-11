module.exports = container => {
  const { messageHandler } = container.resolve('socketHandler')

  return (socket) => {
    socket.on('message:create', messageHandler.addMessage)
    // socket.on('message:getMessages', messageHandler.getMessage)
  }
}
