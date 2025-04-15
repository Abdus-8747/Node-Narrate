const express = require("express");
const path = require("path")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")

const Blog = require("./models/blog.model")

const userRoute = require("./routes/user.route");
const blogRoute = require("./routes/blog.routes")
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 5000;

mongoose.connect("mongodb://127.0.0.1:27017/node-narrate")
.then(() => console.log("MongoDB Connected"))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

app.set('view engine', 'ejs')
app.set("views", path.resolve("./views"))

app.get('/', async(req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    //console.log(allBlogs);
    
    res.render("home", {
        user: req.user,
        blogs: allBlogs
    });
});


app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`))