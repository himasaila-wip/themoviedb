const circuitBreaker = require("./cb");
const cbr = circuitBreaker();
cbr.apiCheck();
// const wait = time => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             return resolve();
//         }, time);
//     });
// };

// (async () => {
//     while (true) {
//         await cbr.apiCheck();
//         await wait(10000);
//     }
    
// })();