# AulaProgramacaoWeb
# Projeto: Website da ONG Patinhas de Amor

Este é o meu projeto para a disciplina Desenvolvimento Front-End para Web, do curso de Análise e Desenvolvimento de Sistemas.

O objetivo foi construir um site completo para uma ONG fictícia de resgate de animais. O projeto foi dividido em 4 atividades, começando com um site simples em HTML e evoluindo até este resultado final: um site interativo, que funciona como um "Single Page Application" (SPA).

---

## Funcionalidades do Site

* **Navegação Rápida (SPA):** Ao clicar nos links do menu ("Início", "Projetos", "Cadastro"), o conteúdo da página muda instantaneamente, sem precisar recarregar o site. Isso foi feito com JavaScript!
* **Design Responsivo:** O site se adapta para funcionar bem em computadores, tablets e celulares.
* **Formulário Interativo:** Na página de cadastro, o formulário:
    * Mostra uma mensagem de **sucesso** ou **erro**.
    * Verifica se o nome tem sobrenome e se o CPF está completo.
    * Adiciona as máscaras (pontos e traços) automaticamente no CPF, CEP e Telefone.
* **Acessibilidade:**
    * **Modo Claro e Escuro:** Adicionei um botão (sol/lua) que troca o tema do site. A sua escolha fica salva no navegador!
    * **Contraste de Cores:** Ajustei as cores do site para garantir que o texto seja fácil de ler.
    * **Navegação pelo Teclado:** Você pode navegar por todo o site usando apenas a tecla "Tab".

---

## Tecnologias que Usei

Para construir este projeto, usei as três tecnologias principais do front-end:

* **HTML5:** Usei tags semânticas (como `<header>`, `<main>`, `<nav>`) para estruturar o site da forma correta.
* **CSS3:** Usei para estilizar tudo, incluindo:
    * Variáveis CSS (para organizar as cores e facilitar o Modo Escuro).
    * Flexbox e CSS Grid (para o layout responsivo).
* **JavaScript:** Usei para criar toda a interatividade do site:
    * Manipulação do DOM (para fazer o site funcionar como uma SPA).
    * Eventos (para fazer os botões, o menu e o formulário funcionarem).
    * `localStorage` (para salvar a preferência do Modo Escuro).

---

## Como Rodar o Projeto

Como é um projeto de front-end, nada precisa ser instalado.

A forma mais fácil de rodar é usando a extensão **"Live Server"** no VSCode.
1.  Com a extensão instalada, basta clicar com o botão direito no arquivo `index.html`.
2.  Selecione "Open with Live Server".
3.  Pronto! O site vai abrir no seu navegador.