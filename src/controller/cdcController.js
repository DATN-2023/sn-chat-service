module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Channel
    }
  } = container.resolve('models')
  const { channelTypeConfig } = Channel.getConfig()
  const {
    httpCode,
    serverHelper
  } = container.resolve('config')
  const { channelRepo } = container.resolve('repo')
  const addChannel = async (req, res) => {
    try {
      const body = req.body
      const {
        error,
        value
      } = await schemaValidator(body, 'Channel')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.channel })
      }
      const {
        members,
        type
      } = value
      if (type === channelTypeConfig.USER) {
        const channel = await channelRepo.findOne({
          members,
          type
        })
        if (channel) return res.status(httpCode.SUCCESS).json(channel)
      }
      const sp = await channelRepo.addChannel(value)
      res.status(httpCode.CREATED).send(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteChannel = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await channelRepo.deleteChannel(id)
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateChannel = async (req, res) => {
    try {
      const { id } = req.params
      const channel = req.body
      const {
        error,
        value
      } = await schemaValidator(channel, 'Channel')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.channel })
      }
      if (id && channel) {
        const sp = await channelRepo.updateChannel(id, value)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    addChannel,
    updateChannel,
    deleteChannel
  }
}
