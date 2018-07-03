const express = require('express');
const tasksRouter = express.Router();
const Todo = require('../models/Todo');
const ObjectId = require('mongoose').Types.ObjectId; 

tasksRouter.use((req, res, next) => {
	if (req.isAuthenticated()){
		return next();
	} 

	res.status(403).json({
		message: 'You are not currently logged in.'
	});

});

tasksRouter.route('/task')
	// GET to /api/task will return tasks
	.get(async (req, res, next) => {

		try {

			const tasks = await Todo.aggregate([
				{	"$match": {
						"date": {
							"$gte": new Date("2017-01-01"),
							"$lt": new Date("2019-01-01")
						}
					}
				},
				{	"$project": { 
						"date": true,
						"tasks": { 
							"$filter": { 
								"input": "$tasks", 
								"as": "task", 
								"cond": { "$setIsSubset": [ [ "$$task.idUser" ], 
								[ new ObjectId(req.user._id)] ] }
							} 
						} 
					}
				}
			]).exec();

			res.json(tasks);
			
		} catch (err) {
			return next(new Error(err));
		}

	})
	// POST to /api/task will create a task 
	.post(async (req, res, next) => {

		try {

			const tasks = await Todo.findOneAndUpdate(
				{
					//format date is ISO 
					date: new Date(req.body.date)
				},
				{
					"$push": {
						tasks: {
							text: req.body.text,
							done: false,
							idUser: req.user._id
						}
					}
				},
				{
					upsert: true,
					new: true
				}
			).exec();

			res.json(tasks);

		} catch (err) {
			return next(new Error(err));
		}

	})
	// PUT to /api/task with id of task will update a task
	.put(async (req, res, next) => {

		try {

			const tasks = await Todo.findOneAndUpdate(
				{
					date: new Date(req.body.date),
					"tasks._id": req.body.id,
					"tasks.idUser": req.user._id
				},
				{
					"$set" : {
						"tasks.$.text" : req.body.text,
						"tasks.$.done" : req.body.done
					}
				},
				{
					new: true
				}
			).exec();

			res.json(tasks);
			
		} catch (err) {
			return next(new Error(err));
		}
	})
	// DELETE to /api/task with id of task will delete a task
	.delete(async (req, res, next) => {

		try {

			const tasks = await Todo.findOneAndUpdate(
				{
					date: new Date(req.body.date)
				},
				{
					"$pull": {
						tasks: {
							_id: req.body.id,
							idUser: req.user._id
						}
					}
				}
			).exec();

			res.json({
				message: 'Succesfully removed'
			});

		} catch (err) {
			return next(new Error(err));
		}

	});

module.exports = tasksRouter;