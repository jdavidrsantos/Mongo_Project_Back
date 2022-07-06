const mysql = require('mysql')

// console.log({ user: process.env.DB_USER, db: process.env.DB_DATABASE, pass: process.env.DB_PASSWORD })
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306
})
connection.connect();

module.exports = {

    // createRecoveryPassword(password) {
    //     return new Promise(resolve => {
    //         connection.query(`INSERT INTO users (recover_code) VALUES ('${password.recover_code}')`,
    //             (uy, ui, y5) => {
    //                 resolve(ui.insert.yes)
    //                 console.log("soy ui", resolve)
    //             })
    //     })
    // },


    codeValidator(code, user_id) {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users where recover_code = '${code}' AND id ='${user_id}'`,
                function (error, result) {
                    if (result.length > 0) {
                        resolve(result[0])
                    } else {
                        resolve(false)
                    }
                })
        })
    },




    createUser(user) {
        return new Promise(resolve => {
            connection.query(`INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`,
                (uy, ui, y5) => {
                    resolve(ui.insertId)
                    console.log("soy ui create user", ui)
                })
        })
    },


    getUserByEmail(email) {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users where email = '${email}'`,
                function (error, result) {
                    if (result.length > 0) {
                        resolve(result[0])
                        console.log("soy el resolve de getuserbyemail", (result[0]))
                    } else {
                        resolve(false)
                    }
                })
        })
    },


    userExist(email) {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users where email = '${email}'`,
                function (error, result) {
                    resolve(result.length > 0)
                    console.log("Soy el log de user exist", resolve(result.length > 0))
                })
        })
    },



    updatePassword(id, password) {
        connection.query(`UPDATE users set password = '${password}' where id = ${id}`)
    },





    setUserRecoverCode(id, code) {
        connection.query(`UPDATE users set recover_code = '${code}' where id = ${id}`)

    },


    login(email, password) {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users where email = '${email}' and password = '${password}'`,
                function (error, result) {
                    if (result.length) {
                        resolve(result[0])
                    } else {
                        resolve(false)
                    }
                })
        })
    },


    userFacebook(name, email, id) {
        return new Promise(resolve => {
            connection.query(`INSERT INTO users (name, email, password, facebookID) VALUES ('${name}', '${email}', '', '${id}')`,
                function (error, results, fields) {
                    console.log(results)
                    console.log("soy results userfacebook", results)
                    resolve(results.insertId)
                    console.log("soy results userfacebook", resolve)
                    // if (error) throw error;
                    // console.log('The solution is: ', results[0].solution);
                });
        })
    },

    userExistFacebook(id) {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM users where facebookID = '${id}'`,
                function (error, result) {
                    resolve(result.length > 0)
                    console.log("Soy el log de user exist", resolve(result.length > 0))
                })
        })
    },



}










// bvixoglunlsqcawo