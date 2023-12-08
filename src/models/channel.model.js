module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const channelTypeConfig = {
    USER: 1,
    GROUP: 2
  }
  const channelJoi = joi.object({
    name: joi.string().default('').allow(''),
    member: joi.array().items(joi.string()).min(1),
    type: joi.number().valid(...Object.values(channelTypeConfig)).default(channelTypeConfig.USER)
  })
  const channelSchema = joi2MongoSchema(channelJoi, {}, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  channelSchema.statics.validateObj = (obj, config = {}) => {
    return channelJoi.validate(obj, config)
  }
  channelSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return channelJoi.validate(obj, config)
  }
  const channelModel = mongoose.model('Channel', channelSchema)
  channelModel.syncIndexes()
  return channelModel
}
