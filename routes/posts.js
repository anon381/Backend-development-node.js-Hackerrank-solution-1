
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

// POST /posts
router.post('/', postsController.createPost);

// GET /posts
router.get('/', postsController.getPosts);

// GET /posts/:id
router.get('/:id', postsController.getPostById);

// DELETE, PUT, PATCH /posts/:id
router.delete('/:id', postsController.methodNotAllowed);
router.put('/:id', postsController.methodNotAllowed);
router.patch('/:id', postsController.methodNotAllowed);

module.exports = router;
