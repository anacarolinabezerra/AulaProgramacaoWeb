/* ==========================================================================
   ATIVIDADE 3 & 4: ARQUIVO JAVASCRIPT - ONG PATINHAS DE AMOR
   (Versão Final Definitiva - Corrige o bug do SPA com links âncora #)
   ==========================================================================
*/

/**
 * Ponto de entrada principal.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia os scripts do <header> (Menu e Tema). Roda SÓ UMA VEZ.
    initHeaderScripts();
    
    // 2. Inicia o sistema de SPA (Single Page Application).
    initSPA();
    
    // 3. Inicia os scripts do <main> (Formulário) para a página inicial.
    initPageScripts();
});

/**
 * Função para scripts do HEADER. Roda apenas UMA VEZ na carga do site.
 */
function initHeaderScripts() {
    initMobileMenu();
    initThemeToggle();
}

/**
 * Função para scripts do MAIN. Roda CADA VEZ que o <main> é trocado.
 */
function initPageScripts() {
    // MÓDULO: FORMULÁRIO (Validação e Máscaras)
    initFormValidation();
}

/* ==========================================================================
   1. MÓDULO: NAVEGAÇÃO SPA (Single Page App)
   ==========================================================================
*/

function initSPA() {
    // 1. Intercepta todos os links com a classe .spa-link
    document.body.addEventListener('click', event => {
        const target = event.target.closest('a.spa-link');
        
        if (target) {
            event.preventDefault(); // Previne a navegação normal
            const url = target.getAttribute('href');
            loadPage(url);
        }
    });

    // 2. Lida com os botões de "Voltar" e "Avançar" do navegador
    window.addEventListener('popstate', event => {
        const path = event.state ? event.state.path : 'index.html';
        loadPage(path, true); // O 'true' impede de criar uma nova entrada no histórico
    });

    // 3. Salva o estado da página inicial no histórico
    history.replaceState({ path: window.location.pathname.split('/').pop() || 'index.html' }, '', window.location.href);
}


/**
 * Carrega o conteúdo de uma nova página e injeta no <main>
 * (Versão final: agora entende links âncora com '#')
 */
