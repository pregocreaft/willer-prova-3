import express from 'express'
import pool from './db.js'
import cors from 'cors'
import bcrypt, { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

const JWT_SECRET = "senhawiller"

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.get('/', (req, res) => {
    res.redirect('/login.html')
})

app.use(express.static('public'))

const PORT = 3000

function authToken(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Acesso negado."
        })
    }

    try{
        const userJWT = jwt.verify(token, JWT_SECRET)
        req.userJWT = userJWT
        next()
    }catch(error){
        return res.status(403).json({
            message: "Token inválido."
        })
    }
}
// ROTA LOGIN - CRIA USUARIO

app.post('/registro', async (req, res) => {
    const {nome, login, senha} = req.body
    try{
        if(!nome || !login || !senha){
            return res.status(400). json({
                erro: "Nome, login e senha são obrigatórios!"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const senhaHashed = await bcrypt.hash(senha, salt)
        const resultado = await pool.query('INSERT INTO usuario (nome, login, senha) VALUES ($1, $2, $3) RETURNING id, nome, login', [nome, login, senhaHashed])

        res.json(resultado.rows[0])
    }catch(erro){
        res.json({message: "erro"})
    }
})


app.post('/login', async (req, res) => {
    const {login, senha} = req.body
    const resultado = await pool.query('SELECT * FROM usuario WHERE login = $1', [login])

    if(resultado.rows.length === 0){
        return res.status(401).json({
            erro: "Login e senha inválidos."
        })
    }

    const usuario = resultado.rows[0]

    const senhaCerta = await bcrypt.compare(senha, usuario.senha)

    if(!senhaCerta){
        return res.status(401).json({
            erro: "Login e senha inválidos."
        })
    }

    const token = jwt.sign(
        {id: usuario.id, email: usuario.email},
        JWT_SECRET,
        {expiresIn: "1h"}
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 60 
    })

    return res.status(200).json({
        messagem: "Login realizado com sucesso.",
        user: {
            "nome": usuario.nome
        }
    })
})

// ROTAS CLIENTES

app.get('/cliente', authToken, async (req, res) => {
    const clientes = await pool.query('SELECT id, nome, cpf, telefone FROM cliente')
    res.json(clientes.rows)
})

app.post('/cliente', authToken, async (req, res) => {
    const {nome, cpf, telefone} = req.body

    const novoCliente = await pool.query('INSERT INTO cliente (nome, cpf, telefone) VALUES ($1, $2, $3) RETURNING *', [nome, cpf, telefone])

    res.json(novoCliente.rows[0])
})

app.put('/cliente/:id', authToken, async (req, res) => {
    const {id} = req.params

    const {nome, cpf, telefone} = req.body

    const attCliente = await pool.query('UPDATE cliente SET nome = $1, cpf = $2, telefone = $3 WHERE id = $4 RETURNING *', [nome, cpf, telefone, id])

    res.json(attCliente.rows[0])
})

app.delete('/cliente/:id', authToken, async (req, res) => {
    const {id} = req.params

    const deletarCliente = await pool.query('DELETE FROM cliente WHERE id = $1 RETURNING *', [id])

    res.json(deletarCliente.rows[0])
})

// ROTAS AGENDAMENTO

app.get('/agendamento', authToken, async (req, res) => {
    const resultado = await pool.query(`
        SELECT
            agendamento.id,
            TO_CHAR(agendamento.data_agendamento, 'YYYY-MM-DD') AS data_agendamento,
            agendamento.servico,
            agendamento.id_veiculo,
            veiculo.id_cliente,
            cliente.nome AS cliente,
        FROM agendamento
        ORDER BY agendamento.data_agendamento
    `)

    res.json(resultado.rows)
})

app.post('/agendamento', authToken, async (req, res) => {
    const {data_agendamento, servico, id_veiculo, id_cliente} = req.body

    const novoAgendamento = await pool.query('INSERT INTO agendamento (data_agendamento, servico, id_veiculo) VALUES ($1, $2, $3) RETURNING *',
        [data_agendamento, servico, id_veiculo])

    res.json(novoAgendamento.rows[0])
})

app.put('/agendamento/:id', authToken, async (req, res) => {
    const {id} = req.params

    const {data_agendamento, servico, id_veiculo, id_cliente} = req.body

    const attAgendamento = await pool.query('UPDATE agendamento SET data_agendamento = $1, servico = $2, id_veiculo = $3 WHERE id = $4 RETURNING *',
        [data_agendamento, servico, id_veiculo, id])

    res.json(attAgendamento.rows[0])
})

app.delete('/agendamento/:id', authToken, async (req, res) => {
    const {id} = req.params

    const deletarAgendamento = await pool.query('DELETE FROM agendamento WHERE id = $1 RETURNING *', [id])

    res.json(deletarAgendamento.rows[0])
})


app.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})