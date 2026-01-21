const Blog = require("../models/blog.model");
const User = require("../models/user.model");

// Get all blogs (with filters)
const getBlogs = async (req, res) => {
  const { category, author } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (author) filter.author = author;

  const blogs = await Blog.find(filter).sort({ createdAt: -1 });
  res.status(200).json(blogs);
};

// Create blog
const createBlog = async (req, res) => {
  const { title, category, content, image } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const user = await User.findById(req.user.userId);

  const blog = await Blog.create({
    title,
    category,
    content,
    image,
    author: user.name,
    userId: user._id
  });

  res.status(201).json(blog);
};

// Update blog
const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  Object.assign(blog, req.body);
  await blog.save();

  res.status(200).json(blog);
};

// Delete blog
const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await blog.deleteOne();
  res.status(200).json({ message: "Blog deleted successfully" });
};

module.exports = {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
};