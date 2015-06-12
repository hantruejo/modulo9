//Importar modelo
var models = require('../models/models.js');

//Autoload - Factoriza el código si la ruta incluye : quizID
exports.load = function(req, res, next, quizId) {
	  models.Quiz.find({
	            where: {id: Number(quizId)},
	            include: [{model: models.Comment}]
	        }).then(function(quiz) {
	      if (quiz) {
	        req.quiz = quiz;
	        next();
	      } else{next(new Error('No existe quizId=' + quizId))}
	    }
	  ).catch(function(error){next(error)});
	};

//Get /quizes
exports.index= function(req,res,next){
	
	if (req.query.search != undefined){
		models.Quiz.findAll({ where: ['pregunta like ?', '%'+req.query.search+'%']}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes, busqueda:true, errors:[] });
		}) .catch(function(error){next(error);});
	}else if (req.query.tematica != undefined){
		models.Quiz.findAll({ where: ['tematica like ?', '%'+req.query.tematica+'%']}).then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes, busqueda:true, errors:[] });
		}) .catch(function(error){next(error);});
	
	}else{
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index.ejs',{quizes:quizes, busqueda:false, errors:[] });
		}).catch(function(error){next(error);});
	}
			
	};

//Get /quizes/question
exports.show = function (req, res,next){
		res.render ('quizes/show', {quiz:req.quiz, errors:[] });
};

//Get /quizes/answer
exports.answer = function (req, res,next){
	var resultado= "incorrecta";
		if (req.query.respuesta === req.quiz.respuesta){
			resultado="Correcta";
		}
			res.render ('quizes/answer',{quiz:req.quiz, respuesta: resultado, errors:[] });		
};

//Get /quizes/new
exports.new = function (req, res, next) {
	var quiz = models.Quiz.build (
			{pregunta: "Pregunta", respuesta: "Respuesta", tematica: "Tematica"}
			);
	res.render('quizes/new',{quiz: quiz, errors:[] });
};

//Post /quizes/create
exports.create = function (req,res) {
	var quiz = models.Quiz.build (req.body.quiz);
	quiz.validate().then(function(err){
		if (err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}else{
		quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
			res.redirect('/quizes')})
		}
	}
	);
};

//Get /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors:[]});
}

//Put /quizes/:id
exports.update = function (req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta= req.body.quiz.respuesta;
	req.quiz.tematica= req.body.quiz.tematica;
	
	req.quiz.validate().then(function(err){
		if (err){
			res.render('quizes/edit', {quiz: req.quiz, errors:[]});
		}else{
			req.quiz.save({fields:["pregunta", "respuesta", "tematica"] }).then(function(){
				res.redirect("/quizes");});
		}
	}
	);
};

//Delete /quizes/id:
exports.destroy = function (req, res) {
	req.quiz.destroy().then(function (){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

/*
function getAllQuizes(searchQuery){

return models.Quiz.findAll({ where: ['pregunta like ?', '%'+searchQuery+'%']} 
	).then(function (result) {
		 return result;
	});
}
*/