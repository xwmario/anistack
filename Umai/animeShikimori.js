var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('underscore');

var db = require('../API/db.js');
var Anime = db.Anime;

var fs = require('fs');
var noMatchLog = fs.createWriteStream('./logs-step2/nomatch-' + Date.now() + '.log');
var error404 = fs.createWriteStream('./logs-step2/404-' + Date.now() + '.log');
var errorDBLog = fs.createWriteStream('./logs-step2/DB-' + Date.now() + '.log');

// This does a search through Shikimori and matches Wikipedia to Shikimori/MAL

var getQ = async.queue(function(task, callback){
	request('http://shikimori.org/api/animes?type=TV&limit=10&search=' + task.series_title_main, function(err, res, body){
		if(err || res.statusCode !== 200){
			error404.write(task.series_title_main + ' \n\n');
			console.log('404: %s', task.series_title_main);
			return callback();
		}

		var result = JSON.parse(body)[0];

		if(result){
			console.log(
				'Is \033[1m%s\033[0m equal to crawled \033[1m%s\033[0m (%s)?', 
				task.series_title_main,
				result.name,
				result.id
			);
			Anime.updateOne({
				_id: task._id
			}, {
				$set: {
					'series_external_ids.myanimelist': result.id
				}
			}, function(err, doc){
				if(err){
					errorDBLog.write('%s \n %s \n\n', err, task.series_title_main);
				}
				callback();
			});
		} else {
			noMatchLog.write(task.series_title_main + '\n\n');
			console.log('No result for ' + task.series_title_main);
			callback();
		}
	});	
}, 15);

