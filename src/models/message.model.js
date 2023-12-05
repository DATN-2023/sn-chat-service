module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const messageJoi = joi.object({
    messageFrom: joi.string().required(),
    messageTo: joi.string().required(),
    content: joi.string().required()
  })
  const messageSchema = joi2MongoSchema(messageJoi, {
    ma: {
      unique: true,
      uppercase: true
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
