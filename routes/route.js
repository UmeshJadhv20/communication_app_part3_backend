const express = require('express');
const userController = require('../controllers/userController');
const documentController = require('../controllers/documentController');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();
// register,login 
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
// user 
router.get('/users', authMiddleware, userController.getAllUsers);
router.get('/user/:id', authMiddleware, userController.getUserById);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);
router.get('/get_auth_user', authMiddleware, userController.getUserByToken);
// chat 
router.post('/chats', authMiddleware, chatController.saveChatMessage);
router.get('/chats', authMiddleware, chatController.getChatMessages);
// document 
router.post('/document-upload', documentController.uploadDocument);
router.get('/documents', documentController.listDocuments);
router.put('/document-edit/:id', documentController.editDocument);
router.delete('/document-delete/:id', documentController.deleteDocument);

module.exports = router;
