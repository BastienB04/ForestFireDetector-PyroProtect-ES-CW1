const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8080;
const { StationBuilder } = require('./imports/StationBuilder');


//-------------------------------------------------------------------------------------------------------------------------------
//                                                  VARIABLES
//-------------------------------------------------------------------------------------------------------------------------------

const GRIDSIZE = 10;

const cachedData = {
    "device1": {
        deviceId: 1,
        x_pos: 2,
        y_pos: 1,
        color: 'red',
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    },
    "device2": {
        deviceId: 2,
        x_pos: 7,
        y_pos: 8,
        color: 'red',
        color: 'red',
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    },
    "device3":{
        deviceId: 3,
        x_pos: 3,
        y_pos: 7,
        color: 'red',
        status: {}
    }
}


const stationBuilder = new StationBuilder('FWI');

//-------------------------------------------------------------------------------------------------------------------------------
//                                                  VARIABLE INIT
//-------------------------------------------------------------------------------------------------------------------------------

const initGrid = []
for(let i=0; i<GRIDSIZE; i++){
    const tmp = [];
    for(let j=0; j<GRIDSIZE; j++){
        tmp.push({
            deviceId: null,
            x: i,
            y: j,
            visibility: 'hidden',
            color: 'white'
        });
    }
    initGrid.push(tmp);
}

const initData = {
    gridSize: GRIDSIZE,
    grid: initGrid
}


//-------------------------------------------------------------------------------------------------------------------------------
//                                                  SERVER DEFINITION
//-------------------------------------------------------------------------------------------------------------------------------
const server = http.createServer((req, res) => {
    const endpoint = req.url.split('?')[0];
    console.log(`${req.socket.remoteAddress.substring(7)}---"${req.method} ${endpoint}"`);
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //                                              GET REQUETS
    //-------------------------------------------------------------------------------------------------------------------------------
    
    if(req.method == 'GET'){
        var fileUrl;
        if(req.url == '/'){
            fileUrl = '/index.html'
        }
        else if(req.url.startsWith('/sensor')){
            const deviceId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('deviceId');
            fileUrl = '/sensor/sensor.html'
        }
        else{
            fileUrl = req.url;
        }
        
        var filePath = path.resolve('.' + fileUrl);
        const fileExt = path.extname(filePath);
        if(fileExt == '.html'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if(fileExt == '.ico'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'image/x-icon');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.css') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/css');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.js'){
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/javascript');
                fs.createReadStream(filePath).pipe(res);
            });
            
        }
        else{
            if(req.url.startsWith('/api/cachedData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(cachedData));
                res.end();
            }
            else if(req.url.startsWith('/api/initData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(initData));
                res.end();
            }
            else if(req.url.startswith('/api/allData')){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write({'status': 'succ'});
                res.end();
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({
                    rowSize: 10,
                    columnSize: 10
                }));
                res.end()
            }
        }
    }
    //-------------------------------------------------------------------------------------------------------------------------------
    //                                              POST REQUETS
    //-------------------------------------------------------------------------------------------------------------------------------
    else if(req.method == 'POST'){
        if(req.url.startsWith('/api/change-color-to-red')){
            Object.values(cachedData).forEach((device) => {
                device.color = 'red';
            });
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/change-color-to-green')){
            Object.values(cachedData).forEach((device) => {
                device.color = 'green';
            });
            res.statusCode = 200;
            res.end();
        }
        else if(req.url.startsWith('/api/recdata')){
            var recieved = '';
            req.on('data', function(data)
            {
                recieved += data
            });
            req.on('end', function(){
                var data = JSON.parse(recieved);
                cachedData[data['id']].status.gas = data['Co2'];
                cachedData[data['id']].status.temperature = data['temp'];
                cachedData[data['id']].status.humidity = data['humidity'];
                cachedData[data['id']].status.tVOC = data['tVOC'];
                cachedData[data['id']].status.rain = data['rain'];
                cachedData[data['id']].status.windSpeed = data['wind'];
            })
	    res.statusCode = 200;
	    res.end();
            
            
        }
    }
});


server.listen(port, () => {
    console.log(`server listening on port ${port}...`)
    console.log('------------------------------------------------------------------------------------------')
});



// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const Id = {val: 0};
// async function incrId(Id){
//     while(1){
//         await sleep(1000);
//         Id.val += 1;
//         console.log(Id);
//     }
// }
// incrId(Id)
