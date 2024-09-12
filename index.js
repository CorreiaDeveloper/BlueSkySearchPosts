import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Função para criar uma nova sessão e retornar o token
async function criarSessao(handle, senha) {
    const url = 'https://bsky.social/xrpc/com.atproto.server.createSession';
    const body = {
        identifier: handle,
        password: senha
    };

    try {
        const response = await axios.post(url, body, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200 && response.data.accessJwt) {
            return response.data.accessJwt;
        } else {
            throw new Error('Bearer não encontrado na resposta');
        }
    } catch (error) {
        throw new Error('Erro ao criar sessão: ' + error.message);
    }
}

// Rota para login
app.post('/login', async (req, res) => {
    const { handle, senha } = req.body;

    try {
        const token = await criarSessao(handle, senha);
        res.status(200).json({ token: token });
    } catch (error) {
        console.error('Erro ao criar sessão:', error);
        res.status(500).json({ error: error.message });
    }
});

// Função para buscar publicações
async function buscarPublicacoes(termo, token, desde, ate, ordenacao = 'top', limite = 100) {
    const url = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts';
    let todasPublicacoes = [];
    let cursor = null;

    while (true) {
        const params = {
            q: termo,
            sort: ordenacao,
            since: desde,
            until: ate,
            limit: limite
        };

        if (cursor) {
            params.cursor = cursor;
        }

        try {
            const response = await axios.get(url, {
                params,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                const publicacoes = response.data.posts || [];
                if (publicacoes.length === 0) break;

                todasPublicacoes = todasPublicacoes.concat(publicacoes);
                cursor = response.data.cursor;

                if (!cursor) break;

                await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa de 1 segundo
            } else {
                console.warn(`Erro ao buscar publicações com o termo: ${termo}. Código de status: ${response.status}`);
                break;
            }
        } catch (error) {
            console.warn(`Erro ao enviar solicitação para a API: ${error.message}`);
            break;
        }
    }

    return todasPublicacoes;
}

// Rota para buscar publicações
app.post('/buscar-publicacoes', async (req, res) => {
    const { termo, inicio, fim } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Recupera o token do cabeçalho

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    try {
        const publicacoes = await buscarPublicacoes(termo, token, inicio, fim);
        res.status(200).json(publicacoes); // Retorna os dados como JSON
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        res.status(500).json({ error: error.message });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
