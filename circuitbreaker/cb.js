var axios = require('axios');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false,
});
// const cb = () => {
//   let lastFailedCall = 0; 
//   let failedCalls = 0;
//   return{
//       apiCheck: async () => {
//           const now = Date.now();

//           if (lastFailedCall && now - lastFailedCall <= 1000) {
//               console.log("Skipping call");
//               console.log("-------------------------");
//               return;
//           }

//           try {
//               const response = await axios.get('https://api.themovviedb.org/3/movie/now_playing?api_key=6cd2db309be6e583793681e5e9572245&language=en-US&page=1',
//               {
//                 httpsAgent: agent
//             });
//               const json = await response;

//               event.apiStatus(json.data.results[0].popularity)
//               //console.log(json.data);
//               failedCalls = 0;
//           } catch (e) {

//               lastFailedCall = Date.now();
//               failedCalls++;
//               event.apiFailed(e.message);
//               //console.log("error "+e.message);

//               if (failedCalls >= 3) {
//                   event.apiFailed("FIX THIS NOW!")
//                   //console.log("fix it now");
//               }

//           }

//       }
//     }
// }


const cb = () => {
    return{
        apiCheck: async () => {
  
            try {
                const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=6cd2db309be6e583793681e5e9572245&language=en-US&page=1',
                {
                  httpsAgent: agent
              });
                const json = await response;
                console.log(json.data);
            } catch (e) {
  
                console.log("error "+e.message);
            }
  
        }
      }
  }
    
  var breaker = require('express-circuit-breaker')
 
  var CB = breaker({
    catchError: e => 'trip',
    handleBlockedRequest: (req, res) => res.sendStatus(500)
   
  })

module.exports = CB;