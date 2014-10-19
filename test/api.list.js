var app = require('../app');
var request = require('supertest');
var authRequest = request.agent();
var async = require('async');
var should = require('should');

var db = require('../models/db');
var User = db.User;
var Anime = db.Anime;
var Manga = db.Manga;

describe('routes/api/list', function(){
	before(function(done){
		async.parallel([
			function(callback){
				Anime.remove({}, function(err){
					callback(err);
				});
			},
			function(callback){
				Manga.remove({}, function(err){
					callback(err);
				});
			}
		], function(err, res){
			done(err);
		});
	});

	before(function(done){
		var animeDummy = new Anime(require('./fixtures/anime'));
		animeDummy.save(done);
	});

	before(function(done){
		var mangaDummy = new Manga(require('./fixtures/manga'));
		mangaDummy.save(done);
	});

	// Reset user document for each 

	beforeEach(function(done){
		User.remove({}, function(err){
			if(err) return done(err);
			var userDummy = new User(require('./fixtures/user'));
			userDummy.save(done);
		});
	});

	describe('GET /api/list/anime/view/:username', function(){
		it('should respond with user anime list in JSON', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '53f9be32238fb5841beabb72', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			}).expect(200, function(){
				request(app)
				.get('/api/list/anime/view/mochi')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
			});

		});

		it('should respond with error for non-existsing user', function(done){
			request(app)
			.get('/api/list/anime/view/not-a-username')
			.expect('Content-Type', /json/)
			.expect(500, done);
		});
	});

	describe('POST /api/list/anime/add', function(){
		it('should add anime to list', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '53f9be32238fb5841beabb72', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25,
				item_repeats: 5
			})
			.expect(200, done);
		});

		it('should respond with error when no _id is sent', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(500, done);
		});

		it('should respond with error when _id already exists', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '53f9be32238fb5841beabb72', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(){
				request(app)
				.post('/api/list/anime/add')
				.send({
					username: 'mochi',
					api_token: 'topkek',
					_id: '53f9be32238fb5841beabb72', // Sword Art Online
					item_status: 'completed',
					item_rating: 4,
					item_progress: 25
				}).expect(500, done);
			});
		});

		it('should redirect to login page', function(done){
			request(app)
			.post('/api/list/anime/add')
			.expect(302, done);
		});
	});

	describe('POST /api/list/anime/update', function(){
		it('should update anime in list', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '53f9be32238fb5841beabb72', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(err, res){
				if(err) return done(err);
				request(app)
				.post('/api/list/anime/update')
				.send({
					username: 'mochi',
					api_token: 'topkek',
					_id: '53f9be32238fb5841beabb72', // Sword Art Online
					item_status: 'planned',
					item_progress: 20
				})
				.expect(200, done);
			});
		});

		it('should respond with error when no _is is sent', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(500, done);
		});

		it('should redirect to login page', function(done){
			request(app)
			.post('/api/list/anime/update')
			.expect(302, done);
		});
	});

	describe('POST /api/list/anime/remove', function(){
		it('should remove anime from list', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '53f9be32238fb5841beabb72', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(err, res){
				if(err) return done(err);
				request(app)
				.post('/api/list/anime/remove')
				.send({
					username: 'mochi',
					api_token: 'topkek',
					_id: '53f9be32238fb5841beabb72' // Sword Art Online
				})
				.expect(200, done);
			});
		});

		it('should respond with error when no _id is sent', function(done){
			request(app)
			.post('/api/list/anime/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(500, done);
		});

		it('should redirect to login page', function(done){
			request(app)
			.post('/api/list/anime/remove')
			.expect(302, done);
		});
	});

	// Manga list

	describe('GET /api/list/manga/view/:username', function(){
		it('should respond with user manga list in JSON', function(done){
			request(app)
			.post('/api/list/manga/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '5434ff296a2ff84c2391b156', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(){
				request(app)
				.get('/api/list/manga/view/mochi')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
			});
		});
	});

	describe('POST /api/list/manga/add', function(){
		it('should add manga to list', function(done){
			request(app)
			.post('/api/list/manga/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '5434ff296a2ff84c2391b156', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, done);
		});

		it('should respond with error when no _id is sent', function(done){
			request(app)
			.post('/api/list/manga/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(500, done);
		});

		it('should redirect to login page', function(done){
			request(app)
			.post('/api/list/manga/add')
			.expect(302, done);
		});
	});

	describe('POST /api/list/manga/update', function(){
		it('should update manga in list', function(done){
			request(app)
			.post('/api/list/manga/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '5434ff296a2ff84c2391b156', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(err, res){
				if(err) return done(err);
				request(app)
				.post('/api/list/manga/update')
				.send({
					username: 'mochi',
					api_token: 'topkek',
					_id: '5434ff296a2ff84c2391b156', // Sword Art Online
					item_status: 'planned',
					item_progress: 20
				})
				.expect(200, done);
			});
		});

		it('should respond with error when no _id is sent', function(done){
			request(app)
			.post('/api/list/manga/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '5434ff296a2ff84c2391b156', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(err, res){
				if(err) return done(err);
				request(app)
				.post('/api/list/manga/update')
				.send({
					username: 'mochi',
					api_token: 'topkek',
					item_status: 'planned',
					item_progress: 20
				})
				.expect(500, done);
			});
		});

		it('should redirect to login page', function(done){
			request(app)
			.post('/api/list/manga/update')
			.expect(302, done);
		});
	});

	describe('POST /api/list/manga/remove', function(){
		it('should remove manga from list', function(done){
			request(app)
			.post('/api/list/manga/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '5434ff296a2ff84c2391b156', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(err, res){
				if(err) return done(err);
				request(app)
				.post('/api/list/manga/remove')
				.send({
					username: 'mochi',
					api_token: 'topkek',
					_id: '5434ff296a2ff84c2391b156' // Sword Art Online
				})
				.expect(200, done);
			});
		});

		it('should respond with error when no _id is sent', function(done){
			request(app)
			.post('/api/list/manga/add')
			.send({
				username: 'mochi',
				api_token: 'topkek',
				_id: '5434ff296a2ff84c2391b156', // Sword Art Online
				item_status: 'completed',
				item_rating: 4,
				item_progress: 25
			})
			.expect(200, function(err, res){
				if(err) return done(err);
				request(app)
				.post('/api/list/manga/remove')
				.send({
					username: 'mochi',
					api_token: 'topkek'
				})
				.expect(500, done);
			});
		});

		it('should redirect to login page', function(done){
			request(app)
			.post('/api/list/manga/remove')
			.expect(302, done);
		});
	});
});