import express from "express";
import mysql from "mysql2/promise";
import cors from 'cors'
const pool = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "senai",
    database: "senai",
});
const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // permite requisições do frontend
    methods: ['GET', 'POST'],
    credentials: true
}))
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Olá Mundo");
});

// USUARIOS
app.get("/usuarios", async (req, res) => {
    const [results] = await pool.query("SELECT * FROM usuario");
    res.send(results);
});

app.get("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const [results] = await pool.query(
        "SELECT * FROM usuario WHERE idusuario=?",
        id
    );
    res.send(results);
});

app.post("/usuarios", async (req, res) => {
    try {
        const { body } = req;
        const [results] = await pool.query(
            "INSERT INTO usuario (nome,idade) VALUES (?,?)",
            [body.nome, body.idade]
        );

        const [usuarioCriado] = await pool.query(
            "Select * from usuario WHERE idusuario=?",
            results.insertId
        );

        return res.status(201).json(usuarioCriado);
    } catch (error) {
        console.log(error);
    }
});

app.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await pool.query(
            "DELETE FROM usuario WHERE idusuario=?",
            id
        );
        res.status(200).send("Usuário deletado!", results);
    }
    catch (error) {
        console.log(error);
    }
});

app.put("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const [results] = await pool.query(
            "UPDATE usuario SET `nome` = ?, `idade` = ? WHERE idusuario = ?; ",
            [body.nome, body.idade, id]
        );
        res.status(200).send("Usuario atualizado", results);
    } catch (error) {
        console.log(error);
    }
});

// REGISTRO E LOGIN
app.post("/registrar", async (req, res) => {
    try {
        const { body } = req;
        const [results] = await pool.query(
            "INSERT INTO usuario (nome, idade, email, senha) VALUES (?,?,?,?)",
            [body.nome, body.idade, body.email, body.senha]
        );

        const [usuarioCriado] = await pool.query(
            "Select * from usuario WHERE idusuario=?",
            results.insertId
        );

        return res.status(201).json(usuarioCriado);
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { body } = req;

        const [usuario] = await pool.query(
            "Select * from usuario WHERE email=? and senha=?",
            [body.email, body.senha]
        );

        if (usuario.length > 0) {
            return res.status(200).json({
                message: "Usuario logado",
                dados: usuario,
            });
        } else {
            return res.status(404).send("Email ou senha errados!");
        }
    } catch (error) {
        console.log(error);
    }
});

// LOGS
app.get("/logs", async (req, res) => {
    const { query } = req;
    const pagina = Number(query.pagina) - 1;
    const quantidade = Number(query.quantidade)
    const offset = pagina * quantidade

    const [results] = await pool.query(
        `
        SELECT lgs.id, lgs.categoria, lgs.horas_trabalhadas, lgs.linha_de_codigo, lgs.bugs_corrigidos, lgs.id_user, (senai.likes.id_log) AS quantidade_likes FROM lgs 
        LEFT JOIN senai.likes
        ON senai.likes.id_log = senai.lgs.id
        GROUP BY lgs.id, lgs.categoria, lgs.horas_trabalhadas, lgs.linha_de_codigo, lgs.bugs_corrigidos, lgs.id_user
        ORDER BY senai.lgs.id ASC;
        `,
        [quantidade, offset]);
    res.send(results);
});

app.get('/logs/categoria', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT distinct(categoria) FROM lgs'
        );
        res.send(results)
    } catch (error) {
        console.log(error)
    }
})

app.post("/logs", async (req, res) => {
    try {
        const { body } = req;
        const [results] = await pool.query(
            "INSERT INTO lgs(categoria, horas_trabalhadas, linha_de_codigo, bugs_corrigidos, id_user) VALUES (?, ?, ?, ?, ?)",
            [
                body.categoria,
                body.horas_trabalhadas,
                body.linha_de_codigo,
                body.bugs_corrigidos,
                body.id_user,
            ]
        );
        const [logCriado] = await pool.query(
            "SELECT * FROM lgs WHERE id=?",
            results.insertId
        );
        res.status(201).json(logCriado);
    } catch (error) {
        console.log(error);
    }
});

//likess
app.get('/likess', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT * FROM likes'
        )
        res.send(results)
    } catch (error) {
        console.log(error)
    }
})

app.post('/likes', async (req, res) => {
    try {
        const { body } = req;
        const [results] = await pool.query(
            'INSERT INTO likes(log_id, user_id) VALUES(?, ?)', [body.log_id, body.user_id]
        )
        const [likesCriado] = await pool.query(
            'SELECT * FROM likes WHERE id=?', results.insertId
        )
        res.status(201).json(likesCriado)
    } catch (error) {
        console.log(error)
    }
});

app.delete('/likes', async (req, res) => {
    try {
        const { query } = req;
        const id_log = Number(query.id_log);
        const id_user = Number(query.id_user);
        const [results] = await pool.query(`
            DELETE FROM likes WHERE id_log=? AND id_user=?
            `,
        [id_log, id_user]
        )
        res.status(200).send("Like retirado com sucesso", results)
    }
    catch (error) {
        console.log(error)
    }
})

app.listen(3000, () => {
    console.log(`Servidor em http://localhost:3000`);
});
