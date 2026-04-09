const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { saveUser } = require("../middleware/validate");

router.get("/", userController.getAll);
router.get("/:id", userController.getSingle);
router.post("/", saveUser, userController.createUser);
router.put("/:id", saveUser, userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
