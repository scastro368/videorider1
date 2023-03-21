const express= require('express')

const dotenv = require('dotenv')
const cookieParser = require('cookie-Parser')

const app =express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

dotenv.config({path: "./env/.env"})

//para trabajar las cookies
app.use(cookieParser())

//llamar al router
app.use('/', require('./router/router.js'))


//para eliminar el cache que no se puede devolver
app.use(function(req, res, next){
    if(!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.listen (4000,() =>{
    console.log("SERVER UP running in http://localhost:4000")
})