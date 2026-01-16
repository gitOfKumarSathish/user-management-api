const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin/Manager)
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       403:
 *         description: Forbidden
 */
router.get("/users", requireAuth, requireRole("admin", "manager"), adminController.listUsers);

/**
 * @swagger
 * /admin/users/{id}/update:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Forbidden
 */
router.put("/users/:id/update", requireAuth, requireRole("admin", "manager"), adminController.updateUser);

/**
 * @swagger
 * /admin/users/{id}/deactivate:
 *   post:
 *     summary: Deactivate a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated successfully
 */
router.post("/users/:id/deactivate", requireAuth, requireRole("admin", "manager"), adminController.deactivateUser);

/**
 * @swagger
 * /admin/users/{id}/activate:
 *   post:
 *     summary: Activate a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User activated successfully
 */
router.post("/users/:id/activate", requireAuth, requireRole("admin", "manager"), adminController.activateUser);

/**
 * @swagger
 * /admin/users/{id}/delete:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete("/users/:id/delete", requireAuth, requireRole("admin", "manager"), adminController.deleteUser);

module.exports = router;
