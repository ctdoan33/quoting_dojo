var express=require("express");
var app=express();
var path=require("path");
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./static")));
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var moment = require("moment");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/quoting_dojo");

var QuoteSchema=new mongoose.Schema({
	name: {type: String, required: true},
	quote: {type: String, required: true}
}, {timestamps: true});

mongoose.model("Quote", QuoteSchema);

var Quote=mongoose.model("Quote");

app.get("/", function(req, res){
	res.render("index", {errors: {}});
});

app.post("/", function(req, res){
	var quote=new Quote({name: req.body.name, quote: req.body.quote});
	quote.save(function(err){
		if(err){
			res.render("index", {errors: quote.errors})
		}else{
			res.redirect("/quotes");
		}
	})
});

app.get("/quotes", function(req, res){
	Quote.find({}, function(err, quotes){
		if(err){
			res.render("quotes", {quotes: []})
		}else{
			res.render("quotes", {quotes: quotes, moment: moment});
		}
	})
})

app.listen(6789, function() {
    console.log("listening on port 6789");
})