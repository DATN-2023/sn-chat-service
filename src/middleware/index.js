module.exports = (container) => {
  const {
    serverHelper,
    httpCode
  } = container.resolve('config')
  const logger = container.resolve('logger')

  const verifyCMSToken = async (req, res, next) => {
    try {
      const token = req.headers['x-access-token'] || req.body.token
      if (token) {
        const user = await serverHelper.verifyCMSToken(token)
        const { path } = req
        const options = {
          headers: { 'x-access-token': token },
          uri: process.env.AUTHORIZATION_CMS_URL || 'http://127.0.0.1:8004/authorization',
          method: 'POST',
          json: {
            userId: user._id,
            path,
            method: req.method
          }
        }
        const {
          ok,
          msg,
          user: userAuthorization
        } = await request(options)
        if (ok) {
          if (userAuthorization.readonly && req.method !== 'GET') {
            return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn chỉ có quyền xem thông tin, không thể thực hiện được thao tác này.' })
          }
          req.user = userAuthorization
          return next()
        } else {
          return res.status(httpCode.BAD_REQUEST).json({ msg: msg || 'Bạn không có quyền thực hiện tác vụ này.' })
        }
      }
      return res.status(httpCode.UNAUTHORIZED).json({ msg: 'Bạn không có quyền thực hiện tác vụ này.' })
    } catch (e) {
      if (!e.message.includes('TokenExpiredError')) {
        logger.e(e)
      }
      res.status(httpCode.TOKEN_EXPIRED).json({})
    }
  }

  const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN || '123'
  const verifyInternalToken = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (token !== INTERNAL_TOKEN) {
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'Bạn không có quyền thực hiện tác vụ này!' })
    }
    return next()
  }
  const verifyToken = async (req, res, next) => {
    try {
      const token = req.headers['x-access-token'] || req.body.token || ''
      if (!token) {
        console.log('UNAUTHORIZED 66')
        return res.status(httpCode.UNAUTHORIZED).json({})
      }
      req.userToken = serverHelper.verifyToken(token)
      // todo: check xem user co bi block hay gi k con kick ra
      return next()
    } catch (e) {
      logger.e(e)
      return res.status(httpCode.UNAUTHORIZED).json({})
    }

  }

  const verifySocketToken = async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const data = socket.data
      console.log(data)
      if (!token) {
        console.log('UNAUTHORIZED 66')
        next(new Error("invalid"));
      }
      socket.data.userToken = await serverHelper.verifyToken(token)
      next()
    } catch (e) {
      logger.e(e)
      next(new Error("invalid"));
    }
  }

  return { verifyInternalToken, verifyCMSToken, verifyToken, verifySocketToken }
}
