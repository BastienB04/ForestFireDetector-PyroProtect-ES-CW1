const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8080;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Id = {val: 0};
async function incrId(Id){
    while(1){
        await sleep(1000);
        Id.val += 1;
        console.log(Id);
    }
}

// incrId(Id)

const cachedData = [
    {
        deviceId: 1,
        x_pos: 0,
        y_pos: 0,
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    },
    {
        deviceId: 2,
        x_pos: 10,
        y_pos: 10,
        status:{
            gas: null,
            temperature: null,
            windSpeed: null
        }
    }
]

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
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({
                    rowSize: 3,
                    columnSize: 3
                }));
                res.end()
            }
        }
    }
    //-------------------------------------------------------------------------------------------------------------------------------
    //                                              POST REQUETS
    //-------------------------------------------------------------------------------------------------------------------------------
    else if(req.method == 'POST'){
        ID.unique_id=0;
        res.statusCode = 200;
        res.end();
    }
});


server.listen(port, () => {
    console.log(`server listening on port ${port}...`)
    console.log('------------------------------------------------------------------------------------------')
});


