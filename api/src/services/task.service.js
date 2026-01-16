const { Request, Response, NextFunction } = require('express');
const { StatusCodes } = require('http-status-codes');
const { taskCreateSchema, taskUpdateSchema } = require('../validators/todo.validator');
const Todo = require('../models/todo');



const createTaskService = async (req, res, next) => {
    try {
        const taskData = taskCreateSchema.parse(req.body);
        const appendUserId = {
            user: req.user.id,
            created_by: req.user.id,
            ...taskData
        };
        console.log({ appendUserId });
        const todo = await Todo.create(appendUserId);


        return res.status(StatusCodes.CREATED).json({
            message: "Task created successfully",
            data: todo
        });
    } catch (error) {
        next(error);
    }
};

const getAllTaskService = async (req, res, next) => {
    try {
        const todos = await Todo.find({ is_deleted: false })
            .populate('user', '-passwordHash -__v')
            .populate('created_by', '-passwordHash -__v')
            .select('-__v');
        const totalCount = await Todo.countDocuments();


        return res.status(StatusCodes.OK).json({
            message: "Tasks fetched successfully",
            data: todos,
            total_count: totalCount
        });
    } catch (error) {
        next(error);
    }
};

const getTaskByIdService = async (req, res, next) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            is_deleted: false
        });

        if (!todo) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Task not found",
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Task fetched successfully",
            data: todo
        });
    } catch (error) {
        next(error);
    }
};

// const old_deleteTaskService = async (req, res, next) => {
//     try {
//         // const todo = await Todo.findByIdAndDelete(req.params.id);
//         // const todo = await Todo.findByIdAndUpdate(
//         //     req.params.id,
//         //     { $set: { is_deleted: true, deleted_at: new Date() } },
//         //     { new: true }
//         // );
//         // if (!todo) {
//         //     return res.status(StatusCodes.NOT_FOUND).json({
//         //         message: "Task not found",
//         //     });
//         // }
// 
//         // return res.status(StatusCodes.OK).json({
//         //     message: "Task deleted successfully",
//         //     data: todo
//         // });
//     } catch (error) {
//         next(error);
//     }
// };

const deleteTaskService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const hardDelete = req.query.hard_delete === 'true';
        if ('soft_delete' in req.query) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid query param. Use hardDelete=true"
            });
        }

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Task not found",
            });
        }

        if (hardDelete) {
            await Todo.findByIdAndDelete(id);
            return res.status(StatusCodes.OK).json({
                message: "Task permanently deleted"
            });
        }

        if (todo.is_deleted) {
            return res.status(400).json({
                message: "Task already deleted"
            });
        }

        todo.is_deleted = true;
        todo.deleted_at = new Date();
        await todo.save();

        return res.status(StatusCodes.OK).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};



const updateTaskService = async (req, res, next) => {
    try {
        const todo = taskUpdateSchema.parse(req.body);

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { $set: todo }, { new: true });
        if (!updatedTodo) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Task not found",
            });
        }

        return res.status(StatusCodes.OK).json({
            message: "Task updated successfully",
            data: updatedTodo
        });
    } catch (error) {
        next(error);
    }
};


module.exports = { createTaskService, getAllTaskService, getTaskByIdService, updateTaskService, deleteTaskService };
