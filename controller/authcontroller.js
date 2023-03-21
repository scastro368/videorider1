const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../databases/db.js')
const {promisify} = require('util')

//procedimiento para registros
exports.register = async (req, res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
       let passHash = await bcryptjs.hash(pass, 8)
      // console.log(passHash)
      conexion.query('insert into users SET ?', {user:user, name:name, pass:passHash}, (error, results) =>{
        if(error){console.log(error)}
        res.redirect('/')
      })
    } catch (error) {
        console.log(error)
    }

}

exports.login = async  (req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass
       
        if(!user || !pass){
            res.render('login', {
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon: "info",
                showConfirmButtom: true,
                ruta: 'login'
            })
        } else{
            conexion.query("select * from usuarios where user = ?", [user], async (error, results)=> {
               if(results.lenght == 0 || ! (await bcryptjs.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert:true,
                    alertTitle: "Advertencia",
                    alertMessage: "Ingrese un usuario y password",
                    alertIcon: "info",
                    showConfirmButtom: true,
                    ruta: 'login'
                })
               }else{
                //inicio de sesion
                const id = results[0].id
                const token = jwt.sign({id:id}, process.env.INT_SECRETO, {
                    expiresIn: process.env.INT_TIEMPO_EXPIRA
                })
                 //generamos el token sin fecha de expiracion
                 //const token = jwt.sign({id:id}, process.env.INT_SECRETO,
                  console.log('token:'+token+'para el USUARIO : '+user)

                  cookiesOptions = {
                    expires: new Date(DATE.now()+process.env.INT_COOKIE_EXPIRES * 24 * 60 * 60 * 100),
                    httpOnly: true
                  }
                  res.cookie('jwt', token, cookiesOptions)
                  res.render('login', {
                    alert:true,
                    //alertTitle: "conexion exitosa",
                    alertMessage: "!login correcto¡",
                    alertIcon: "success",
                    showConfirmButtom: false,
                    timer: 800,
                    ruta: ''
                  })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next)=> {
  if(req.cookies.jwt) {
    try {
        const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.INT_SECRETO)
        conexion.query('select * from usuarios where id = ?', [decodificada.id], (error, results)=>{
            if(!results){return next()}
            req.user  = results[0]
            return next()
        })
    } catch (error) {
        console.log(error)
        return next()
    }
  }else{
    res.redirect('/login')
  }
}

exports.logout = (req, res)=> {
  res.clearCookie('jwt')
  return  res.redirect('/')
  }
  