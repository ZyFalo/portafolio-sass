/**
 * 🧭 Funcionalidad de la barra de navegación
 * 
 * Maneja el menú hamburguesa para dispositivos móviles
 * y mejora la experiencia de navegación.
 */

class Navigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    /**
     * 🚀 Inicializa la navegación
     */
    init() {
        if (this.navToggle && this.navMenu) {
            this.attachEventListeners();
        }
        this.setActiveLink();
    }
    
    /**
     * 🎯 Adjunta eventos a los elementos de navegación
     */
    attachEventListeners() {
        // Toggle del menú móvil
        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Cerrar menú al hacer clic en un enlace (móvil)
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
        
        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    /**
     * 📱 Alterna el menú móvil
     */
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Prevenir scroll del body cuando el menú está abierto
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    /**
     * ❌ Cierra el menú móvil
     */
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    /**
     * 🎯 Establece el enlace activo basado en la página actual
     */
    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html') ||
                (currentPage === 'sign_up.html' && linkHref === 'sign_up.html')) {
                link.classList.add('active');
            }
        });
    }
}

// 🚀 Inicializar la navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    console.log('🧭 Navegación inicializada correctamente');
});
