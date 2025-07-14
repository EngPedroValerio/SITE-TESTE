// Arquivo script.js
console.log("Site carregado com sucesso!");

document.addEventListener('DOMContentLoaded', function() {

    // --- Força a página a carregar no topo ---
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);


    // --- Lógica da seta de scroll ---
    const scrollArrow = document.querySelector('.scroll-down-arrow');
    const projectsSection = document.querySelector('#projetos');
    let isArrowHidden = false; 

    const hideArrow = () => {
        if (!isArrowHidden) {
            scrollArrow.classList.add('hidden');
            isArrowHidden = true;
        }
    };

    if (scrollArrow && projectsSection) {
        scrollArrow.addEventListener('click', () => {
            const header = document.querySelector('.site-header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = projectsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            hideArrow();
        });
    }

    const projectSectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isArrowHidden) {
                hideArrow();
                observer.unobserve(projectsSection);
            }
        });
    }, {
        threshold: 0.1 
    });

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

    // --- LÓGICA DO ACORDEÃO (MÉTODO E FAQ) ---
    // Este código funciona para qualquer elemento com a classe .accordion-item
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const content = item.querySelector('.accordion-content');
            
            // Fecha outros itens abertos no mesmo container
            const parentContainer = item.closest('.accordion-container');
            if (parentContainer) {
                const allItems = parentContainer.querySelectorAll('.accordion-item');
                allItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    }
                });
            }

            // Abre ou fecha o item clicado
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
            { src: 'imagens/projeto1.png', name: 'Casa A&P', area: '225m²', location: 'Catalão - GO' },
            { src: 'imagens/projeto2.png', name: 'Casa Lazer', area: '150m²', location: 'Bauru - RJ' },
            { src: 'imagens/projeto3.png', name: 'Casa C7', area: '162m²', location: 'Ipatinga - MG' },
            { src: 'imagens/projeto4.png', name: 'Casa M&D', area: '135m²', location: 'São Francisco do Sul - SC' },
            { src: 'imagens/projeto5.png', name: 'Casa P6', area: '155m²', location: 'Londrina - PR' },
            { src: 'imagens/projeto6.png', name: 'Residência V&N', area: '180m²', location: 'Igrejinha - RS' },
            { src: 'imagens/projeto7.png', name: 'Casa FS', area: '255m²', location: 'Senador La Rocque - MA' }
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
        const statusMessage = document.getElementById('status-message'); 

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

        function validateForm() {
            let isValid = true;
            statusMessage.classList.remove('visible', 'success', 'error');

            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const group = field.parentElement;
                const errorMsg = group.querySelector('.error-message');
                group.classList.remove('invalid');
                if (errorMsg) errorMsg.textContent = '';
                
                if (field.value.trim() === '') {
                    isValid = false;
                    group.classList.add('invalid');
                    if (errorMsg) errorMsg.textContent = 'Este campo é obrigatório.';
                }
            });

            const emailField = document.getElementById('email');
            if (emailField.value.trim() !== '') {
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    const emailGroup = emailField.parentElement;
                    const errorMsg = emailGroup.querySelector('.error-message');
                    emailGroup.classList.add('invalid');
                    if(errorMsg) errorMsg.textContent = 'Por favor, insira um e-mail válido.';
                }
            }
            return isValid;
        }

        async function handleSubmit(event) {
            event.preventDefault();
            
            if (!validateForm()) {
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            const data = new FormData(event.target);
            
            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    statusMessage.textContent = "Obrigado pelo contato, o sonho da sua casa já está mais próximo!";
                    statusMessage.classList.add('visible', 'success');
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        const errorMessage = responseData["errors"].map(error => error["message"]).join(", ");
                        throw new Error(errorMessage);
                    }
                    throw new Error('Ocorreu um problema ao enviar o formulário.');
                }
            } catch (error) {
                statusMessage.textContent = "Oops! Houve um erro ao enviar sua mensagem. Tente novamente mais tarde.";
                statusMessage.classList.add('visible', 'error');
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        }

        form.addEventListener("submit", handleSubmit);
    }
});
