const { StatusCodes } = require("http-status-codes");
const Todo = require("../models/todo");

async function requireNotDelete(req, res, next) {
    const verify = await Todo.findById(req.params.id, { is_deleted: 1 });
    if (verify.is_deleted) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Task is already deleted not allowed to update or delete",
        });
    }
    next();
}

function hideDeletedTasks(req, res, next) {
    req.query.is_deleted = false;
    next();
}

module.exports = { requireNotDelete, hideDeletedTasks };
