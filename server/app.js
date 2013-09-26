'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');
var Twit = require('twit');
var socketIO = require('socket.io');

// var mongoose = require('mongoose');

// start mongoose
// mongoose.connect('mongodb://localhost/sit');
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {

// 	/* test schema */
//     var testSchema = new mongoose.Schema({
//         test: String
//     });

//     var Test = mongoose.model( 'test', testSchema );

    /* set Baucis */
    // baucis.rest({
    //     singular: 'test'
    // });

	var app = express();

	app.configure(function(){
	    app.set('port', 9000);
	    app.set('view engine', 'handlebars');
	    app.set('views', __dirname + '../app/scripts/views');
	});

    // app.use('/api/v1', baucis());

	// simple log
	app.use(function(req, res, next){
	  console.log('%s %s', req.method, req.url);
	  next();
	});

	// mount static
	app.use(express.static( path.join( __dirname, '../app') ));
	app.use(express.static( path.join( __dirname, '../.tmp') ));


	// start server
	var server = http.createServer(app);
	var io = socketIO.listen(server.listen(app.get('port')))

	var watchList = ['love', 'hate'];

	var T = new Twit({
    	consumer_key: 'j5KEvlHO0rnDdTh3POuQ'
    	, consumer_secret: 'QYU8fNrUbv3hPyuUkZv0rPrQD6NcjpThj7TZLVkouQ'
    	, access_token: '211254337-TCQSG7TTMCTqPwz8HmGkOMg8KEMUkZ81nHQpPzDI'
    	, access_token_secret: 'ex62KzF6OKHpMy5sjCBBfMtPuk2QkfZdaIHStVeg'
	});

 	app.get('/', function(req, res){
	  res.sendfile( path.join( __dirname, '../app/index.html' ) );
	});

	app.get('/tweets/:hashtag/:num', function(req, res){
	  	T.get('search/tweets', { q: '%23'+req.param('hashtag'), count: req.param('num')  }, function(err, reply) {
  			return res.send(reply)
		})
	});
	
	// T.stream('statuses/filter', { track: watchList },function (stream) {
 //    	stream.on('tweet', function (tweet) {
 //        	io.sockets.emit('tweet', tweet.text);
 //        	console.log(tweet.text);
 //    	});
	// });

var stream = T.stream('statuses/filter', { track: '#sacramento', language: 'en' })

stream.on('tweet', function (tweet) {
  io.sockets.emit('tweet', tweet.text);
})
 
	io.sockets.on('connection', function (socket) {
    	console.log('Connected');
	}); 
// });


