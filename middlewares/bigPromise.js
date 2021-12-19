// Try-catch and async -await OR use promises !!
module.exports = func => ( request, response, next ) =>
    Promise.resolve(func( request, response, next )).catch(next);