# Bluesky Find Posts

Este projeto é uma aplicação web para interagir com a plataforma Bluesky. A aplicação inclui uma interface de login e uma interface para buscar publicações usando a API da Bluesky.

## Índice

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Contribuição](#contribuição)

## Descrição

O projeto é composto por um backend em Express e um frontend em HTML/CSS/JavaScript. O backend gerencia a autenticação e busca de publicações, enquanto o frontend fornece a interface de usuário.

## Funcionalidades

- **Login:** Autentica o usuário na plataforma Bluesky e armazena o token de autenticação no `localStorage`.
- **Busca de Publicações:** Permite buscar publicações na plataforma Bluesky com base em um termo, intervalo de datas e outros parâmetros.
- **Interface de Usuário:** Fornece uma interface web para realizar login e buscar publicações, com uma tabela para exibir os resultados.

## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados. Além disso, você precisará das seguintes dependências:

- `Node.js`
- `atproto-firehose`
- `@atproto/api`

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/CorreiaDeveloper/BlueSkySearchPosts.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd seu_repositorio
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

## Uso

Inicie o servidor backend:
```bash
node index.js
```
ou

```bash
npm start
```

## Contribuição
Se você deseja contribuir para este projeto, siga estas etapas:

1. Faça um fork do repositório.

2. Crie uma branch para suas alterações:
```bash
git checkout -b minha-alteracao
```
3. Faça suas alterações e commit:
```bash
git commit -am 'Adiciona nova funcionalidade'
```
4. Envie para o repositório remoto:
```bash
git push origin minha-alteracao
```
5. Crie uma pull request no GitHub:

    - **Usando a Interface Gráfica do GitHub:**
      - Vá até o repositório no GitHub.
      - Navegue para a aba "Pull requests".
      - Clique no botão "New pull request".
      - Selecione a branch que você criou e clique em "Create pull request".

    - **Usando a CLI do GitHub:**
      - Instale a CLI do GitHub, se ainda não tiver:
        ```bash
        gh extension install cli/gh-pull-request
        ```
      - Navegue até o diretório do seu repositório local e crie a pull request:
        ```bash
        gh pr create --base main --head minha-alteracao --title "Título da Pull Request" --body "Descrição da Pull Request"