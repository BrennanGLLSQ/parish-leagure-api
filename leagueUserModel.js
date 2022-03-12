const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '***placeholder***',
  port: 5432,
});



const getUser = () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM league_accounts', (error, results) => {
        if (error) {
          reject(error)
        }
        const result = results?.rows
        if(!result){
          reject('No rows found')
        }
        else{
          resolve(result)
        }
      })
    }) 
  }
const createUser = (body) => {
    return new Promise(function(resolve, reject) {
      const { user_id, email, selections } = body
      console.log(user_id, email, selections)
      pool.query(`INSERT INTO league_accounts (user_id, email, selections) VALUES ($1, $2, $3) RETURNING *`, [user_id, email, selections], (error, results) => {
        if (error) {
          reject(error)
        }
        console.log(results)
        resolve(`A new user has been added added: ${results.rows[0]}`)
      })
    })
  }

  module.exports = {
    getUser, createUser
  }