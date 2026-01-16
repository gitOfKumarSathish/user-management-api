const { StatusCodes } = require('http-status-codes');
const { createTaskService, getAllTaskService, getTaskByIdService, updateTaskService, deleteTaskService } = require('../services/task.service');


class TodoController {
    constructor() {
        this.createTask = this.createTask.bind(this);
        this.getAllTasks = this.getAllTasks.bind(this);
        this.getTaskById = this.getTaskById.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    async createTask(req, res, next) {
        return createTaskService(req, res, next);
    }

    async getAllTasks(req, res, next) {
        return getAllTaskService(req, res, next);
    }

    async getTaskById(req, res, next) {
        return getTaskByIdService(req, res, next);
    }

    async updateTask(req, res, next) {
        return updateTaskService(req, res, next);
    }

    async deleteTask(req, res, next) {
        return deleteTaskService(req, res, next);
    }
}

module.exports = new TodoController();
