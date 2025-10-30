/* ==========================================================================
   ATIVIDADE 3: ARQUIVO JAVASCRIPT - ONG PATINHAS DE AMOR
   ==========================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
    // Inicia o sistema de SPA (Single Page Application)
    initSPA();
    
    // Inicia os scripts da página atual (menu, formulários, etc.)
    // Isso precisa ser chamado na carga inicial E a cada navegação da SPA
    initPageScripts();
});

/**
 * Função global para (re)iniciar scripts que dependem do conteúdo do <main>.
 * Isso é crucial para a SPA, pois o conteúdo do <main> é trocado.
 */
function initPageScripts() {
    // MÓDULO: NAVEGAÇÃO RESPONSIVA (Mobile)
    initMobileMenu();

    // MÓDULO: FORMULÁRIO (Validação e Máscaras)
    initFormValidation();
}

/* ==========================================================================
   1. MÓDULO: NAVEGAÇÃO SPA (Single Page App)
   Cumpre: "Implementar sistema de SPA básico" e "Sistema de templates"
   ==========================================================================
*/

function initSPA() {
    // 1. "Hijack" (interceptar) todos os links com a classe .spa-link
    document.body.addEventListener('click', event => {
        const target = event.target.closest('a.spa-link');
        
        if (target) {
            event.preventDefault(); // Previne a navegação normal
            const url = target.getAttribute('href');
            loadPage(url);
        }
    });

    // 2. Lidar com os botões de "Voltar" e "Avançar" do navegador
    window.addEventListener('popstate', event => {
        // Se o estado (history) tiver um 'path', carrega ele.
        // Senão, carrega a página inicial (caso especial de 'Voltar' para o início)
        const path = event.state ? event.state.path : 'index.html';
        loadPage(path, true); // O 'true' impede de criar uma nova entrada no histórico
    });

    // 3. Salva o estado da página inicial no histórico
    history.replaceState({ path: window.location.pathname.split('/').pop() || 'index.html' }, '', window.location.href);
}

/**
 * Carrega o conteúdo de uma nova página e injeta no <main>
 * @param {string} url - A URL da página a ser carregada (ex: "projeto.html")
 * @param {boolean} isPopState - Flag para saber se é uma navegação de histórico (Voltar/Avançar)
 */
async function loadPage(url, isPopState = false) {
    try {
        // 1. Busca o conteúdo da nova página
        const response = await fetch(url);
        if (!response.ok) throw new Error('Página não encontrada');
        
        const htmlString = await response.text();
        
        // 2. "Parseia" o texto HTML em um documento DOM virtual
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlString, 'text/html');
        
        // 3. Pega o novo <main> e o novo <title>
        const newMain = newDoc.getElementById('main-content');
        const newTitle = newDoc.title;

        if (newMain) {
            // 4. Injeta o novo conteúdo no <main> da página atual
            document.getElementById('main-content').innerHTML = newMain.innerHTML;
            
            // 5. Atualiza o título da página
            document.title = newTitle;
            
            // 6. Atualiza a classe 'active' no menu de navegação
            updateActiveNav(url);
            
            // 7. Atualiza a URL na barra do navegador (só se não for um 'popstate')
            if (!isPopState) {
                history.pushState({ path: url }, newTitle, url);
            }

            // 8. Roda os scripts novamente para o novo conteúdo (MUITO IMPORTANTE)
            initPageScripts();

            // 9. Rola a página para o topo
            window.scrollTo(0, 0);
        }
    } catch (error) {
        console.error('Erro ao carregar página:', error);
        // Em um app real, mostraríamos uma mensagem de erro ao usuário
    }
}

/**
 * Atualiza qual link do menu está com a classe ".active"
 * @param {string} url - A URL da página que acabou de ser carregada
 */
