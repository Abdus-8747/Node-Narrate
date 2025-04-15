const {Router} = require("express");
const User = require("../models/user.model")

const router = Router();

router.get('/signin', (req, res) => {
    return res.render("signin")
})

router.get('/signup', (req, res) => {
    return res.render("signup")
})

router.post('/signup', async(req, res) => {
   // console.log(req.body);
    const { fullName,email,password } = req.body;

   const user = await User.create({
        fullName,
        email,
        password
    })
    return res.redirect("/user/signin");
})

router.post('/signin', async(req,res) => {
 //   console.log(req.body);
    const { email,password } = req.body;
try {
    
        const token = await User.matchPasswordAndGenerateToken(email, password)
       // console.log("token: ",token);
        
        return res.cookie('token', token).redirect("/");
} catch (error) {
    return res.render("signin", {
        error: "Incorrect Email Or Password"
    })
}
})

router.get('/logout', (req,res) => {
    res.clearCookie("token").redirect("/")
})

module.exports = router;