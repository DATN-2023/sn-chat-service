module.exports = container => {
  const logger = container.resolve('logger')
  const { urlConfig: { userUrl }, httpCode } = container.resolve('config')
  const axios = require('axios')
  const accessToken = process.env.INTERNAL_TOKEN || '123'

  const getUser = async (q) => {
    try {
      const options = {
        headers: { 'x-access-token': accessToken },
        url: `${userUrl}/internal/users`,
        json: true,
        params: q,
        method: 'GET'
      }
      const { data } = await axios(options)
      return { statusCode: httpCode.SUCCESS, data }
    } catch (e) {
      logger.e(e)
      return { statusCode: httpCode.BAD_REQUEST, msg: '' }
    }
  }

  return {
    getUser
  }
}
