var breaker = require('express-circuit-breaker')
 
var CB = breaker({
  catchError: e => 'trip',
  handleBlockedRequest: (req, res) => res.sendStatus(500)
})
module.exports = CB;