import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
const pool = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senai",
  database: "devhub",
});

const app = express();
app.use(express.json());
app.use(cors());

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
    "SELECT * FROM usuario WHERE id=?",
    id
  );
  res.send(results);
});

app.post("/usuarios", async (req, res) => {
  try {
    const { body } = req;
    const [results] = await pool.query(
      "INSERT INTO usuario (nome,idade, email, senha) VALUES (?,?, ?, ?)",
      [body.nome, body.idade, body.email, body.senha]
    );

    const [usuarioCriado] = await pool.query(
      "Select * from usuario WHERE id=?",
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
      "DELETE FROM usuario WHERE id=?",
      id
    );
    res.status(200).send("Usuário deletado!", results);
  } catch (error) {
    console.log(error);
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const [results] = await pool.query(
      "UPDATE usuario SET `nome` = ?, `idade` = ? WHERE id = ?; ",
      [body.nome, body.idade, id]
    );
    res.status(200).send("Usuario atualizado", results);
  } catch (error) {
    console.log(error);
  }
});

app.get("/metricas-usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query(
      `
      SELECT sum(horas_trabalhadas) AS horas_totais, count(lgs.id) AS logs_totais, sum(bugs_corrigidos) AS bugs_totais, nome FROM lgs
      JOIN usuario
      ON lgs.id_user = usuario.id
      WHERE id_user = ?;
      `, id
    )
    res.status(200).send(results)
  }
  catch (error) {
    console.log(error)
  }
})

// REGISTRO E LOGIN
app.post("/registrar", async (req, res) => {
  try {
    const { body } = req;
    const [results] = await pool.query(
      "INSERT INTO usuario (nome, idade, email, senha) VALUES (?,?,?,?)",
      [body.nome, body.idade, body.email, body.senha]
    );

    const [usuarioCriado] = await pool.query(
      "Select * from usuario WHERE id=?",
      results.insertId
    );

    return res.status(201).json(usuarioCriado);
  } catch (error) {
    console.log(error);
  }
});

/* LOGIN */
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
  const pagina = Number(query.pagina) - 1
  const quantidade = Number(query.quantidade)
  const offset = pagina * quantidade

  const [results] = await pool.query(`
    SELECT
    lgs.id AS log_id,
    lgs.categoria,
    lgs.horas_trabalhadas,
    lgs.linhas_codigo,
    lgs.bugs_corrigidos,
    lgs.id_user,
    usuario.nome,
    usuario.id AS user_id,
    (SELECT COUNT(*) FROM devhub.like WHERE devhub.like.id_log = lgs.id) AS likes,
    (SELECT COUNT(*) FROM devhub.comment WHERE devhub.comment.id_log = lgs.id) AS qnt_comments
    FROM
    devhub.lgs 
    LEFT JOIN devhub.like
    ON devhub.like.id_log = devhub.lgs.id
    LEFT JOIN devhub.comment
    ON devhub.comment.id_log = devhub.lgs.id
    LEFT JOIN devhub.usuario
    ON devhub.usuario.id = devhub.lgs.id_user
    GROUP BY
    lgs.id,
    lgs.categoria,
    lgs.horas_trabalhadas,
    lgs.linhas_codigo,
    lgs.bugs_corrigidos,
    lgs.id_user,
    usuario.nome,
    usuario.id
    ORDER BY
    devhub.lgs.id ASC
    LIMIT ?
    OFFSET ?
    `, [quantidade, offset]);
  res.send(results);
});

// Cadastro de logs
app.post("/logs", async (req, res) => {
  try {
    const { body } = req;
    const [results] = await pool.query(
      "INSERT INTO lgs(categoria, horas_trabalhadas, linhas_codigo, bugs_corrigidos, id_user) VALUES (?, ?, ?, ?, ?)",
      [
        body.categoria,
        body.horas_trabalhadas,
        body.linhas_codigo,
        body.bugs_corrigidos,
        body.id_user
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



//likes
app.get("/likes", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM `like`");
    res.send(results);
  } catch (error) {
    console.log(error);
  }
});

app.post("/likes", async (req, res) => {
  try {
    const { body } = req;
    const [results] = await pool.query(
      "INSERT INTO `like`(id_log, id_user) VALUES(?, ?)",
      [body.id_log, body.id_user]
    );
    const [likeCriado] = await pool.query(
      "SELECT * FROM `like` WHERE id=?",
      results.insertId
    );
    res.status(201).json(likeCriado);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/likes", async (req, res) => {
  try {
  const { query } =  req;
  const id_log = Number(query.id_log)
  const id_user = Number(query.id_user)
  const [results] = await pool.query(
    "DELETE FROM `like` WHERE id_log=? AND id_user=?",
    [id_log, id_user]
  );
  res.status(200).send("Like retirado com sucesso!", results)
  } catch (error) {
    console.log(error)
  }
})


app.listen(3000, () => {
  console.log(`Servidor rodando na porta: http://localhost:3000`);
});
