module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Channel } = schemas
  const addChannel = (cate) => {
    const c = new Channel(cate)
    return c.save()
  }
  const getChannelById = (id) => {
    return Channel.findById(id)
  }
  const deleteChannel = (id) => {
    return Channel.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateChannel = (id, n) => {
    return Channel.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Channel.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Channel.countDocuments(pipe)
  }
  const getChannelAgg = (pipe) => {
    return Channel.aggregate(pipe)
  }
  const getChannel = (pipe, limit, skip, sort) => {
    return Channel.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getChannelNoPaging = (pipe) => {
    return Channel.find(pipe)
  }
  const removeChannel = (pipe) => {
    return Channel.deleteMany(pipe)
  }
  return {
    getChannelNoPaging,
    removeChannel,
    addChannel,
    getChannelAgg,
    getChannelById,
    deleteChannel,
    updateChannel,
    checkIdExist,
    getCount,
    getChannel
  }
}
