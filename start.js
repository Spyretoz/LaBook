const express     = require('express');
const app         = express();
const path        = require('path');
const bodyparser  = require('body-parser');
const mysql       = require('mysql');


app.use(bodyparser.json());


app.get('/', function (req, res) 
{
    res.sendFile(path.resolve("frontend.html"));
});

app.get('/LaBook', function (req, res) 
{
    res.sendFile(path.resolve("LaBook.css"));
});

var server = app.listen(8081, function()
{
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Example app listening at http://${host}:${port}`);
});


const mysqlConnection = mysql.createConnection({
    host:"sql_server_address",
    user:"sql_server_username",
    password:"sql_server_password",
    database:"sql_server_database"
});



// Get a book
app.get('/books/:title', function (req, res)
{
    mysqlConnection.connect();

    mysqlConnection.query("SELECT * FROM books WHERE title like '%"+req.params.title+"%'", (err, rows, fields) => 
    {
        if (!err)
        {
            res.send(rows);
        }
        else 
        {
            console.log(err);
        }
    });
    mysqlConnection.end();
});


// Insert a book
app.post('/books/', function (req, res)
{
    mysqlConnection.connect();
    
    var sql = "INSERT INTO books VALUES(null, '" + req.body.author + "', '" + req.body.title + "','" + req.body.genre + "'," + req.body.price + ")";
    mysqlConnection.query(sql, (err) => 
    {       
        var resultJson;
        if(!err)        
        {
            resultJson = JSON.stringify([{'ADD':'SUCCESS'}]);
            console.log(req.body);
        }
        else
        {
            resultJson = JSON.stringify([{'ADD':'FAIL'}]); 
            console.log("ERROR");
        }
        res.end(resultJson);
    });
    mysqlConnection.end();
});