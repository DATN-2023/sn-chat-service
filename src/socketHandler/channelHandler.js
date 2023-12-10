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

  async function getChannel (payload) {
    try {
      // const socket = this
      const user = this.data.userToken
      let {
        page,
        perPage,
        sort,
        ids
      } = payload
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { _id: 1 } : +sort || { _id: -1 }
      const skip = (page - 1) * perPage
      const search = { ...payload }
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
        const pathType = (Channel.schema.path(i) || {}).instance || ''
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
      const data = await channelRepo.getChannel(pipe, perPage, skip, sort).lean()
      const total = await channelRepo.getCount(pipe)
      io.emit('client:channel:getChannels', {
        perPage,
        skip,
        sort,
        data,
        total,
        page
      })
      // return {
      //   data
      // }
      // res.status(httpCode.SUCCESS).send({
      //   perPage,
      //   skip,
      //   sort,
      //   data,
      //   total,
      //   page
      // })
    } catch (e) {
      logger.e(e)
      // res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
      io.emit('client:channel:getChannels', { ok: false })
    }
  }

  return {
    addChannel,
    getChannel
  }
}
