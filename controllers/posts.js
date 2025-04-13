
const Posts = require('../models/posts');

// Helper to get current epoch time in ms
const now = () => Date.now();

// POST /posts
exports.createPost = async (req, res) => {
	try {
		const { author, title, isPublished, timestamp } = req.body;
		// publishedDate only if isPublished is true
		const publishedDate = isPublished ? now() : undefined;
		// Create post (id auto-incremented by model)
		const post = await Posts.create({
			author,
			title,
			isPublished,
			timestamp,
			...(publishedDate !== undefined ? { publishedDate } : {})
		});
		// Convert to plain object
		let postObj = post.toJSON();
		if (!isPublished) {
			delete postObj.publishedDate;
		}
		res.status(201).json(postObj);
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

// GET /posts
exports.getPosts = async (req, res) => {
	try {
		const { author, isPublished } = req.query;
		let where = {};
		if (author !== undefined) {
			where.author = Number(author);
		}
		if (isPublished === 'true') {
			where.isPublished = true;
		} else if (isPublished === 'false') {
			where.isPublished = false;
		}
		// Ignore isPublished if not 'true' or 'false'
		const posts = await Posts.findAll({
			where,
			order: [['id', 'ASC']]
		});
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

// GET /posts/:id
exports.getPostById = async (req, res) => {
	try {
		const id = Number(req.params.id);
		const post = await Posts.findByPk(id);
		if (!post) {
			res.status(404).send('ID not found');
		} else {
			res.status(200).json(post);
		}
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' });
	}
};

// DELETE, PUT, PATCH /posts/:id
exports.methodNotAllowed = (req, res) => {
	res.status(405).send();
};
