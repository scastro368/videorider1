const mysql = require ('mysql')

const conexion = mysql.createConnection({
    host : process.env.db_host,
    user : process.env.db_user,
    pass : process.env.db_pass,
    database : process.env.db_database,
})

conexion.connect( (error) => {
    if(error) {
        console.log('El error de conexion es: ' +error)
        return
    }
    console.log('¡conectado a la base de datos MYSQL!')
})

module.exports = conexion