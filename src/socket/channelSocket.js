module.exports = container => {
  const { channelHandler } = container.resolve('socketHandler')

  return (socket) => {
    socket.on('channel:create', channelHandler.addChannel)
    socket.on('channel:getChannels', channelHandler.getChannel)
  }
}
