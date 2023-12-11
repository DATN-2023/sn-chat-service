module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Message } = schemas
  const addMessage = (cate) => {
    const c = new Message(cate)
    return c.save()
  }
  const getMessageById = (id) => {
    return Message.findById(id)
  }
  const deleteMessage = (id) => {
    return Message.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateMessage = (id, n) => {
    return Message.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Message.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Message.countDocuments(pipe)
  }
  const getMessageAgg = (pipe) => {
    return Message.aggregate(pipe)
  }
  const getMessage = (pipe, limit, skip, sort) => {
    return Message.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getMessageNoPaging = (pipe) => {
    return Message.find(pipe)
  }
  const removeMessage = (pipe) => {
    return Message.deleteMany(pipe)
  }
  const findOne = (pipe) => {
    return Message.findOne(pipe)
  }
  return {
    getMessageNoPaging,
    removeMessage,
    addMessage,
    getMessageAgg,
    getMessageById,
    deleteMessage,
    updateMessage,
    checkIdExist,
    getCount,
    getMessage,
    findOne
  }
}
