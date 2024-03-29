module.exports = container => {
  const logger = container.resolve('logger')
  const io = container.resolve('io')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Channel,
      Message
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
  async function getMessage (payload) {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (ids) {
        if (ids.constructor === Array) {
          search.id = { $in: ids }
        } else if (ids.constructor === String) {
          search.id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      const pipe = {}
      Object.keys(search).forEach(i => {
        const vl = search[i]
        const pathType = (Message.schema.path(i) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[i] = new ObjectId(vl)
        } else if (pathType === 'Number') {
          pipe[i] = +vl
        } else if (pathType === 'String' && vl.constructor === String) {
          pipe[i] = new RegExp(vl, 'gi')
        } else {
          pipe[i] = vl
        }
      })
      const data = await messageRepo.getMessage(pipe, perPage, skip, sort)
      const total = await messageRepo.getCount(pipe)
      res.status(httpCode.SUCCESS).send({
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }

  return {
    addMessage,
    getMessage
  }
}
