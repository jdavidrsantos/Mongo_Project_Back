const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlpw',
    database: 'ilercon',
    port: 3306
})
connection.connect();

module.exports = {
    createUser(user) {
        return new Promise(resolve => {
            connection.query(`INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`,
                (uy, ui, y5) => {
                    resolve(ui.insertId)
                })
        })
    },

    userExist(email) {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users where email = '${email}'`,
                function (error, result) {
                    resolve(result.length > 0)
                })
        })
    },

    login(email, password) {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users where email = '${email}' and password = '${password}'`,
                function (error, result) {
                    console.log(result)
                    if (result.length) {
                        resolve(result[0])
                    } else {
                        resolve(false)
                    }
                })
        })
    }

}



