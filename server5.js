const express = require('express');
const app = express();
const port = 3000;
var mariadb = require('mariadb');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const options = {
    definition: {
        info: {
            title: 'Swagger API demo',
            version: '1.0.0',
            description: 'my demo-SI'
        }
    },
    apis: ['server5.js']
}

var pool =
    mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit: 5
    });
const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
/**
 * @swagger
 * /company/{id}:
 *  delete:
 *      tags:
 *         - Delete
 *      description: Deletion of company by using the COMPANY_ID
 *      produces:
 *          - application/json
 *      parameters:
 *          - company_id: id
 *            description: Using the ID the record can be deleted
 *          - in: path
 *            type: integer
 *            required: true
 *      responses: 
 *          '200':
 *              description: Delete record from the company
 */

app.delete('/company/:id', async (req, res) => {
    let conn, rows;
    try {
        var id = req.params.id;
        conn = await pool.getConnection();
        rows = await conn.query("delete from company where COMPANY_ID = ?", [id]);
        console.log(rows);
        res.send(rows);
        throw e;
    }
    catch (e) {
        res.status(404);
        throw e;
    } finally {
        if (conn) {
            return conn.end();
        }
    }
});


/**
 * @swagger
 * /company:
 *  post:
 *      tags:
 *          - Post
 *      description: Creating a new record for the company
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: reqBody
 *          - in: body
 *            schema:
 *              type: object
 *              properties:
 *                  company_id:
 *                    type: number
 *                  company_name:
 *                    type: string
 *                  company_city:   
 *                    type: string
 *              required:
 *                  - company_id
 *                  - company_name
 *                  - company_city
 *      responses:
 *          '200':
 *              description: Record added to the company table
 */

app.post('/company',body('id').isInt(),body('name').isString(), body('city').isString(), async (req, res) => {
    let conn, rows;
    const id = req.body.id;
    const name = req.body.name;
    const city = req.body.city;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        conn = await pool.getConnection();
        rows = await conn.query("insert into company (COMPANY_ID,COMPANY_NAME,COMPANY_CITY) values (?,?,?)", [id, name, city]);
        console.log(rows);
        res.send(rows);
        throw e;
    } catch (e) {
        res.status(404);
        throw e;
    } finally {
        if (conn) {
            return conn.end();
        }
    }
});

/**
 * @swagger
 * /company/{id}:
 *  put:
 *      tags:
 *         - PUT
 *      description: put a value by using company_id
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            description: By the given record ID the company name value can be updated
 *            in: path
 *            type: number
 *            required: true
 *          - name: body
 *            description: req body
 *          - in: body
 *            schema: 
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *              required:
 *                  -name
 *      responses:
 *          '200':
 *              description: Update the required company name using id
 */

app.put('/company/:id', body('name').isString(), async (req, res) => {
let conn, rows;
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}
try {
    console.log(req.body);
    console.log(req.params.id);
    const id = req.params.id;
    const name = req.body.name;
    conn = await pool.getConnection();
    rows = await conn.query("update company set COMPANY_NAME = ? where COMPANY_ID = ?", [name, id]);
    console.log(rows);
    res.send(rows);
    throw e;
}
catch (e) {
    res.status(404);
    throw e;
} finally {
    if (conn) {
        return conn.end();
    }
}
});

/**
 * @swagger
 * /company/{id}:
 *  patch:
 *      tags:
 *         - Patch
 *      description: patch is used to modify the city name using company_id
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            description: update by id
 *            in: path
 *            type: string
 *            required: true
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema: 
 *              type: object
 *              properties:
 *                  city:
 *                      type: string
 *              required:
 *                  -city
 *      responses:
 *          '200':
 *              description: patch done to the city
 */

app.patch('/company/:id', body('city').isString(), async (req, res) => {
    let conn, rows;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log(req.body.city);
        console.log(req.params.id);
        const id = req.params.id;
        const city = req.body.city;
        conn = await pool.getConnection();
        rows = await conn.query("update company set COMPANY_CITY = ? where COMPANY_ID = ?", [city, id]);
        console.log(rows);
        res.send(rows);
        throw e;
    }
    catch (e) {
        res.status(404);
        throw e;
    } finally {
        if (conn) {
            return conn.end();
        }
    }
});

/**
 * @swagger
 * /company:
 *  get:
 *      tags:
 *         - Get
 *      description: get is used to get all the companies in the table
 *      produces:
 *          - application/json
 *      parameters:
 *      responses:
 *          '200':
 *              description: get all the company records
 */

app.get('/company', async (req, res) => {
    let conn, rows;
    try {
        conn = await pool.getConnection();
        rows = await conn.query("select * from company");
        console.log(rows);
        res.send(rows);
        throw e;
    }
    catch (e) {
        res.status(404);
        throw e;
    } finally {
        if (conn) {
            return conn.end();
        }
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://159.223.162.196:${port}`)
});