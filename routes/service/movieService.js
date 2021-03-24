var axios = require('axios');
var https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false,
});
var api1 = 'https://api.themoviedb.org/3/movie/now_playing?api_key=6cd2db309be6e583793681e5e9572245&language=en-US&page=1';
var api2 = 'https://api.themoviedb.org/3/genre/movie/list?api_key=6cd2db309be6e583793681e5e9572245&language=en-US';


function wholeResponse(req, res) {
    let id = req.headers.id;
    axios.get(api1, {
            httpsAgent: agent
        })
        .then((response) => {
            res.json(response.data.results)
        })
        .catch((error) => {
            console.error(error)
        })

}

function popularity(req, res) {
    let popularity = req.headers.popularity;
    axios.get(api1, {
            httpsAgent: agent
        })
        .then((response) => {
            res.json(response.data.results.filter(item => (item.popularity > popularity)))
        })
        .catch((error) => {
            console.error(error)
        })
};

function date(req, res) {
    let startdate = req.headers.datenum;
    let datenum = new Date(startdate);
    let id = req.headers.id;
    axios.get(api1, {
            httpsAgent: agent
        })
        .then((response) => {
            res.json(response.data.results.filter(item => new Date(item.release_date) >= datenum))
        })
        .catch((error) => {
            console.error(error)
        })
}

function genres(req, res) {
    let id = req.headers.id;
    var name = req.headers.gen;
    var names = name.split(",");
    var arr = [];
    var display = [];
    var reqOne = axios.get(api1, {
        httpsAgent: agent
    })
    var reqTwo = axios.get(api2, {
        httpsAgent: agent
    })
    axios.all([reqOne, reqTwo])
        //splitting the responses
        .then(axios.spread((...responses) => {
            const resOne = responses[0]
            const resTwo = responses[1]
            //res.json(resOne.data);
            var gen = resTwo.data.genres;
            //fetching the required genre ids 
            for (var i = 0; i < names.length; i++) {
                for (var j = 0; j < gen.length; j++) {
                    if (names[i] === gen[j].name) {
                        arr.push(gen[j].id);
                        break;
                    }
                }
            }
            console.log(arr);
            //filtering genre ids from whole movie list by filter method
            resOne.data.results.filter(item => {
                for (var i = 0; i < item.genre_ids.length; i++) {
                    if (arr.indexOf(item.genre_ids[i]) != -1) {
                        display.push(item);
                        break;
                    }
                }
            })
            res.json(display);
        }))
        .catch((error) => {
            console.error(error)
        })

}

function filter(req, res) {
    let id = req.headers.id;
    let pop = req.headers.popularity;
    let dt = req.headers.datenum;
    let gene;
    let date = new Date(dt);
    let genres = req.headers.gen;
    if(genres !== undefined){
        gene = genres.split(",");
    }
    let reqOne = axios.get(api1, {
        httpsAgent: agent
    })
    let reqTwo = axios.get(api2, {
        httpsAgent: agent
    })
    axios.all([reqOne, reqTwo])
        .then(axios.spread((...responses) => {
            //splitting responses
            const resOne = responses[0]
            const resTwo = responses[1]
            //no input condition
            if (pop === undefined  && dt === undefined && genres === undefined) {
                res.json(resOne.data.results)
            } else {
                //genres existed condition
                if (genres !== undefined) {
                    var arr = [];
                    var display = [];
                    var gen = resTwo.data.genres;
                    //filtering of genre ids
                    for (var i = 0; i < gene.length; i++) {
                        for (var j = 0; j < gen.length; j++) {
                            if (gene[i] === gen[j].name) {
                                arr.push(gen[j].id);
                                break;
                            }
                        }
                    }
                    console.log(arr);
                    //filtering of movie data
                    resOne.data.results.filter(item => {
                        for (var i = 0; i < item.genre_ids.length; i++) {
                            if (arr.indexOf(item.genre_ids[i]) != -1) {
                                display.push(item);
                                break;
                            }
                        }
                    })
                    if (pop !== undefined && dt !== undefined) {
                        res.json(display.filter(item => (item.popularity > pop) && (new Date(item.release_date) >= date)))
                     } else if (pop !== undefined) {
                        res.json(display.filter(item => (item.popularity > pop)))
                    } else if (dt !== undefined) {
                        res.json(display.filter(item => (new Date(item.release_date) >= date)))
                    }else {
                        res.json(display)
                    }

                } else {
                    //no genres condition
                    if (pop != undefined && dt !== undefined) {
                        res.json(resOne.data.results.filter(item => (item.popularity > pop) && (new Date(item.release_date) >= date)))
                    } else if (pop != undefined) {
                        res.json(resOne.data.results.filter(item => (item.popularity > pop)))
                    } else if (dt !== undefined) {
                        res.json(resOne.data.results.filter(item => (new Date(item.release_date) >= date)))
                    }

                }
            }

        })).catch((error) => {
            console.error(error)
        })


}


module.exports = {
    popularity,
    date,
    genres,
    wholeResponse,
    filter

};