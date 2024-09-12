document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const handle = document.getElementById('handle').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifier: handle, password: password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.accessJwt); // Armazena o token no localStorage
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('data-screen').style.display = 'block';
        } else {
            const errorData = await response.json();
            alert(`Login falhou. Erro: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        alert('Erro ao tentar fazer login.');
    }
});

document.getElementById('data-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const term = document.getElementById('term').value;
    const startDate = new Date(document.getElementById('start-date').value).toISOString();
    const endDate = new Date(document.getElementById('end-date').value).toISOString();
    const token = localStorage.getItem('authToken');

    console.log('Termo:', term);
    console.log('Início:', startDate);
    console.log('Fim:', endDate);

    try {
        const response = await fetch('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?' + new URLSearchParams({
            q: term,
            sort: 'top',
            since: startDate,
            until: endDate,
            limit: 100
        }), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            atualizarTabela(data.posts); // Atualiza a tabela com os dados recebidos
        } else {
            const errorData = await response.json();
            console.error('Erro ao buscar publicações:', errorData.message);
        }
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
    }
});

// Função para atualizar a tabela
function atualizarTabela(posts) {
    const tbody = document.querySelector('#resultados tbody');
    tbody.innerHTML = ''; // Limpa a tabela

    // Variáveis para armazenar os totais
    let totalReplyCount = 0;
    let totalRepostCount = 0;
    let totalLikeCount = 0;
    let totalQuoteCount = 0;
    let totalRegistroCount = 0; // Adicionada variável para o total de registros

    posts.forEach(post => {
        const tr = document.createElement('tr');
        const uriText = post.record?.text || 'Não disponível';
        const limitCaracter = 80;
        
        const truncatedUriText = uriText.length > limitCaracter ? uriText.substring(0, limitCaracter) + '...' : uriText;

        // Valores da postagem
        const replyCount = post.replyCount || 0;
        const repostCount = post.repostCount || 0;
        const likeCount = post.likeCount || 0;
        const quoteCount = post.quoteCount || 0;
        const registroCount = post.record?.$type ? 1 : 0; // Adicionada lógica para contar registros

        // Atualiza os totais
        totalReplyCount += replyCount;
        totalRepostCount += repostCount;
        totalLikeCount += likeCount;
        totalQuoteCount += quoteCount;
        totalRegistroCount += registroCount; // Atualiza o total de registros

        tr.innerHTML = `
            <td class="truncate">${truncatedUriText}</td>
            <td class="hide-on-small">${post.author?.handle || 'Não disponível'}</td>
            <td class="hide-on-small">${post.record?.$type || 'Não disponível'}</td>
            <td class="hide-on-small">${replyCount}</td>
            <td class="hide-on-small">${repostCount}</td>
            <td class="hide-on-small">${likeCount}</td>
            <td class="hide-on-small">${quoteCount}</td>
        `;
        tbody.appendChild(tr);
    });

    // Adiciona a linha de totais
    const footerRow = document.createElement('tr');
    footerRow.innerHTML = `
        <td>Total</td>
        <td></td>
        <td></td>
        <td>${totalReplyCount}</td>
        <td>${totalRepostCount}</td>
        <td>${totalLikeCount}</td>
        <td>${totalQuoteCount}</td>
    `;
    tbody.appendChild(footerRow);
}


