const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const porta = 3000;

// CONEXÃO COM MYSQL
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'meu_site_db'
});

// TESTAR CONEXÃO
db.connect((erro) => {
    if (erro) {
        console.error('\n❌ ERRO AO CONECTAR AO MYSQL');
        console.error(erro.message);
        return;
    }
    console.log('\n✅ BANCO DE DADOS CONECTADO COM SUCESSO!\n');
});

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// PÁGINA INICIAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// PÁGINA DE SUCESSO
app.get('/sucesso.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sucesso.html'));
});

// ROTA 1 — FORMULÁRIO DE SERVIÇOS (nome + email)
app.post('/salvar', (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.send(`
            <html><body style="text-align:center; padding:50px; font-family:Arial;">
                <h2>⚠️ Dados incompletos</h2>
                <p>Por favor, preencha nome e e-mail.</p>
                <a href="/servicos.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">Voltar</a>
            </body></html>
        `);
    }

    const sql = "INSERT INTO clientes (nome, email, assunto, mensagem) VALUES (?, ?, '', '')";
    db.query(sql, [nome, email], (erro, resultado) => {
        if (erro) {
            console.error(erro);
            return res.send(`
                <html><body style="text-align:center; padding:50px; font-family:Arial;">
                    <h2>❌ Erro ao salvar</h2>
                    <p>Não foi possível salvar seus dados.</p>
                    <a href="/servicos.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">Voltar</a>
                </body></html>
            `);
        }
        console.log('✅ Cliente salvo — ID:', resultado.insertId);
        res.redirect('/sucesso.html');
    });
});

// ROTA 2 — FORMULÁRIO DE CONTATO (nome + email + assunto + mensagem)
app.post('/salvar-contato', (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;

    if (!nome || !email || !assunto || !mensagem) {
        return res.send(`
            <html><body style="text-align:center; padding:50px; font-family:Arial;">
                <h2>⚠️ Preencha todos os campos!</h2>
                <a href="/contato.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">Voltar</a>
            </body></html>
        `);
    }

    const sql = "INSERT INTO clientes (nome, email, assunto, mensagem) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome, email, assunto, mensagem], (erro, resultado) => {
        if (erro) {
            console.error('❌ Erro ao salvar:', erro);
            return res.send(`
                <html><body style="text-align:center; padding:50px; font-family:Arial;">
                    <h2>❌ Erro ao enviar mensagem</h2>
                    <p>Verifique o banco de dados e tente novamente.</p>
                    <a href="/contato.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">Voltar</a>
                </body></html>
            `);
        }
        console.log('✅ Mensagem salva — ID:', resultado.insertId, '| Assunto:', assunto);
        res.redirect('/sucesso.html');
    });
});

// INICIAR SERVIDOR
app.listen(porta, () => {
    console.log('\n======================================');
    console.log('🚀 SERVIDOR RODANDO!');
    console.log(`🌐 http://localhost:${porta}`);
    console.log('======================================\n');
});