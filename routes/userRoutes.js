const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { saveUser } = require("../middleware/validate");
const { isAuthenticated } = require('../middleware/isAuthenticated')

router.get("/", userController.getAll);
router.get("/:id", userController.getSingle);
router.post("/", isAuthenticated, saveUser, userController.createUser);
router.put("/:id", isAuthenticated, saveUser, userController.updateUser);
router.delete("/:id", isAuthenticated, userController.deleteUser);

module.exports = router;
