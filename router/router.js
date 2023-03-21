const express= require ('express')
const router = express.Router()

 const conexion =require('../databases/db.js')

const authcontroller = require('../controller/authcontroller.js')

 //router para las vistas
router.get('/log', authcontroller.isAuthenticated, (req,res)=>{
    res.render('index', {user:req.user})
})
router.get('/login',(req,res)=>{
    res.render('login', {alert:false})
})
router.get('/register',(req,res)=>{
    res.render('register')
})


//router para los metodos del controller
router.post('/register', authcontroller.register)
router.post('/login', authcontroller.login)
router.get('/logout', authcontroller.logout)

module.exports = router