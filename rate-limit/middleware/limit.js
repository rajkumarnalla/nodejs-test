require('connect-flash');
var ExpressBrute = require('express-brute'),
    MemcachedStore = require('express-brute-memcached'),
    moment = require('moment');

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production

var failCallback = (namespace) => function (req, res, next, nextValidRequestDate) {
    res.status(429)
        .json({
            msg: `Too many requests for the ${namespace} namespace. Please retry ${moment(nextValidRequestDate).fromNow()} `
        });
};

var handleStoreError = function (error) {
    log.error(error);

    throw {
        message: error.message,
        parent: error.parent
    };
}

function appBruteForce(namespace, freeRetries, minWait) {
    var expressBrute = new ExpressBrute(store, {
        freeRetries: freeRetries,
        attachResetToRequest: false,
        refreshTimeoutOnRequest: false,
        minWait: minWait*1*60*1000,
        maxWait: (minWait+1)*1*60*1000,
        lifetime: 24*60*60, // 1 day (seconds not milliseconds)
        handleStoreError: handleStoreError
    });

    return expressBrute.getMiddleware({key: namespace, failCallback: failCallback(namespace)});
}

module.exports = {
    appBruteForce
}