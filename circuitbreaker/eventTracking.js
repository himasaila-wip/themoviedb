const CircuitBreaker = require('./cb')

const EventTracking = () => {
    return {
        apiStatus: status => {
            console.log(`api status ${status}`);
            console.log("------------------------------");
        },
        apiFailed: message => {
            console.log(`api failed ${message}`);
            console.log("------------------------------");
        }
    };
};

module.exports = EventTracking;