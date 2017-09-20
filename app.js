var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.json())

var cache = {};

app.put('/:key/:value', function(req, res) {

    var key = req.params.key;
    var value = req.params.value;

    cache[key] = value;

    res.send(key+":"+value+'\n');

});

app.get('/:key', function(req, res) {
    
    var key = req.params.key;
    var value = cache[key]

    if (!value){
        return res.sendStatus(404);
    }

    res.send(value+'\n');
    
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});