const {Router} = require("express");
const Blog = require("../models/blog.model")
const Comment = require("../models/comment.model")
const multer = require("multer")
const path = require("path")

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/add-new', (req,res) => {
  //console.log(req.user);
  
    return res.render('addBlog', {
        user: req.user
    })
})

router.get('/:id', async(req,res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')
    //console.log(comments);
    
    return res.render('blog', {
      user: req.user,
      blog,
      comments
  })
  
})

router.post('/', upload.single('coverImage'), async(req,res) => {
    //console.log(req.body);
    //console.log(req.file);
    const { title,body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageUrl: `/uploads/${req.file.filename}`
    })
    //console.log(blog);
    return res.redirect(`/blog/${blog._id}`)
})

router.post('/comment/:blogId', async(req,res) => {
  const { title,body } = req.body
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router;