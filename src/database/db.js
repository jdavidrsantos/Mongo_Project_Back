const mysql = require('mysql')

// console.log({ user: process.env.DB_USER, db: process.env.DB_DATABASE, pass: process.env.DB_PASSWORD })
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlpw',
    database: 'ilercon',
    port: 3306
})

// connection.connect(function (err) {
//     console.log('hi')
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
//     connection.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     })
// });

connection.connect();



module.exports = {





    searchAllProducts() {
        return new Promise(resolve => {
            connection.query(`SELECT * FROM products;`,
                function (error, result) {
                    if (result.length > 0) {
                        resolve(result.map((el) => {
                            return {
                                ...el,
                                rating: JSON.parse(el.rating)
                            }
                        }))
                    } else {
                        resolve(false)
                    }
                })
        })
    },





    deletingproductsAPI() {
        connection.query(`DELETE FROM products;`)
    },

    datosExist(datos) {
        return new Promise(resolve => {
            datos.forEach(element => {
                connection.query(`INSERT INTO products (image, title, description, id, price, category, rating) VALUES ("${element.image}", "${element.title},", 
                 "${element.description}", "${element.id}", "${element.price}", "${element.category}", '${JSON.stringify(element.rating)}' )`,
                    // connection.query(`INSERT INTO products (rating) VALUES ('{"rate": ${element.rating.count} }') `,
                    (err, rows) => {
                        if (err) {
                            if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                                resolve(false)
                            }
                            else {
                                console.log('Other error in the query')
                                console.log(err)
                                resolve(false)

                            }
                        } else {
                            resolve(true)
                        }
                    })
            });
        })
    },



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
                    console.log(y5, 'y5')
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
                    console.log('aqui')
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
                    console.log(result)
                    resolve(result.length > 0)
                    console.log("Soy el log de user exist", resolve(result.length > 0))
                })
        })
    },



}










// bvixoglunlsqcawo