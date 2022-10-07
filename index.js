var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongodb = require("mongodb");

app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

var client = mongodb.MongoClient;
var url = "mongodb://localhost:27017";

app.get("/", (req, res) => {
    res.send("Hello mongodb");
});

app.post('/save', (req, res) => {
    var body = req.body;
    client.connect(url, (error, db) => {
        if (error) {
            res.end(JSON.stringify({ status: "failed" }));
        }
        var dbo = db.db("mydb");

        dbo.collection("users").insertMany(body, (err, result) => {
            if (err) {
                res.end(JSON.stringify({ status: "failed" }));
            }
            
            db.close();
            res.end(JSON.stringify({ status: "success", data:result }));
        });
    });
});


app.post('/update', (req, res) => {
    var body = req.body;
    client.connect(url, (error, db) => {
        if (error) {
            res.end(JSON.stringify({ status: "failed" }));
        }
        var dbo = db.db("mydb");
        dbo.collection("users").updateOne({_id:mongodb.ObjectId(body.id)},{$set:{name:body.name,email:body.email}},(err,result)=>{
            if (err) {
                res.end(JSON.stringify({status:"failed"}));
            }
            res.end(JSON.stringify({status:"success", data:result}));
        });
       
    });
});
app.delete('/delete', (req, res) => {
    var body = req.body;
    client.connect(url, (error, db) => {
        if (error) {
            res.end(JSON.stringify({ status: "failed" }));
        }
        var dbo = db.db("mydb");
        dbo.collection("users").deleteOne({_id:mongodb.ObjectId(body.id)},(err,result)=>{
            if (err) {
                res.end(JSON.stringify({status:"failed"}));
            }
            res.end(JSON.stringify({status:"success", data:result}));
        });
       
    });
});

app.get('/list', (req, res) => {
    var body = req.body;
    client.connect(url, (error, db) => {
        if (error) {
            res.end(JSON.stringify({ status: "failed" }));
        }
        var dbo = db.db("mydb");
        dbo.collection("users").find({}).toArray((err,result)=>{
            if (err) {
                res.end(JSON.stringify({status:"failed"}));
            }
            res.end(JSON.stringify({status:"success", data:result}));
        });
       
    });
});


app.listen(8081, () => {
    console.log("Server is running at http://localhost:8081");
});