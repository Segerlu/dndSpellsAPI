let express =  require("express")
let {Client} = require('pg');
// let con = require('./config.json')
let cors = require('cors');
let app = express();
const config = (process.env.NODE_ENV ? process.env.NODE_ENV : 'postgresql://postgres:docker@127.0.0.1:5432/dndspellsapidb');
const connectionString = config;
// let passcode = con['passcode'].password;

const client = new Client({
    connectionString: connectionString,
});

app.use(express.json());
app.use(cors());

// var corsOptions = {
//     //origin: process.env.URLFRONT ? process.env.URLFRONT : 'localhost:9999',
//     origin: 'https://dndspellsstaticsite.onrender.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
//const PORT = process.env.PORT ? process.env.PORT : 8006;
const PORT = process.env.PORT;

client.connect();

app.get('/spells', (req, res) => {
    client.query("SELECT * FROM spells ORDER BY index;")
    .then(data => {
        res.send(data.rows);
    })
    .catch(er => {
        res.send(er)
    })
});

app.get('/spells/id/:index', (req, res) => {
    let spell = req.params.index;

    client.query(`SELECT * FROM spells WHERE LOWER(index) LIKE LOWER('${spell}%');`)
    .then((data) => {
        if (data.rows.length > 0) {
            res.send(data.rows);
        } else {
            res.status(404);
            res.send("Spell not found");
        }
    })
    
})

app.get('/spells/name/:name', (req, res) => {
    let spell = req.params.name.replace('+', ' ');

    client.query(`SELECT * FROM spells WHERE LOWER(name) LIKE LOWER('${spell}%') ORDER BY index;`)
    .then((data) => {
        if (data.rows.length > 0) {
            res.send(data.rows);
        } else {
            res.status(404);
            res.send("Spell not found");
        }
    })
    
})

app.get('/spells/update/:spell/:newName/', (req, res) => {
    let spell = req.params.spell.replace('+', ' ');
    let newName = req.params.newName.replace('+', ' ');
    let index = newName.replace(' ', '-').toLowerCase();

    client.query(`UPDATE spells SET name = '${newName}', index = '${index}' WHERE LOWER(name) = '${spell}';`)
    .then(data => {
        res.send({[spell]: newName})
    })
    .catch(er => {
        res.status(404);
        res.send("Either the spell does not exist or you did not create a new name!");
    })
})

app.post('/spells', (req, res) => {
    let data = req.body;
    console.log(data);

    if (Array.isArray(data)) {

        data.map(spell => {
            client.query(`INSERT INTO spells (index, name, url) VALUES ('${spell.index}', '${spell.name}', '${spell.url}');`)
            .catch(err => console.error('connection error', err.stack))
        })
    } else {
        client.query(`INSERT INTO spells (index, name, url) VALUES ('${data.index}', '${data.name}', '${data.url}');`)
        .catch(err => console.error('connection error', err.stack))
    }
        res.send("spells added")
    })

app.get('/spells/delete/:spell', (req, res) => {
    let spell = req.params.spell.replace('+', ' ');
    client.query(`DELETE FROM spells WHERE LOWER(name) = '${spell}';`)
    .then(data => {
        console.log("spell deleted")
        res.send(`${spell} deleted`);
    })

})
    
app.use((req, res, er) => {
    res.status(404).send(er);
})

app.listen(PORT, console.log(`listening on port ${PORT}`));