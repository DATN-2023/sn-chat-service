module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const messageJoi = joi.object({
    messageFrom: joi.string().required(),
    content: joi.string().required(),
    channel: joi.string().required()
  })
  const messageSchema = joi2MongoSchema(messageJoi, {
    messageFrom: {
      type: ObjectId,
      index: true
    },
    messageTo: {
      type: ObjectId,
      index: true
    },
    channel: {
      type: ObjectId,
      ref: 'Channel'
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  messageSchema.statics.validateObj = (obj, config = {}) => {
    return messageJoi.validate(obj, config)
  }
  messageSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return messageJoi.validate(obj, config)
  }
  const messageModel = mongoose.model('Message', messageSchema)
  messageModel.syncIndexes()
  return messageModel
}
