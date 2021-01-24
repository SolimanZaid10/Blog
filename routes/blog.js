const express = require('express');
const { getAll, create, getOne, editOne, deleteOne,getBlogs,getOneSearch,getbyAuthor} = require('../controllers/blog');
const router = express.Router();
const multer = require('multer');


//get all blogs
router.get('/', async (req, res, next) => {
   const { user: { id } } = req;
   try {
     const blogs = await getAll({userId:id});
     res.json(blogs);
   } catch (e) {
     next(e);
   } 
});

//saving images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploadedImages/');

  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
//store only images
const filterFile = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg ') {
    cb(null, true);
  } else {
    cb(null, false);
  }

}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: filterFile
});

//post new blog
router.post('/', upload.single('blogImage'), async (req, res, next) => {
  const { body, file, user: { id ,username } } = req;
  body.blogImage = file.path;
  try {
    const user = await create({ ...body, userId: id , author: username});
    res.json(user);
  } catch (e) {
    next(e);
  }
});

//search
router.get('/search', async (req, res, next) => {
  let { query: { author, body, title, tag, limit, skip } } = req;
  let _query = {}
  if (title != undefined)
    _query.title = { $regex: "^" + title }
  if (tag != undefined)
    _query.tags = tag
  if (body != undefined)
    _query.body = { $regex: ".*" + body + ".*" }
  if (limit == undefined || limit == '')
    limit = 10
  if (skip == undefined)
    skip = 0
  let _pagination = { limit: Number(limit), skip: Number(skip) }
  try {
    const blogs = await getBlogs(_query, _pagination, author) 
    res.json(blogs);
  } catch (e) {
    next(e);
  }
});


// show blog
router.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    const blog = await getOne(id);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});
//search by title
router.get('/title/:title', async (req, res, next) => {
  const { params: { title } } = req;
  try {
    const blog = await getOneSearch(title);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});
//search by tag
router.get('/author/:author', async (req, res, next) => {
  const { params: { author } } = req;
  try {
    const blog = await getbyAuthor(author);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});

//delete blog
router.delete('/:id', async (req, res, next) => {
  const { params: { id } } = req;

  try {
    const blog = await deleteOne(id);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});

//edit blog
router.patch('/:id', async (req, res, next) => {
  const { params: { id }, body } = req;
  try {
    const blog = await editOne(id, body);
    res.json(blog);
  } catch (e) {
    next(e);
  }
});


module.exports = router;