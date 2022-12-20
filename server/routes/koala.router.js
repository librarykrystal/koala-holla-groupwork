const express = require('express');
const router = express.Router();
const pg = require('pg');
const Pool = pg.Pool;
// DB CONNECTION
const pool = new Pool({
    database: 'koala_holla',  // make sure this is db name, not table name
    host: 'localhost',
    port: 5432,  // host and port info seen in Postico
    max: 10,  // max number of queries/connections to db that can be made at once
    idleTimeoutMillis: 30000  // 30000 millis is 30 seconds
});

pool.on('connect', () => {
    console.log('Postgres is connected.');
});

pool.on('error', (error) => {
    console.log('Postgres Pool connection error:', error);
});

// GET
router.get('/', (req, res) => {
    let queryText = 'SELECT * from "koalas";';
    pool.query(queryText)
    .then((result) => {
        console.log('results from DB', result);
        res.send(result.rows);
    })
    .catch((error) => {
        console.log('error making a query', error)
    })
})

// POST
//name    | gender | age | ready_to_transer | notes   
router.post('/', (req, res) => {
    const newKoala = req.body;
    const queryText = `
    INSERT INTO "koalas" ("name", "gender", "age", "ready_to_transfer", "notes")
    VALUES ('${newKoala.name}', '${newKoala.gender}', '${newKoala.age}', '${newKoala.ready_to_transfer}', '${newKoala.notes}');
    `;
    pool.query(queryText)
    .then((result) => {
        console.log('result', result);
        res.sendStatus(201);
    })
    .catch((error) => {
        console.log('Error making insert query:', error);
        res.sendStatus(500); // 500s are server probs
    })
})

// PUT


// DELETE

module.exports = router;


