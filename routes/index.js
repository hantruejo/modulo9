var express = require('express');
var router = express.Router();

/*
 * Controllers
 */
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

//Autoload de comandos con ids
router.param('quizId', 		quizController.load);  // autoload :quizId
router.param('commentId',	commentController.load); //autoload :commentId

/*
 * GET home page.
 */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [],layout:true});
});

/*
 * Users routes
 */
router.get('/login',	sessionController.new);
router.post('/login',	sessionController.create);
router.get('/logout',	sessionController.destroy);




/*
 * Quizes Routes
 */
router.get('/quizes',                      	quizController.index);
router.get('/quizes/:quizId(\\d+)',        	quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',					sessionController.loginRequired,	quizController.new);
router.post('/quizes/create',				sessionController.loginRequired,	quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired,	quizController.edit);
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired,	quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired,	quizController.destroy);

/*
 * Comment routes
 */
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',	sessionController.loginRequired,	commentController.publish);




/*
 * Author pages
 */
router.get('/author', function(req, res) {
	  res.render('author', { title: 'Quiz', errors: [],layout:true});
	});

module.exports=router;