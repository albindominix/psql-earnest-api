const express  = require('express')
const{Pool} =require('pg')
const db = require('./utils/db.js')

const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const taskController = require('./controller/taskController')
dotenv.config()
const app= express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({origin:"http://localhost:5177"}))


  
  // Create tasks table
db.query(`
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  completed BOOLEAN
);
`);

db.connect((err,client,release)=>{
    if(err){
        return console.error('Error in connection')
    }
    client.query('SELECT NOW()',(err,result)=>{
        release();
        if(err){
            return console.error('Error executing query')
        }
        console.log('Connected to database')
    })
})
 
app.use('/tasks',taskController)

 
app.listen(3000, () => {
    console.log('Server started on port 3000');
  });