function updateActiveNav(url) {
    const navLinks = document.querySelectorAll('nav a.spa-link');
    
    navLinks.forEach(link => {
        // Pega o href do link (ex: "projeto.html")
        const linkHref = link.getAttribute('href').split('/').pop();
        // Pega o nome do arquivo da url (ex: "projeto.html")
        const pageName = url.split('/').pop();

        if (linkHref === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


/* ==========================================================================
   2. MÓDULO: NAVEGAÇÃO RESPONSIVA (Mobile)
   ==========================================================================
*/

function initMobileMenu() {
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navMenu = document.getElementById('navMenu');

    // Só adiciona o listener se o botão existir na página
    if (menuToggleBtn && navMenu) {
        menuToggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    // Lógica do dropdown no mobile (requer clique, não hover)
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    dropdownContainers.forEach(container => {
        const mainLink = container.querySelector('a');

        mainLink.addEventListener('click', function(event) {
            // Verifica se está em modo mobile (se o menu-toggle está visível)
            if (window.getComputedStyle(menuToggleBtn).display === 'block') {
                
                // Previne o link de navegar (para abrir o submenu)
                // A menos que seja um link da SPA (que não tem dropdown)
                if (!mainLink.classList.contains('spa-link')) {
                    event.preventDefault();
                    // Fecha outros dropdowns abertos
                    document.querySelectorAll('.dropdown-container.open').forEach(c => {
                        if (c !== container) c.classList.remove('open');
                    });
                    // Abre/fecha este dropdown
                    container.classList.toggle('open');
                }
            }
        });
    });
}

/* ==========================================================================
   3. MÓDULO: FORMULÁRIO (Validação e Máscaras)
   Cumpre: "Sistema de verificação de consistência de dados" e "Aviso"
   ==========================================================================
*/

function initFormValidation() {
    const volunteerForm = document.getElementById('volunteerForm');
    
    // Se o formulário não existir nesta página, não faz nada.
    if (!volunteerForm) {
        return;
    }

    // 1. Adiciona o listener de 'submit'
    volunteerForm.addEventListener('submit', handleSubmit);

    // 2. Adiciona as máscaras de input (Requisito da Atividade 1)
    const inputCPF = document.getElementById('cpf');
    const inputCEP = document.getElementById('cep');
    const inputTelefone = document.getElementById('telefone');

    if(inputCPF) inputCPF.addEventListener('input', maskCPF);
    if(inputCEP) inputCEP.addEventListener('input', maskCEP);
    if(inputTelefone) inputTelefone.addEventListener('input', maskTelefone);
}

/**
 * Função principal que é chamada quando o formulário é enviado.
 */
function handleSubmit(event) {
    event.preventDefault(); // Previne o envio real

    const form = event.target;
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Limpa mensagens antigas
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    errorMessage.innerHTML = '';

    // Validação de consistência
    const errors = validateForm(form);

    if (errors.length > 0) {
        // ERRO: Mostra os erros
        errorMessage.style.display = 'block';
        let errorList = '<strong>Por favor, corrija os seguintes erros:</strong><ul>';
        errors.forEach(error => {
            errorList += `<li>${error}</li>`;
        });
        errorList += '</ul>';
        errorMessage.innerHTML = errorList;
        
    } else {
        // SUCESSO: Mostra a mensagem de sucesso
        successMessage.style.display = 'block';
        form.reset(); // Limpa o formulário
        
        // Esconde a mensagem de sucesso após 5 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
}

/**
 * Validação de consistência de dados
 * @param {HTMLFormElement} form - O elemento do formulário
 * @returns {string[]} - Um array de mensagens de erro. Vazio se for válido.
 */
function validateForm(form) {
    const errors = [];
    const nome = form.elements['nome'].value;
    const cpf = form.elements['cpf'].value;

    // 1. Consistência: Verifica se o nome completo tem pelo menos 2 palavras
    if (nome.trim().split(' ').length < 2) {
        errors.push('O campo "Nome Completo" deve conter nome e sobrenome.');
    }

    // 2. Consistência: Verifica se o CPF, sem a máscara, tem 11 dígitos
    const cpfNumeros = cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (cpfNumeros.length !== 11) {
        errors.push('O campo "CPF" está incompleto.');
    }


    return errors;
}


// --- Funções de Máscara (Requisito da Atividade) ---

function maskCPF(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Ponto após 3º dígito
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Ponto após 6º dígito
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Hífen após 9º dígito
    event.target.value = value;
}

function maskCEP(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/^(\d{5})(\d)/, "$1-$2"); // Hífen após 5º dígito
    event.target.value = value;
}

function maskTelefone(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, ""); // Remove tudo que não é dígito
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); // Parênteses nos 2 primeiros
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Hífen após o 5º dígito (celular)
    event.target.value = value;
}