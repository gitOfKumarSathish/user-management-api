const todoController = require('../controllers/todo.controller');
const { requireNotDelete, hideDeletedTasks } = require('../middlewares/notDeleted');
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const router = require('express').Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - priority
 *         - due_date
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         title:
 *           type: string
 *           description: The title of the todo
 *         description:
 *           type: string
 *           description: The description of the todo
 *         status:
 *           type: string
 *           enum: [pending, in progress, completed]
 *           description: The status of the todo
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: The priority of the todo
 *         due_date:
 *           type: string
 *           format: date-time
 *           description: The due date of the todo
 *         is_deleted:
 *           type: boolean
 *           description: Soft delete flag
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         title: Complete Project
 *         description: Finish the swagger documentation
 *         status: pending
 *         priority: high
 *         due_date: 2024-12-31T23:59:59.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: The task managing API
 */

/**
 * @swagger
 * /task/create:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/create', requireAuth, todoController.createTask);

/**
 * @swagger
 * /task/getAll:
 *   get:
 *     summary: Returns the list of all non-deleted tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 total_count:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/getAll', hideDeletedTasks, todoController.getAllTasks);

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: The task description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', todoController.getTaskById);

/**
 * @swagger
 * /task/{id}/update:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: The task was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Task is already deleted or validation error
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id/update', requireNotDelete, todoController.updateTask);

/**
 * @swagger
 * /task/{id}/delete:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *       - in: query
 *         name: hard_delete
 *         schema:
 *           type: boolean
 *         description: Set to true for permanent deletion
 *     responses:
 *       200:
 *         description: The task was deleted
 *       400:
 *         description: Task already deleted or invalid query param
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id/delete', todoController.deleteTask);

module.exports = router;
