const express = require("express")
const mysql = require("mysql2/promise")
const app = express()

app.use(express.json())

// Conectar com o banco de dados
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "jogos"
})

app.get("/jogo", async (req, res) => {
    const [jogo] = await db.execute("SELECT * FROM jogo")
    return res.json(jogo)
})

app.post("/jogo", async (req, res) =>{
    const {nome, desenvolvedora, sinopse, genero_id } = req.body

    if(!nome || !desenvolvedora || !sinopse || !genero_id){
        return res.status(400).json({error: "Nome , desenvolvedora, sinopse e o id do genero são obrigatorios"})
    }

     if(nome.length < 3) {
        return res.status(400).json({error: "Nome precisa ter mais de 2 caracteres"})
    }

    const [resultado] = await db.execute(
        "INSERT INTO jogo(nome, desenvolvedora, sinopse, genero_id) VALUES (?, ?)", [nome,desenvolvedora,sinopse]
    )

    return res.status(201).json({id: resultado.insertId, nome,desenvolvedora,sinopse, genero_id})
})

app.delete("/jogo/:id", async(req, res) => {
    const id = req.params.id
    const [resultado] = await pool.execute("DELETE FROM jogo WHERE id = ?", [id])

    if(resultado.affectedRows === 0){
        return res.status(404).json({error: "Jogo não encontrado"})
    }

    res.status(204).json({mensagem: "Jogo deletado com sucesso"})
})

app.put("/jogo/:id", async(req, res) => {
    const {nome, desenvolvedora, sinopse} = req.body

    if(!nome || !desenvolvedora || !sinopse){
        return res.status(400).json({error: "Nome, desenvolvedora e sinopse são obrigatórios"})
    }

    const id = req.params.id

    const [resultado] = await pool.execute(
        "UPDAtE jogo SET nome = ?, desenvolvedora = ?, sinopse = ?, genero_id = ? WHERE id = ?",
        [nome, desenvolvedora, sinopse, genero_id]
    )

    if(resultado.affectedRows === 0){
        res.status(404).json({error: "Jogo não encontrado"})
    }

    return res.json({id, nome, desenvolvedora, sinopse, genero_id})
})

app.get("/generos", async (req, res) => {
    const [genero] = await db.execute("SELECT * FROM generos")
    return res.json(genero)
})

app.post("/generos", async (req, res) =>{
    const {nome, descricao} = req.body

    if(!nome || !descricao){
        return res.status(400).json({error: "Nome e descrição do genero são obrigatorios"})
    }

     if(nome.length < 3) {
        return res.status(400).json({error: "Nome do genero precisa ter mais de 2 caracteres"})
    }

    const [resultado] = await db.execute(
        "INSERT INTO generos(nome, descricao) VALUES (?, ?)", [nome,descricao]
    )

    return res.status(201).json({id: resultado.insertId, nome, descricao})
})

app.listen(3000, () => console.log("API no ar"))