module.exports = container => {
  const logger = container.resolve('logger')
  const io = container.resolve('io')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Channel
    }
  } = container.resolve('models')
  const { channelTypeConfig } = Channel.getConfig()
  const { httpCode, serverHelper } = container.resolve('config')
  const { userHelper } = container.resolve('helper')
  const { messageRepo, channelRepo } = container.resolve('repo')

  async function addMessage (payload) {
    const user = this.data.userToken
    try {
      payload.messageFrom = user._id
      const {
        error,
        value
      } = await schemaValidator(payload, 'Message')
      if (error) {
        return io.emit(`client:listener-${user._id || ''}`, { ok: false })
      }
      const sp = await messageRepo.addMessage(value)
      const channel = await channelRepo.findOne({ _id: sp.channel.toString() })
      for (const member of channel.members) {
        io.emit(`client:listener-${member || ''}`, value)
      }
    } catch (e) {
      logger.e(e)
      return io.emit(`client:listener-${user._id || ''}`, { ok: false })
    }
  }

  return {
    addMessage
  }
}
