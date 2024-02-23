const router = require("express").Router();
const db = require('../utils/db')

 // Get all tasks
 router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).send({error: err.message});
  }
});


 // Add a task
 router.post('/', async (req, res) => {
  try { 
    const { title, description } = req.body;
    const { rows } = await db.query(
      'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, description, false]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send({error: err.message});
  }  
});




  // Update task
  router.patch('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {completed } = req.body;
      
      const query = 'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *';
  
      const values = [ completed, id];
      
      const { rows } = await db.query(query, values);
      
      res.json(rows[0]);
    
    } catch (err) {
      res.status(500).send({error: err.message});
    }
  });

  //delete task
  router.delete('/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        // const query = `DELETE FROM tasks WHERE id = ${id}`;
        const result = await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        console.log('rowCOunt',result.rowCount)
        if (result.rowCount === 0) {
            res.status(404).send('Task not found'); 
          } else {
            res.sendStatus(204); 
          }
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting task');
          }

    
  })


module.exports = router;











// // Populate initial tasks
// app.get('/init-tasks', async (req, res) => {

   
  
//       await db.query(`INSERT INTO tasks (title, description) 
//                      VALUES 
//                      ('Task 1', 'Do something'),
//                      ('Task 2', 'Do something else'),
//                      ('Task 3', 'Do another thing')`);
      
//       res.send('Sample tasks populated');
  
  
//   });