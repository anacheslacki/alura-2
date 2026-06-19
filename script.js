/* ============================
   SCRIPT PRINCIPAL - LÓGICA DO SITE
   ============================ */

// ====== FUNÇÃO: Scroll suave para seção
function scrollToSection(sectionId) {
    let element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ====== FUNÇÃO: Reseta o gráfico p5.js
function resetChart() {
    if (sketchInstance && sketchInstance.resetData) {
        sketchInstance.resetData();
        updateStatsDisplay();
        showNotification('Gráfico resetado com sucesso!', 'success');
    }
}

// ====== FUNÇÃO: Alterna animação
function toggleAnimation() {
    if (sketchInstance && sketchInstance.toggleAnimation) {
        sketchInstance.toggleAnimation();
        showNotification('Animação alternada!', 'info');
    }
}

// ====== FUNÇÃO: Atualiza velocidade da animação
function updateSpeed(value) {
    if (sketchInstance && sketchInstance.setSpeed) {
        sketchInstance.setSpeed(parseFloat(value));
    }
}

// ====== FUNÇÃO: Atualiza display de estatísticas
function updateStatsDisplay() {
    if (sketchInstance && sketchInstance.updateStats) {
        sketchInstance.updateStats(function(stats) {
            document.getElementById('volatility').textContent = stats.volatility + '%';
            document.getElementById('index').textContent = stats.current;
            document.getElementById('return').textContent = stats.returns + '%';
            document.getElementById('volume').textContent = (stats.volume / 1000).toFixed(1) + 'M';
        });
    }
}

// ====== FUNÇÃO: Atualiza stats a cada segundo
function startStatsUpdate() {
    setInterval(updateStatsDisplay, 1000);
}

// ====== FUNÇÃO: Notificações
function showNotification(message, type = 'info') {
    let notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos inline para notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ====== FUNÇÃO: Submissão do formulário
function handleFormSubmit(event) {
    event.preventDefault();
    
    let form = event.target;
    let formData = new FormData(form);
    
    // Simula envio
    showNotification('Mensagem enviada com sucesso! Obrigado por entrar em contato.', 'success');
    form.reset();
}

// ====== FUNÇÃO: Validação de entrada
function validateEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ====== FUNÇÃO: Análise de dados financeiros
function analyzeMarketData(prices) {
    if (!prices || prices.length === 0) return null;

    let min = Math.min(...prices);
    let max = Math.max(...prices);
    let average = prices.reduce((a, b) => a + b, 0) / prices.length;
    let volatility = ((max - min) / average * 100).toFixed(2);

    return {
        min: min.toFixed(2),
        max: max.toFixed(2),
        average: average.toFixed(2),
        volatility: volatility,
        trend: prices[prices.length - 1] > prices[0] ? 'Alta' : 'Queda'
    };
}

// ====== FUNÇÃO: Formata números em moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// ====== FUNÇÃO: Formata percentual
function formatPercentage(value) {
    return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
}

// ====== FUNÇÃO: Gera dados aleatórios para testes
function generateMockData(length = 30) {
    let data = [];
    let basePrice = 100;
    
    for (let i = 0; i < length; i++) {
        basePrice += (Math.random() - 0.5) * 5;
        basePrice = Math.max(50, Math.min(150, basePrice));
        data.push(parseFloat(basePrice.toFixed(2)));
    }
    
    return data;
}

// ====== FUNÇÃO: Log de eventos
function logEvent(eventName, eventData) {
    let timestamp = new Date().toLocaleTimeString('pt-BR');
    console.log(`[${timestamp}] ${eventName}:`, eventData);
}

// ====== FUNÇÃO: Inicializa o site
function initializeSite() {
    logEvent('Inicialização', 'Site carregado com sucesso');
    
    // Inicia atualização de stats
    startStatsUpdate();
    
    // Event listeners
    setupEventListeners();
    
    // Testa dados de mercado
    let mockData = generateMockData();
    let analysis = analyzeMarketData(mockData);
    logEvent('Análise de Mercado', analysis);
}

// ====== FUNÇÃO: Setup de event listeners
function setupEventListeners() {
    // Botão de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            let target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Validação de formulário
    let contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let emailInput = this.querySelector('input[type="email"]');
            if (emailInput && !validateEmail(emailInput.value)) {
                e.preventDefault();
                showNotification('Por favor, insira um email válido!', 'error');
            }
        });
    }

    // Slider de velocidade
    let speedSlider = document.getElementById('speedSlider');
    if (speedSlider) {
        speedSlider.addEventListener('change', function() {
            updateSpeed(this.value);
            logEvent('Velocidade Alterada', this.value);
        });
    }

    // Observador de viewport
    setupIntersectionObserver();
}

// ====== FUNÇÃO: Intersection Observer para animações
function setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        let options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        let observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);

        document.querySelectorAll('.analysis-card, .stat-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            observer.observe(card);
        });
    }
}

// ====== FUNÇÃO: Detecta modo escuro
function setupDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        logEvent('Sistema', 'Modo escuro detectado');
    }
}

// ====== FUNÇÃO: Performance monitoring
function monitorPerformance() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            let pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            logEvent('Performance', `Página carregada em ${pageLoadTime}ms`);
        });
    }
}

// ====== FUNÇÃO: Tratamento de erros
window.addEventListener('error', function(event) {
    logEvent('ERRO', event.message);
    showNotification('Ocorreu um erro. Por favor, recarregue a página.', 'error');
});

// ====== FUNÇÃO: Desativa notificações de erro (opcional)
window.addEventListener('unhandledrejection', function(event) {
    logEvent('Promessa Rejeitada', event.reason);
});

// ====== Adiciona estilos dinâmicos para notificações
let style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// ====== Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSite);
} else {
    initializeSite();
}

// ====== Setup adicional
setupDarkMode();
monitorPerformance();

// ====== Log de conclusão
console.log('%c🚀 Mercado Financeiro Dashboard', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cSite carregado com sucesso!', 'font-size: 14px; color: #764ba2;');
console.log('%cDesenvolvido com HTML, CSS, JavaScript e p5.js', 'font-size: 12px; color: #999;');
