'use strict';

var express = require('express'),
	http = require('http'),
	path = require('path'),
	async = require('async'),
	hbs = require('express-hbs'),
	Twit = require('twit'),
	socketIO = require('socket.io'),
	mongoose = require('mongoose'),
	watchList = ['#49ers','#rams'];

// start mongoose
// mongoose.connect('mongodb://localhost/sachash');
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
	
// 	var nbhoods = [ { name: 'Alhambra Triangle',	hashtag: '#AlhambraTriangle' }, { name: 'Alkali Flat',	hashtag: '#AlkaliFlat' }, { name: 'American River Parkway',	hashtag: '#AmericanRiverPkwy' }, { name: 'Boulevard Park',	hashtag: '#BlvdPark' }, { name: 'Cal Expo',	hashtag: '#CalExpo' }, { name: 'College/Glen',	hashtag: '#CollegeGlen' }, { name: 'College Town',	hashtag: '#CollegeTown' }, { name: 'CSUS',	hashtag: '#CSUS' }, { name: 'Curtis Park',	hashtag: '#CurtisPark' }, { name: 'Dos Rios Triangle',	hashtag: '#DosRiosTriangle' }, { name: 'Downtown',	hashtag: '#DowntownSac' }, { name: 'East Sacramento',	hashtag: '#EastSac' }, { name: 'Elmhurst',	hashtag: '#Elmhurst' }, { name: 'Fairgrounds',	hashtag: '#Fairgrounds' }, { name: 'Greenhaven',	hashtag: '#Greenhaven' }, { name: 'Hollywood Park',	hashtag: '#HollywoodPark' }, { name: 'Johnson Business Park',	hashtag: '#JohnsonBizPark' }, { name: 'Land Park',	hashtag: '#LandPark' }, { name: 'Little Pocket',	hashtag: '#LittlePocket' }, { name: 'Marshall School',	hashtag: '#MarshallSchool' }, { name: 'Meadowview',	hashtag: '#Meadowview' }, { name: 'Med Center',	hashtag: '#MedCenter' }, { name: 'Midtown / Winn Park / Capital Avenue',	hashtag: '#MidTownSac' }, { name: 'New Era Park',	hashtag: '#NewEraPark' }, { name: 'Newton Booth',	hashtag: '#NewtonBooth' }, { name: 'Old North Sacramento',	hashtag: '#NorthOldSac' }, { name: 'North Oak Park',	hashtag: '#OakPark' }, { name: 'Central Oak Park',	hashtag: '#OakPark' }, { name: 'South Oak Park',	hashtag: '#OakPark' }, { name: 'Old Sacramento',	hashtag: '#OldSac' }, { name: 'Pocket',	hashtag: '#Pocket' }, { name: 'Point West',	hashtag: '#PointWest' }, { name: 'Richmond Grove',	hashtag: '#RichmondGrove' }, { name: 'River Park',	hashtag: '#RiverPark' }, { name: 'SCC',	hashtag: '#SCC' }, { name: 'Sierra Oaks',	hashtag: '#SierraOaks' }, { name: 'South Land Park',	hashtag: '#SouthLandPark' }, { name: 'Southside Park',	hashtag: '#SouthsidePark' }, { name: 'Tahoe Park',	hashtag: '#TahoePark' }, { name: 'Tahoe Park East',	hashtag: '#TahoePark' }, { name: 'Tahoe Park South',	hashtag: '#TahoePark' }, { name: 'West Tahoe Park',	hashtag: '#TahoePark' }, { name: 'Tallac Village',	hashtag: '#TallacVillage' }, { name: 'Woodlake',	hashtag: '#WoodLake' } ];
    
//     var nbhoodSchema = new mongoose.Schema({
//         name: String,
//         hashtag: String
//     });

//     var nbhood = mongoose.model( 'nbhood', nbhoodSchema );

//     for (var i = 0; i < nbhoods.length; i++){
//     	new nbhood({ name: nbhoods[i].name, hashtag: nbhoods[i].hashtag, count: 0 })
//     	// watchList[i] = nbhoods[i].hashtag;
//     }
//     // watchList.push('#sacramento')

//     console.log(watchList)
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
	
	var stream = T.stream('statuses/filter', { track: watchList, language: 'en' })

	stream.on('tweet', function (tweet) {
		var hashtags = tweet.entities.hashtags,
			index,
			hash,
			data = {},
			matchedTags = [];

		for (var i = 0; i < hashtags.length; i++){
			hash = '#' + hashtags[i].text.toLowerCase();
			index = watchList.indexOf(hash);
			if (index > -1)
			matchedTags.push(hash)
		}

		data.tweet = tweet;
		data.matchedTags = matchedTags;
		
	  io.sockets.emit('tweet', data);
	})
 
	io.sockets.on('connection', function (socket) {
    	console.log('Connected');
	}); 
