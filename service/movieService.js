var axios = require('axios');
var https = require('https');
var apis = require('../constants/constants')
const agent = new https.Agent({
    rejectUnauthorized: false,
});
var api1 = apis.links.movies;
var api2 = apis.links.genres;


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
    let id = req.headers.id;
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
    let date = new Date(dt);
    let genres = req.headers.gen;
    let gene;
    let arr1=[];
    let arr2 = [];
    let arr3 = [];
    if(genres === undefined || genres === ""){
        gene = genres;
    }
    else{
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
                if (genres === undefined || genres==="") {
                    arr1=resOne.data.results;
                }
                else{
                    let arr=[];
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
                                arr1.push(item);
                                break;
                            }
                        }
                    }) 
                }
                if(pop == "" || pop == undefined)
                    arr2 = arr1;
                else
                    arr2 = arr1.filter(result => (result.popularity >= pop))
                if(dt == "" || dt == undefined)
                    arr3 = arr2;
                else
                    arr3 = arr2.filter(result => (new Date(result.release_date) >= date)) 
                res.send(arr3)

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