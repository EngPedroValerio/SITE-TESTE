// Arquivo script.js
console.log("Site carregado com sucesso!");

document.addEventListener('DOMContentLoaded', function() {

    // --- ATUALIZAÇÃO: Força a página a carregar no topo ---
    // Reseta o histórico de scroll do navegador para manual
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    // Leva a janela para o topo (posição 0, 0)
    window.scrollTo(0, 0);


    // --- ATUALIZAÇÃO: Lógica aprimorada para a seta de scroll ---
    const scrollArrow = document.querySelector('.scroll-down-arrow');
    const projectsSection = document.querySelector('#projetos');
    let isArrowHidden = false; // Flag para controlar o estado da seta

    // Função para esconder a seta de forma reutilizável
    const hideArrow = () => {
        if (!isArrowHidden) {
            scrollArrow.classList.add('hidden');
            isArrowHidden = true;
        }
    };

    // Evento de clique na seta
    if (scrollArrow && projectsSection) {
        scrollArrow.addEventListener('click', () => {
            const header = document.querySelector('.site-header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Esconde a seta após o clique
            hideArrow();
        });
    }

    // --- ATUALIZAÇÃO: Observador para esconder a seta ao rolar até a seção de projetos ---
    const projectSectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se a seção de projetos estiver visível e a seta ainda não foi escondida
            if (entry.isIntersecting && !isArrowHidden) {
                hideArrow();
                // Para de observar após a primeira vez para economizar recursos
                observer.unobserve(projectsSection);
            }
        });
    }, {
        threshold: 0.1 // Ativa quando 10% da seção estiver visível
    });

    // Inicia a observação da seção de projetos
    if (projectsSection) {
        projectSectionObserver.observe(projectsSection);
    }


    // --- LÓGICA PARA ANIMAÇÃO DE SCROLL (DAS SEÇÕES) ---
    const revealSections = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, 
        threshold: 0.15, 
    });
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });

    // --- LÓGICA PARA SCROLL SUAVE COM HEADER FIXO ---
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.site-header');
    if (header) {
        const headerHeight = header.offsetHeight;
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return; 
                }
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    // --- LÓGICA DO ACORDEÃO (MÉTODO) ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const content = item.querySelector('.accordion-content');
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });
    
    // --- LÓGICA DO CARROSSEL DE PROJETOS ---
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const projects = [
            { src: 'imagens/projeto1.PNG', name: 'Casa A&P', area: '225m²', location: 'Catalão - GO' },
            { src: 'imagens/projeto2.PNG', name: 'Casa Lazer', area: '150m²', location: 'Bauru - RJ' },
            { src: 'imagens/projeto3.PNG', name: 'Casa C7', area: '162m²', location: 'Ipatinga - MG' },
            { src: 'imagens/projeto4.PNG', name: 'Casa M&D', area: '135m²', location: 'São Francisco do Sul - SC' },
            { src: 'imagens/projeto5.PNG', name: 'Casa P6', area: '155m²', location: 'Londrina - PR' },
            { src: 'imagens/projeto6.PNG', name: 'Residência V&N', area: '180m²', location: 'Igrejinha - RS' },
            { src: 'imagens/projeto7.PNG', name: 'Casa FS', area: '255m²', location: 'Senador La Rocque - MA' }
        ];

        projects.forEach(project => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            const img = document.createElement('img');
            img.src = project.src;
            img.alt = `Projeto ${project.name}`;
            img.loading = 'lazy';
            img.onerror = function() { this.src = 'https://placehold.co/520x680/101010/FFFFFF?text=Erro'; };
            const info = document.createElement('div');
            info.className = 'project-info';
            info.innerHTML = `
                <h3>${project.name} | ${project.area}</h3>
                <p>${project.location}</p>
            `;
            slide.appendChild(img);
            slide.appendChild(info);
            carousel.appendChild(slide);
        });

        const slides = document.querySelectorAll('.slide');
        let currentIndex = 0;
        let autoPlayInterval;

        function updateCarousel() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev-slide', 'next-slide', 'prev-outer-slide', 'next-outer-slide');
                const totalSlides = slides.length;
                if (index === currentIndex) { slide.classList.add('active'); } 
                else if (index === (currentIndex - 1 + totalSlides) % totalSlides) { slide.classList.add('prev-slide'); } 
                else if (index === (currentIndex + 1) % totalSlides) { slide.classList.add('next-slide'); } 
                else if (index === (currentIndex - 2 + totalSlides) % totalSlides) { slide.classList.add('prev-outer-slide'); } 
                else if (index === (currentIndex + 2) % totalSlides) { slide.classList.add('next-outer-slide'); }
            });
        }
        function showNext() { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }
        function showPrev() { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateCarousel(); }
        function startAutoPlay() { autoPlayInterval = setInterval(showNext, 3500); }
        function stopAutoPlay() { clearInterval(autoPlayInterval); }
        nextBtn.addEventListener('click', () => { showNext(); stopAutoPlay(); startAutoPlay(); });
        prevBtn.addEventListener('click', () => { showPrev(); stopAutoPlay(); startAutoPlay(); });
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        updateCarousel();
        startAutoPlay();
    }

    // --- LÓGICA DO FORMULÁRIO DE CONTATO ---
    const form = document.getElementById('contact-form');
    if (form) {
        const whatsappInput = document.getElementById('whatsapp');
        const successMessage = document.getElementById('success-message');

        whatsappInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); 
            value = value.substring(0, 11); 
            if (value.length > 10) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 5) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d*)/, '($1) $2');
            } else {
                value = value.replace(/^(\d*)/, '($1');
            }
            e.target.value = value;
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            let isValid = true;
            successMessage.classList.remove('visible'); 

            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const group = field.parentElement;
                const errorMsg = group.querySelector('.error-message');
                group.classList.remove('invalid');
                errorMsg.textContent = '';
                if (field.value.trim() === '') {
                    isValid = false;
                    group.classList.add('invalid');
                    errorMsg.textContent = 'Este campo é obrigatório.';
                }
            });

            const emailField = document.getElementById('email');
            const emailGroup = emailField.parentElement;
            if (emailField.value.trim() !== '') {
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailGroup.classList.add('invalid');
                    emailGroup.querySelector('.error-message').textContent = 'Por favor, insira um e-mail válido.';
                }
            }
            
            if (isValid) {
                console.log('Formulário válido. Enviando dados...');
                successMessage.textContent = 'Obrigado pelo contato, o sonho da sua casa já está mais próximo!';
                successMessage.classList.add('visible');
                form.reset(); 
            }
        });
    }
});
