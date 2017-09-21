var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.text({type: '*/*', limit: Infinity}));
var cache = {};

app.put('/:key', function(req, res) {

    var key = req.params.key;

    var data = req.body;

    cache[key] = data;

    return res.send("bashcache.com/"+key+'\n');

});

app.get('/:key', function(req, res) {
    
    var key = req.params.key;

    var data = cache[key]

    if (!data){
        return res.sendStatus(404);
    }

    res.set("Content-type", "text/html");

    return res.send(data.value+'\n');
    
});

app.get('/', function(req, res){
    return res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});