var nomatch = ["53f3e78c3c8a27b01bd94073","53f3e78c3c8a27b01bd94075","53f3e78d3c8a27b01bd9407e","53f3e78e3c8a27b01bd9407f","53f3e78f3c8a27b01bd94083","53f3e78f3c8a27b01bd94089","53f3e7913c8a27b01bd94092","53f3e7923c8a27b01bd94099","53f3e7933c8a27b01bd940a0","53f3e7953c8a27b01bd940b8","53f3e7973c8a27b01bd940c3","53f3e7973c8a27b01bd940c6","53f3e7973c8a27b01bd940c8","53f3e7983c8a27b01bd940cb","53f3e7983c8a27b01bd940d2","53f3e7993c8a27b01bd940d7","53f3e7993c8a27b01bd940d9","53f3e79b3c8a27b01bd940e6","53f3e79e3c8a27b01bd940fe","53f3e79f3c8a27b01bd94102","53f3e79f3c8a27b01bd94103","53f3e79f3c8a27b01bd94105","53f3e7a13c8a27b01bd94114","53f3e7a13c8a27b01bd9411d","53f3e7a13c8a27b01bd9411f","53f3e7a23c8a27b01bd94120","53f3e7a23c8a27b01bd94125","53f3e7a23c8a27b01bd94127","53f3e7a43c8a27b01bd9412d","53f3e7a43c8a27b01bd94132","53f3e7a43c8a27b01bd94133","53f3e7a63c8a27b01bd9413e","53f3e7a73c8a27b01bd94144","53f3e7a73c8a27b01bd94141","53f3e7a93c8a27b01bd94154","53f3e7ab3c8a27b01bd94160","53f3e7ab3c8a27b01bd94163","53f3e7ad3c8a27b01bd9416b","53f3e7ae3c8a27b01bd94171","53f3e7ae3c8a27b01bd94178","53f3e7b03c8a27b01bd94184","53f3e7b13c8a27b01bd9418a","53f3e7b13c8a27b01bd9418b","53f3e7b13c8a27b01bd9418e","53f3e7b13c8a27b01bd94194","53f3e7b23c8a27b01bd94196","53f3e7b33c8a27b01bd9419c","53f3e7b53c8a27b01bd941af","53f3e7b53c8a27b01bd941b4","53f3e7b63c8a27b01bd941bc","53f3e7b63c8a27b01bd941bb","53f3e7b73c8a27b01bd941c3","53f3e7b73c8a27b01bd941c5","53f3e7c43c8a27b01bd941d5","53f3e7c53c8a27b01bd941d7","53f3e7c63c8a27b01bd941e0","53f3e7c73c8a27b01bd941e9","53f3e7c93c8a27b01bd941f9","53f3e7c83c8a27b01bd941f7","53f3e7c93c8a27b01bd941fa","53f3e7c93c8a27b01bd941fc","53f3e7ca3c8a27b01bd94200","53f3e7cb3c8a27b01bd94212","53f3e7cc3c8a27b01bd9421a","53f3e7cc3c8a27b01bd94219","53f3e7cc3c8a27b01bd9421b","53f3e7cd3c8a27b01bd9421d","53f3e7ce3c8a27b01bd94226","53f3e7cf3c8a27b01bd9422e","53f3e7d03c8a27b01bd94236","53f3e7d03c8a27b01bd94238","53f3e7d13c8a27b01bd94247","53f3e7d23c8a27b01bd9424d","53f3e7d33c8a27b01bd94250","53f3e7d43c8a27b01bd94255","53f3e7d43c8a27b01bd94257","53f3e7d43c8a27b01bd9425b","53f3e7d43c8a27b01bd9425d","53f3e7d53c8a27b01bd94262","53f3e7d63c8a27b01bd94267","53f3e7d93c8a27b01bd9427e","53f3e7da3c8a27b01bd94286","53f3e7d93c8a27b01bd94282","53f3e7da3c8a27b01bd94288","53f3e7db3c8a27b01bd9428c","53f3e7dc3c8a27b01bd9429d","53f3e7dd3c8a27b01bd942a3","53f3e7de3c8a27b01bd942a7","53f3e7de3c8a27b01bd942aa","53f3e7df3c8a27b01bd942b0","53f3e7e03c8a27b01bd942b7","53f3e7e03c8a27b01bd942ba","53f3e7e03c8a27b01bd942bd","53f3e7e03c8a27b01bd942bc","53f3e7e23c8a27b01bd942ca","53f3e7e23c8a27b01bd942cf","53f3e7e33c8a27b01bd942d2","53f3e7e33c8a27b01bd942d3","53f3e7e43c8a27b01bd942d7","53f3e7e73c8a27b01bd942e8","53f3e7e93c8a27b01bd942fb","53f3e7ea3c8a27b01bd94302","53f3e7ea3c8a27b01bd94304","53f3e7ed3c8a27b01bd94315","53f3e7ee3c8a27b01bd9431c","53f3e7ef3c8a27b01bd9431e","53f3e7f03c8a27b01bd94325","53f3e7f03c8a27b01bd94327","53f3e7f33c8a27b01bd9433e","53f3e7f43c8a27b01bd94345","53f3e7f53c8a27b01bd94348","53f3e7f53c8a27b01bd9434c","53f3e7f53c8a27b01bd9434d","53f3e7f63c8a27b01bd9434f","53f3e7f83c8a27b01bd9435d","53f3e7f83c8a27b01bd9435f","53f3e7fb3c8a27b01bd94373","53f3e7fb3c8a27b01bd94376","53f3e7fc3c8a27b01bd9437c","53f3e7fd3c8a27b01bd94380","53f3e7fd3c8a27b01bd94381","53f3e7fe3c8a27b01bd94384","53f3e7ff3c8a27b01bd9438f","53f3e8003c8a27b01bd9439c","53f3e8033c8a27b01bd943af","53f3e8043c8a27b01bd943b6","53f3e8063c8a27b01bd943bc","53f3e8083c8a27b01bd943cc","53f3e8083c8a27b01bd943d0","53f3e8093c8a27b01bd943d3","53f3e80a3c8a27b01bd943db","53f3e80a3c8a27b01bd943da","53f3e80a3c8a27b01bd943e0","53f3e80b3c8a27b01bd943e2","53f3e80b3c8a27b01bd943e3","53f3e80c3c8a27b01bd943ed","53f3e80d3c8a27b01bd943f0","53f3e80e3c8a27b01bd943f6","53f3e8103c8a27b01bd9440b","53f3e8123c8a27b01bd94417","53f3e8123c8a27b01bd9441f","53f3e8133c8a27b01bd94422","53f3e8133c8a27b01bd94425","53f3e8153c8a27b01bd94439","53f3e8193c8a27b01bd9445a","53f3e81a3c8a27b01bd94461","53f3e81b3c8a27b01bd9446c","53f3e81d3c8a27b01bd9447d","53f3e81d3c8a27b01bd94481","53f3e81e3c8a27b01bd94487","53f3e81f3c8a27b01bd94491","53f3e8203c8a27b01bd94495","53f3e8213c8a27b01bd9449f","53f3e7903c8a27b01bd9408c","53f3e7923c8a27b01bd9409a","53f3e7a73c8a27b01bd94145","53f3e7c73c8a27b01bd941ea","53f3e7ee3c8a27b01bd9431a","53f3e7ef3c8a27b01bd94320","53f3e8003c8a27b01bd94394","53f3e8063c8a27b01bd943c2","53f3e80f3c8a27b01bd943ff"];

Anime.find({ _id: { $in: nomatch }}, { series_title_main: 1, _id: 1, series_date_start: 1, series_title_japanese: 1 }, function(err, docs){
	if(err) return console.log(err);
	var docsLen = docs.length;
	for(var i = 0; i < docsLen; i++){
		getQ.push(docs[i]);
	}
});


