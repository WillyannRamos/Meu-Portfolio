const express = require('express');
const path = require('path');
const { db } = require('./firebase.js');
const { collection, addDoc } = require('firebase/firestore');

const app = express();
const porta = 3000;

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
app.post('/salvar', async (req, res) => {
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

    try {
        await addDoc(collection(db, "clientes"), {
            nome: nome,
            email: email,
            assunto: '',
            mensagem: '',
            data: new Date()
        });
        console.log('✅ Cliente salvo no Firestore');
        res.redirect('/sucesso.html');
    } catch (erro) {
        console.error('❌ Erro ao salvar:', erro);
        return res.send(`
            <html><body style="text-align:center; padding:50px; font-family:Arial;">
                <h2>❌ Erro ao salvar</h2>
                <p>Não foi possível salvar seus dados.</p>
                <a href="/servicos.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">Voltar</a>
            </body></html>
        `);
    }
});

// ROTA 2 — FORMULÁRIO DE CONTATO (nome + email + assunto + mensagem)
app.post('/salvar-contato', async (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;

    if (!nome || !email || !assunto || !mensagem) {
        return res.send(`
            <html><body style="text-align:center; padding:50px; font-family:Arial;">
                <h2>⚠️ Preencha todos os campos!</h2>
                <a href="/contato.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">Voltar</a>
            </body></html>
        `);
    }

    try {
        await addDoc(collection(db, "clientes"), {
            nome: nome,
            email: email,
            assunto: assunto,
            mensagem: mensagem,
            data: new Date()
        });
        console.log('✅ Mensagem salva no Firestore | Assunto:', assunto);
        res.redirect('/sucesso.html');
    } catch (erro) {
        console.error('❌ Erro ao enviar mensagem:', erro);
        return res.send(`
            <html><body style="text-align:center; padding:50px; font-family:Arial;">
                <h2>❌ Erro ao enviar mensagem</h2>
                <p>Tente novamente mais tarde.</p>
                <a href="/contato.html" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">Voltar</a>
            </body></html>
        `);
    }
});

// INICIAR SERVIDOR
app.listen(porta, () => {
    console.log('\n======================================');
    console.log('🚀 SERVIDOR RODANDO!');
    console.log('🌐 http://localhost:' + porta);
    console.log('======================================\n');
});