async function loadPage(url, isPopState = false) {
    try {
        // --- INÍCIO DA CORREÇÃO ---
        // 1. Divide a URL no nome da página e na âncora (#)
        // Ex: "projeto.html#resgate" vira pageUrl="projeto.html" e hash="resgate"
        const [pageUrl, hash] = url.split('#');
        // --- FIM DA CORREÇÃO ---

        // 2. Busca o conteúdo da página (ex: "projeto.html")
        const response = await fetch(pageUrl); // <-- CORRIGIDO: Busca só a página
        if (!response.ok) throw new Error(`Página não encontrada: ${pageUrl}`);
        
        const htmlString = await response.text();
        
        // 3. "Parseia" o texto HTML em um documento DOM virtual
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlString, 'text/html');
        
        // 4. Pega o novo <main> e o novo <title>
        const newMain = newDoc.getElementById('main-content');
        const newTitle = newDoc.title;

        if (newMain) {
            // 5. Injeta o novo conteúdo no <main> da página atual
            document.getElementById('main-content').innerHTML = newMain.innerHTML;
            
            // 6. Atualiza o título da página
            document.title = newTitle;
            
            // 7. Atualiza a classe 'active' no menu de navegação
            updateActiveNav(pageUrl); // <-- CORRIGIDO: Usa pageUrl, e não a url completa
            
            // 8. Atualiza a URL na barra do navegador (só se não for um 'popstate')
            if (!isPopState) {
                // Salva a URL completa (com o hash) no histórico
                history.pushState({ path: url }, newTitle, url); 
            }

            // 9. (Re)inicia os scripts do <main> (ex: formulário)
            initPageScripts();

            // --- INÍCIO DA CORREÇÃO ---
            // 10. Rola a página para a âncora (#) se ela existir
            if (hash) {
                // Encontra o elemento (ex: #resgate)
                const elementToScroll = document.getElementById(hash);
                if (elementToScroll) {
                    // Rola até ele
                    elementToScroll.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Se não tiver âncora, rola para o topo
                window.scrollTo(0, 0);
            }
            // --- FIM DA CORREÇÃO ---
        }
    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
}

/**
 * Atualiza qual link do menu está com a classe ".active"
 * (Versão final: agora entende links âncora com '#')
 */
function updateActiveNav(url) {
    const navLinks = document.querySelectorAll('nav a.spa-link');
    
    // Limpa o hash da URL da página atual para comparação
    // Ex: "projeto.html#resgate" vira "projeto.html"
    const pageName = url.split('#')[0].split('/').pop();

    navLinks.forEach(link => {
        // Limpa o hash do link que estamos checando
        const linkHref = link.getAttribute('href').split('#')[0].split('/').pop();

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

    if (menuToggleBtn && navMenu) {
        menuToggleBtn.addEventListener('click', () => {
            const isMenuOpen = navMenu.classList.toggle('show');
            
            if (isMenuOpen) {
                menuToggleBtn.setAttribute('aria-label', 'Fechar menu');
                menuToggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                menuToggleBtn.setAttribute('aria-label', 'Abrir menu');
                menuToggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Lógica do dropdown no mobile
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    dropdownContainers.forEach(container => {
        const mainLink = container.querySelector('a');

        mainLink.addEventListener('click', function(event) {
            // Verifica se está em modo mobile (se o menu-toggle está visível)
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle && window.getComputedStyle(menuToggle).display === 'block') {
                
                // Previne a navegação (seja SPA ou normal)
                event.preventDefault(); 
                
                // Fecha qualquer *outro* dropdown que esteja aberto
                document.querySelectorAll('.dropdown-container.open').forEach(c => {
                    if (c !== container) c.classList.remove('open');
                });

                // Abre ou fecha o *nosso* dropdown
                container.classList.toggle('open');
            }
        });
    });
}

/* ==========================================================================
   3. MÓDULO: FORMULÁRIO (Validação e Máscaras)
   ==========================================================================
*/

function initFormValidation() {
    const volunteerForm = document.getElementById('volunteerForm');
    
    if (!volunteerForm) {
        return; // Se não houver formulário nesta página, não faz nada.
    }

    volunteerForm.addEventListener('submit', handleSubmit);

    const inputCPF = document.getElementById('cpf');
    const inputCEP = document.getElementById('cep');
    const inputTelefone = document.getElementById('telefone');

    if(inputCPF) inputCPF.addEventListener('input', maskCPF);
    if(inputCEP) inputCEP.addEventListener('input', maskCEP);
    if(inputTelefone) inputTelefone.addEventListener('input', maskTelefone);
}

function handleSubmit(event) {
    event.preventDefault(); 

    const form = event.target;
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    errorMessage.innerHTML = '';

    const errors = validateForm(form);

    if (errors.length > 0) {
        errorMessage.style.display = 'block';
        let errorList = '<strong>Por favor, corrija os seguintes erros:</strong><ul>';
        errors.forEach(error => {
            errorList += `<li>${error}</li>`;
        });
        errorList += '</ul>';
        errorMessage.innerHTML = errorList;
        
    } else {
        successMessage.style.display = 'block';
        form.reset();
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
}

function validateForm(form) {
    const errors = [];
    const nome = form.elements['nome'].value;
    const cpf = form.elements['cpf'].value;

    if (nome.trim().split(' ').length < 2) {
        errors.push('O campo "Nome Completo" deve conter nome e sobrenome.');
    }

    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
        errors.push('O campo "CPF" está incompleto.');
    }
    return errors;
}

function maskCPF(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    event.target.value = value;
}

function maskCEP(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    event.target.value = value;
}

function maskTelefone(event) {
    let value = event.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    event.target.value = value;
}

/* ==========================================================================
   4. MÓDULO: TEMA (Modo Escuro)
   ==========================================================================
*/

function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    if (!themeToggleBtn) {
        return; // Botão não encontrado
    }
    
    // 1. Verifica o tema salvo no localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        // 2. Se não tiver nada salvo, verifica a preferência do Sistema Operacional
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    // 3. Adiciona o listener de clique no botão
    themeToggleBtn.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light'); // Salva a preferência
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark'); // Salva a preferência
        }
    });
}