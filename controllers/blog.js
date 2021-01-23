const Blog = require('../models/blog');


const getAll = (query) => {
  return Blog.find(query).exec();

}
const getallHome = () => Blog.find({}).exec();

const getOne = (id) => {
  return Blog.findById(id).exec();

}
const getOneSearch = (title) => {
  return Blog.find({ title: title }).exec();

}

const getbyTag = (tag) => {
  return Blog.find().where('tag').in(tags).exec();
}

const create = (blog) => {
  return Blog.create(blog);
}

const editOne = (id, body) => {
  return Blog.findByIdAndUpdate(id, body, { new: true }).exec();
}


const deleteOne = (id) => {
  return Blog.findByIdAndDelete(id).exec();
}


const getBlogs = async (query, pagination, author) => {
  if (author == undefined)
    return blogModel.find(query).sort([['updatedAt', -1]]).limit(pagination.limit).skip(pagination.skip).exec();
  else {
    const foundUsers = await getUsers(author)
    let blogsIds = []
    foundUsers.forEach(u => {
      blogsIds.push(...u.blogs)
    })
    console.log(...blogsIds)
    return blogModel.find(query).where('_id').in(blogsIds)
      .limit(pagination.limit).skip(pagination.skip).exec();
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  editOne,
  deleteOne,
  getOneSearch,
  getallHome,
  getbyTag,
  getBlogs
}