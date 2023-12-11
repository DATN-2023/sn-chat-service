module.exports = container => {
  const userHelper = require('./userHelper')(container)
  return {
    userHelper
  }
}
