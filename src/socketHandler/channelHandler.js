module.exports = container => {
  const logger = container.resolve('logger')
  const {
    schemaValidator,
    schemas: {
      Channel
    }
  } = container.resolve('models')
  const { httpCode } = container.resolve('config')
  const { channelRepo } = container.resolve('repo')

  const addChannel = async (req, res) => {
    try {
      const channel = req.body
      const {
        error,
        value
      } = await schemaValidator(channel, 'Channel')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.channel })
      }
      const sp = await channelRepo.addChannel(value)
      res.status(httpCode.CREATED).send(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }

  return { addChannel }
}
