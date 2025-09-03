/**
 * 📝 Validación de Formulario de Registro de Usuario
 * 
 * Este script implementa validaciones completas para un formulario de registro
 * utilizando JavaScript Vanilla y expresiones regulares.
 * 
 * Autor: William Peña
 * Fecha: Agosto 2025
 */

class FormValidator {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        
        // 🔍 Expresiones regulares para validaciones detalladas
        this.patterns = {
            /* 
             * 📧 VALIDACIÓN DE EMAIL:
             * ^[a-zA-Z0-9._%+-]+ = Inicio con letras, números y caracteres especiales permitidos
             * @ = Debe contener exactamente un símbolo @
             * [a-zA-Z0-9.-]+ = Dominio con letras, números, puntos y guiones
             * \. = Punto literal antes de la extensión
             * [a-zA-Z]{2,}$ = Extensión de al menos 2 letras al final
             */
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            
            /* 
             * 🔒 VALIDACIÓN DE CONTRASEÑA (Seguridad alta):
             * (?=.*[a-z]) = Lookahead positivo: debe contener al menos una minúscula
             * (?=.*[A-Z]) = Lookahead positivo: debe contener al menos una mayúscula  
             * (?=.*\d) = Lookahead positivo: debe contener al menos un dígito
             * (?=.*[@$!%*?&]) = Lookahead positivo: debe contener al menos un carácter especial
             * [A-Za-z\d@$!%*?&]{8,} = Solo permite estos caracteres, mínimo 8 de longitud
             */
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            
            /* 
             * 📱 VALIDACIÓN CELULAR COLOMBIANO:
             * ^3 = Debe empezar exactamente con el número 3
             * [0-9]{9}$ = Seguido de exactamente 9 dígitos más (total: 10 dígitos)
             * Formato: 3XXXXXXXXX (ej: 3123456789)
             */
            mobile: /^3[0-9]{9}$/,
            
            /* 
             * ☎️ VALIDACIÓN TELÉFONO GENERAL:
             * ^[0-9]{10,}$ = Solo números, mínimo 10 dígitos
             * Acepta teléfonos fijos y móviles de cualquier longitud >= 10
             */
            phone: /^[0-9]{10,}$/,
            
            /* 
             * 👤 VALIDACIÓN NOMBRE COMPLETO:
             * ^[a-zA-Z = Letras minúsculas y mayúsculas del alfabeto inglés
             * áéíóúÁÉÍÓÚñÑ = Caracteres especiales del español (tildes y eñe)
             * \s = Espacios en blanco permitidos
             * ]{3,}$ = Mínimo 3 caracteres de los anteriores
             */
            fullName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/
        };
        
        // 📊 Estado de validación de cada campo
        // Este objeto mantiene el estado actual de cada validación
        // true = campo válido, false = campo inválido
        this.fieldValidation = {
            fullName: false,        // ❌ Inválido hasta que el usuario ingrese un nombre válido
            email: false,           // ❌ Inválido hasta que el usuario ingrese un email válido
            password: false,        // ❌ Inválido hasta que cumpla todos los requisitos
            confirmPassword: false, // ❌ Inválido hasta que coincida con la contraseña
            birthDate: false,       // ❌ Inválido hasta que sea mayor de 18 años
            mobile: false,          // ❌ Inválido hasta que sea formato colombiano correcto
            phone: true,            // ✅ Válido por defecto (campo OPCIONAL)
            terms: false,           // ❌ Inválido hasta que acepte términos y condiciones
            recaptcha: false        // ❌ Inválido hasta que se complete el reCAPTCHA
        };

        // 🤖 Configuración de reCAPTCHA
        this.recaptchaConfig = {
            siteKey: '6LeWRbwrAAAAAKNZJEJaDgjB9MuWQFAmpmO712Xv',
            backendUrl: this.getBackendUrl(),
            isLoaded: false,
            widget: null
        };
        
        this.init();
    }

    /**
     * 🌐 DETECTA LA URL DEL BACKEND AUTOMÁTICAMENTE
     * 
     * LÓGICA:
     * - En desarrollo local: usa localhost:8000
     * - En Railway: usa la URL del dominio actual + /validate-recaptcha
     * - Detecta automáticamente el entorno basándose en el hostname
     */
    getBackendUrl() {
        const hostname = window.location.hostname;
        
        // 🏠 Desarrollo local
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168')) {
            return 'http://localhost:8000/validate-recaptcha';
        }
        
        // ☁️ Producción (Railway o cualquier otro hosting)
        // Usa el mismo dominio pero con el endpoint de la API
        const protocol = window.location.protocol; // http: o https:
        const host = window.location.host; // dominio + puerto si existe
        return `${protocol}//${host}/validate-recaptcha`;
    }
    
    /**
     * 🚀 Inicializa el validador
     */
    init() {
        this.attachEventListeners();
        this.loadRecaptcha();
        this.updateSubmitButton();
    }
    
    /**
     * 🎯 ADJUNTA EVENTOS A LOS CAMPOS DEL FORMULARIO
     * 
     * TIPOS DE EVENTOS UTILIZADOS:
     * 
     * 📝 'input' - Se dispara mientras el usuario escribe
     *    - Ideal para validación en tiempo real
     *    - Proporciona feedback inmediato
     *    - Mejora la experiencia del usuario
     * 
     * 🎯 'blur' - Se dispara cuando el campo pierde el foco
     *    - Se ejecuta cuando el usuario sale del campo
     *    - Útil para validaciones finales del campo
     *    - No interrumpe la escritura del usuario
     * 
     * 🔄 'change' - Se dispara cuando el valor cambia y pierde foco
     *    - Ideal para fechas, selects, checkboxes
     *    - Se asegura que el valor haya cambiado realmente
     * 
     * 📤 'submit' - Se dispara al intentar enviar el formulario
     *    - Última oportunidad de validar antes del envío
     *    - Permite prevenir envío si hay errores
     */
    attachEventListeners() {
        // 👤 NOMBRE COMPLETO: Validación en tiempo real + al salir del campo
        document.getElementById('fullName').addEventListener('input', () => this.validateFullName());
        document.getElementById('fullName').addEventListener('blur', () => this.validateFullName());
        
        // 📧 EMAIL: Validación en tiempo real + al salir del campo  
        document.getElementById('email').addEventListener('input', () => this.validateEmail());
        document.getElementById('email').addEventListener('blur', () => this.validateEmail());
        
        // 🔒 CONTRASEÑA: Validación en tiempo real + re-validación de confirmación
        document.getElementById('password').addEventListener('input', () => {
            this.validatePassword();
            this.validateConfirmPassword(); // 🔄 Re-validar confirmación automáticamente
        });
        document.getElementById('password').addEventListener('blur', () => this.validatePassword());
        
        // 🔒 CONFIRMAR CONTRASEÑA: Validación en tiempo real + al salir del campo
        document.getElementById('confirmPassword').addEventListener('input', () => this.validateConfirmPassword());
        document.getElementById('confirmPassword').addEventListener('blur', () => this.validateConfirmPassword());
        
        // 📅 FECHA NACIMIENTO: Validación al cambiar + al salir del campo
        document.getElementById('birthDate').addEventListener('change', () => this.validateBirthDate());
        document.getElementById('birthDate').addEventListener('blur', () => this.validateBirthDate());
        
        // 📱 CELULAR: Validación en tiempo real + al salir del campo
        document.getElementById('mobile').addEventListener('input', () => this.validateMobile());
        document.getElementById('mobile').addEventListener('blur', () => this.validateMobile());
        
        // ☎️ TELÉFONO FIJO: Validación en tiempo real + al salir del campo
        document.getElementById('phone').addEventListener('input', () => this.validatePhone());
        document.getElementById('phone').addEventListener('blur', () => this.validatePhone());
        
        // ✅ TÉRMINOS: Validación solo al cambiar estado del checkbox
        document.getElementById('terms').addEventListener('change', () => this.validateTerms());
        
        // 📤 FORMULARIO: Interceptar envío para validación final
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
     * 🤖 CARGA E INICIALIZA RECAPTCHA DE GOOGLE
     * 
     * PROCESO:
     * 1. Verifica si el script de Google ya está cargado
     * 2. Si no está cargado, lo carga dinámicamente
     * 3. Inicializa el widget de reCAPTCHA cuando esté listo
     * 4. Configura el callback para cuando se complete
     */
    loadRecaptcha() {
        // 🔍 Verificar si ya existe el script de Google reCAPTCHA
        if (!document.querySelector('script[src*="recaptcha"]')) {
            // 📜 Crear y cargar script de Google reCAPTCHA
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            // 🌐 Definir callback global para cuando reCAPTCHA esté listo
            window.onRecaptchaLoad = () => {
                this.initRecaptchaWidget();
            };
        } else if (window.grecaptcha && window.grecaptcha.render) {
            // ✅ Script ya cargado, inicializar widget directamente
            this.initRecaptchaWidget();
        }
    }

    /**
     * 🎯 INICIALIZA EL WIDGET DE RECAPTCHA
     * 
     * CONFIGURACIÓN:
     * - Site Key: Clave pública proporcionada por Google
     * - Callback: Función que se ejecuta cuando se completa exitosamente
     * - Expired-callback: Función que se ejecuta cuando expira
     * - Error-callback: Función que se ejecuta si hay errores
     */
    initRecaptchaWidget() {
        try {
            const recaptchaContainer = document.getElementById('recaptcha-container');
            
            if (!recaptchaContainer) {
                console.error('❌ No se encontró el contenedor de reCAPTCHA');
                return;
            }

            // 🏗️ Renderizar widget de reCAPTCHA
            this.recaptchaConfig.widget = window.grecaptcha.render(recaptchaContainer, {
                sitekey: this.recaptchaConfig.siteKey,
                callback: (token) => this.onRecaptchaSuccess(token),
                'expired-callback': () => this.onRecaptchaExpired(),
                'error-callback': () => this.onRecaptchaError()
            });

            this.recaptchaConfig.isLoaded = true;
            console.log('✅ reCAPTCHA inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error al inicializar reCAPTCHA:', error);
            this.onRecaptchaError();
        }
    }

    /**
     * ✅ CALLBACK CUANDO RECAPTCHA SE COMPLETA EXITOSAMENTE
     * 
     * PROCESO:
     * 1. Recibe el token de Google
     * 2. Envía el token al backend para validación
     * 3. Si el backend confirma validez, habilita el botón
     * 4. Si hay error, muestra mensaje y resetea reCAPTCHA
     * 
     * @param {string} token - Token generado por Google reCAPTCHA
     */
    async onRecaptchaSuccess(token) {
        console.log('🤖 reCAPTCHA completado, verificando con el servidor...');
        
        try {
            // 🔄 Mostrar estado de carga
            this.showRecaptchaStatus('Verificando...', 'loading');

            // 📤 Enviar token al backend para validación
            const response = await fetch(this.recaptchaConfig.backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recaptcha_token: token
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // ✅ reCAPTCHA válido
                this.fieldValidation.recaptcha = true;
                this.showRecaptchaStatus('✅ Verificado correctamente', 'success');
                console.log('✅ reCAPTCHA verificado por el servidor');
                
            } else {
                // ❌ reCAPTCHA inválido
                this.fieldValidation.recaptcha = false;
                this.showRecaptchaStatus('❌ Verificación falló', 'error');
                console.error('❌ reCAPTCHA rechazado por el servidor:', result.message);
                this.resetRecaptcha();
            }

        } catch (error) {
            // 💥 Error de conexión o servidor
            console.error('❌ Error al verificar reCAPTCHA:', error);
            this.fieldValidation.recaptcha = false;
            this.showRecaptchaStatus('❌ Error de conexión', 'error');
            this.resetRecaptcha();
        }

        // 🔄 Actualizar estado del botón de envío
        this.updateSubmitButton();
    }

    /**
     * ⏰ CALLBACK CUANDO RECAPTCHA EXPIRA
     */
    onRecaptchaExpired() {
        console.log('⏰ reCAPTCHA expirado');
        this.fieldValidation.recaptcha = false;
        this.showRecaptchaStatus('⏰ reCAPTCHA expirado, por favor vuelve a verificar', 'warning');
        this.updateSubmitButton();
    }

    /**
     * ❌ CALLBACK CUANDO HAY ERROR EN RECAPTCHA
     */
    onRecaptchaError() {
        console.error('❌ Error en reCAPTCHA');
        this.fieldValidation.recaptcha = false;
        this.showRecaptchaStatus('❌ Error al cargar reCAPTCHA', 'error');
        this.updateSubmitButton();
    }

    /**
     * 📢 MUESTRA ESTADO DEL RECAPTCHA AL USUARIO
     * 
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'loading', 'success', 'error', 'warning'
     */
    showRecaptchaStatus(message, type) {
        const statusElement = document.getElementById('recaptcha-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `recaptcha-status ${type}`;
            statusElement.style.display = 'block';

            // 🚀 Auto-ocultar mensajes de éxito después de 3 segundos
            if (type === 'success') {
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 3000);
            }
        }
    }

    /**
     * 🔄 RESETEA EL WIDGET DE RECAPTCHA
     */
    resetRecaptcha() {
        if (this.recaptchaConfig.isLoaded && window.grecaptcha && this.recaptchaConfig.widget !== null) {
            window.grecaptcha.reset(this.recaptchaConfig.widget);
        }
    }
    
    /**
     * 👤 VALIDACIÓN DETALLADA DEL NOMBRE COMPLETO
     * 
     * PROCESO DE VALIDACIÓN:
     * 1. Obtiene el valor del campo y elimina espacios al inicio/final (.trim())
     * 2. Verifica si el campo está vacío (obligatorio)
     * 3. Verifica longitud mínima (3 caracteres)
     * 4. Aplica expresión regular para caracteres permitidos
     * 5. Actualiza estado visual del campo (válido/inválido)
     * 6. Actualiza estado del botón de envío
     */
    validateFullName() {
        // 🎯 Obtener referencias del DOM
        const field = document.getElementById('fullName');
        const value = field.value.trim(); // ✂️ Eliminar espacios en blanco
        const errorElement = document.getElementById('fullNameError');
        
        // 🔍 VALIDACIÓN 1: Campo obligatorio
        if (!value) {
            this.showError(field, errorElement, 'El nombre completo es obligatorio');
            this.fieldValidation.fullName = false;
            
        // 🔍 VALIDACIÓN 2: Longitud mínima
        } else if (value.length < 3) {
            this.showError(field, errorElement, 'El nombre debe tener al menos 3 caracteres');
            this.fieldValidation.fullName = false;
            
        // 🔍 VALIDACIÓN 3: Caracteres permitidos (solo letras y espacios)
        } else if (!this.patterns.fullName.test(value)) {
            this.showError(field, errorElement, 'El nombre solo puede contener letras y espacios');
            this.fieldValidation.fullName = false;
            
        // ✅ TODAS LAS VALIDACIONES PASARON
        } else {
            this.showSuccess(field, errorElement);
            this.fieldValidation.fullName = true;
        }
        
        // 🔄 Actualizar estado del botón de envío
        this.updateSubmitButton();
    }
    
    /**
     * 📧 Valida el correo electrónico
     */
    validateEmail() {
        const field = document.getElementById('email');
        const value = field.value.trim();
        const errorElement = document.getElementById('emailError');
        
        if (!value) {
            this.showError(field, errorElement, 'El correo electrónico es obligatorio');
            this.fieldValidation.email = false;
        } else if (!this.patterns.email.test(value)) {
            this.showError(field, errorElement, 'Ingresa un correo electrónico válido');
            this.fieldValidation.email = false;
        } else {
            this.showSuccess(field, errorElement);
            this.fieldValidation.email = true;
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * 🔒 VALIDACIÓN AVANZADA DE CONTRASEÑA
     * 
     * REQUISITOS DE SEGURIDAD:
     * - Mínimo 8 caracteres de longitud
     * - Al menos 1 letra minúscula (a-z)
     * - Al menos 1 letra mayúscula (A-Z)  
     * - Al menos 1 número (0-9)
     * - Al menos 1 carácter especial (@$!%*?&)
     * 
     * PROCESO:
     * 1. Obtiene el valor sin .trim() (espacios pueden ser parte de la contraseña)
     * 2. Verifica que no esté vacío
     * 3. Verifica longitud mínima
     * 4. Aplica regex compleja con lookaheads para verificar todos los requisitos
     */
    validatePassword() {
        const field = document.getElementById('password');
        const value = field.value; // 🚨 SIN .trim() - espacios permitidos en contraseñas
        const errorElement = document.getElementById('passwordError');
        
        // 🔍 VALIDACIÓN 1: Campo obligatorio
        if (!value) {
            this.showError(field, errorElement, 'La contraseña es obligatoria');
            this.fieldValidation.password = false;
            
        // 🔍 VALIDACIÓN 2: Longitud mínima (8 caracteres)
        } else if (value.length < 8) {
            this.showError(field, errorElement, 'La contraseña debe tener al menos 8 caracteres');
            this.fieldValidation.password = false;
            
        // 🔍 VALIDACIÓN 3: Complejidad con regex (lookaheads)
        } else if (!this.patterns.password.test(value)) {
            this.showError(field, errorElement, 'La contraseña debe contener al menos: 1 mayúscula, 1 número y 1 carácter especial');
            this.fieldValidation.password = false;
            
        // ✅ CONTRASEÑA SEGURA
        } else {
            this.showSuccess(field, errorElement);
            this.fieldValidation.password = true;
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * 🔒 Valida la confirmación de contraseña
     */
    validateConfirmPassword() {
        const field = document.getElementById('confirmPassword');
        const passwordField = document.getElementById('password');
        const value = field.value;
        const passwordValue = passwordField.value;
        const errorElement = document.getElementById('confirmPasswordError');
        
        if (!value) {
            this.showError(field, errorElement, 'Confirma tu contraseña');
            this.fieldValidation.confirmPassword = false;
        } else if (value !== passwordValue) {
            this.showError(field, errorElement, 'Las contraseñas no coinciden');
            this.fieldValidation.confirmPassword = false;
        } else {
            this.showSuccess(field, errorElement);
            this.fieldValidation.confirmPassword = true;
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * 📅 VALIDACIÓN COMPLEJA DE FECHA DE NACIMIENTO
     * 
     * REQUISITOS:
     * - Campo obligatorio
     * - Usuario debe ser mayor de 18 años
     * - Fecha no puede ser futura
     * - Fecha no puede ser irreal (más de 120 años)
     * 
     * ALGORITMO DE CÁLCULO DE EDAD:
     * 1. Obtiene la fecha actual y la fecha de nacimiento
     * 2. Calcula la diferencia en años
     * 3. Ajusta el cálculo considerando mes y día exactos
     * 4. Verifica si ya cumplió años este año
     */
    validateBirthDate() {
        const field = document.getElementById('birthDate');
        const value = field.value;
        const errorElement = document.getElementById('birthDateError');
        
        // 🔍 VALIDACIÓN 1: Campo obligatorio
        if (!value) {
            this.showError(field, errorElement, 'La fecha de nacimiento es obligatoria');
            this.fieldValidation.birthDate = false;
        } else {
            // 📅 Crear objetos Date para cálculos
            const birthDate = new Date(value);
            const today = new Date();
            
            // 🧮 CÁLCULO PRECISO DE EDAD
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            // ✅ Verificar si realmente ha cumplido 18 años
            // Si el mes actual es menor, o es el mismo mes pero no ha llegado al día, resta 1 año
            const realAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
                ? age - 1  // 📉 Aún no ha cumplido años este año
                : age;     // 📈 Ya cumplió años este año
            
            // 🔍 VALIDACIÓN 2: Menor de edad
            if (realAge < 18) {
                this.showError(field, errorElement, 'Debes ser mayor de 18 años para registrarte');
                this.fieldValidation.birthDate = false;
                
            // 🔍 VALIDACIÓN 3: Fecha irreal
            } else if (realAge > 120) {
                this.showError(field, errorElement, 'Por favor, ingresa una fecha de nacimiento válida');
                this.fieldValidation.birthDate = false;
                
            // ✅ EDAD VÁLIDA
            } else {
                this.showSuccess(field, errorElement);
                this.fieldValidation.birthDate = true;
            }
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * 📱 VALIDACIÓN ESPECÍFICA PARA CELULAR COLOMBIANO
     * 
     * FORMATO REQUERIDO: 3XXXXXXXXX (10 dígitos totales)
     * - Debe empezar con 3 (operadores colombianos)
     * - Seguido de 9 dígitos más
     * - Sin espacios, guiones o caracteres especiales
     * 
     * OPERADORES COLOMBIANOS QUE INICIAN CON 3:
     * - 300, 301, 302, 303... (Claro)
     * - 310, 311, 312, 313... (Movistar) 
     * - 315, 316, 317, 318... (Movistar)
     * - 320, 321, 322, 323... (Claro)
     * - 350, 351... (Avantel)
     */
    validateMobile() {
        const field = document.getElementById('mobile');
        // 🧹 Limpiar espacios en blanco que el usuario pueda haber ingresado
        const value = field.value.replace(/\s/g, '');
        const errorElement = document.getElementById('mobileError');
        
        // 🔍 VALIDACIÓN 1: Campo obligatorio
        if (!value) {
            this.showError(field, errorElement, 'El número de celular es obligatorio');
            this.fieldValidation.mobile = false;
            
        // 🔍 VALIDACIÓN 2: Formato colombiano específico (regex: ^3[0-9]{9}$)
        } else if (!this.patterns.mobile.test(value)) {
            this.showError(field, errorElement, 'Ingresa un número de celular colombiano válido (Ej: 3123456789)');
            this.fieldValidation.mobile = false;
            
        // ✅ CELULAR VÁLIDO
        } else {
            this.showSuccess(field, errorElement);
            this.fieldValidation.mobile = true;
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * ☎️ VALIDACIÓN DE TELÉFONO FIJO (CAMPO OPCIONAL)
     * 
     * CARACTERÍSTICAS:
     * - Campo completamente OPCIONAL
     * - Si está vacío = automáticamente VÁLIDO
     * - Si tiene contenido = debe cumplir formato mínimo
     * - Mínimo 10 dígitos numéricos
     * - Acepta teléfonos fijos colombianos e internacionales
     * 
     * EJEMPLOS VÁLIDOS:
     * - "" (vacío - válido por ser opcional)
     * - "6012345678" (teléfono Bogotá)
     * - "12345678901" (internacional)
     */
    validatePhone() {
        const field = document.getElementById('phone');
        // 🧹 Limpiar espacios en blanco
        const value = field.value.replace(/\s/g, '');
        const errorElement = document.getElementById('phoneError');
        
        // ✅ CAMPO OPCIONAL: Si está vacío, es válido automáticamente
        if (value === '') {
            this.showSuccess(field, errorElement);
            this.fieldValidation.phone = true;
            
        // 🔍 VALIDACIÓN: Si tiene contenido, debe ser formato válido
        } else if (!this.patterns.phone.test(value)) {
            this.showError(field, errorElement, 'El teléfono debe tener al menos 10 dígitos numéricos');
            this.fieldValidation.phone = false;
            
        // ✅ TELÉFONO VÁLIDO
        } else {
            this.showSuccess(field, errorElement);
            this.fieldValidation.phone = true;
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * ✅ Valida la aceptación de términos
     */
    validateTerms() {
        const field = document.getElementById('terms');
        const errorElement = document.getElementById('termsError');
        
        if (!field.checked) {
            this.showError(field, errorElement, 'Debes aceptar los términos y condiciones');
            this.fieldValidation.terms = false;
        } else {
            this.showSuccess(field, errorElement);
            this.fieldValidation.terms = true;
        }
        
        this.updateSubmitButton();
    }
    
    /**
     * ❌ FUNCIÓN PARA MOSTRAR ERRORES EN CAMPOS
     * 
     * PROCESO:
     * 1. Remueve clase 'valid' si existía
     * 2. Agrega clase 'invalid' para estilos CSS de error (borde rojo)
     * 3. Inserta mensaje de error en el elemento designado
     * 4. Hace visible el mensaje de error
     * 
     * @param {HTMLElement} field - El campo de input que tiene error
     * @param {HTMLElement} errorElement - El elemento donde mostrar el mensaje
     * @param {string} message - El mensaje de error a mostrar
     */
    showError(field, errorElement, message) {
        field.classList.remove('valid');    // 🚫 Quitar estado válido
        field.classList.add('invalid');     // ❌ Agregar estado inválido
        errorElement.textContent = message; // 📝 Insertar mensaje de error
        errorElement.style.display = 'block'; // 👁️ Hacer visible el mensaje
    }
    
    /**
     * ✅ FUNCIÓN PARA MOSTRAR ÉXITO EN CAMPOS
     * 
     * PROCESO:
     * 1. Remueve clase 'invalid' si existía
     * 2. Agrega clase 'valid' para estilos CSS de éxito (borde verde)
     * 3. Limpia cualquier mensaje de error anterior
     * 4. Oculta el elemento de mensaje de error
     * 
     * @param {HTMLElement} field - El campo de input que es válido
     * @param {HTMLElement} errorElement - El elemento de mensaje de error
     */
    showSuccess(field, errorElement) {
        field.classList.remove('invalid');  // 🚫 Quitar estado inválido
        field.classList.add('valid');       // ✅ Agregar estado válido
        errorElement.textContent = '';      // 🧹 Limpiar mensaje de error
        errorElement.style.display = 'none'; // 👁️‍🗨️ Ocultar mensaje
    }
    
    /**
     * 🔄 ACTUALIZA EL ESTADO DEL BOTÓN DE ENVÍO
     * 
     * LÓGICA:
     * 1. Revisa el objeto fieldValidation que contiene el estado de cada campo
     * 2. Usa Object.values() para obtener todos los valores booleanos
     * 3. Usa .every() para verificar que TODOS los campos sean true
     * 4. Habilita/deshabilita el botón según el resultado
     * 5. Cambia el cursor visual para feedback del usuario
     * 
     * IMPORTANTE: El formulario solo se puede enviar cuando TODOS los campos sean válidos
     */
    updateSubmitButton() {
        // 🔍 Verificar si TODOS los campos son válidos
        // Object.values() convierte {fullName: true, email: false, ...} en [true, false, ...]
        // .every() retorna true solo si TODOS los elementos son true
        const allValid = Object.values(this.fieldValidation).every(isValid => isValid);
        
        // 🎛️ Controlar estado del botón
        this.submitBtn.disabled = !allValid;
        
        // 🖱️ Feedback visual del cursor
        if (allValid) {
            this.submitBtn.style.cursor = 'pointer';     // ✅ Clickeable
        } else {
            this.submitBtn.style.cursor = 'not-allowed'; // ❌ No clickeable
        }
        
        // 📊 Debug: mostrar estado actual de validaciones (solo en desarrollo)
        console.log('📊 Estado de validaciones:', this.fieldValidation);
        console.log('🎯 Formulario válido:', allValid);
    }
    
    /**
     * 📤 MANEJA EL ENVÍO DEL FORMULARIO
     * 
     * FLUJO DE RESPONSABILIDADES:
     * 1. Previene envío por defecto del navegador
     * 2. Re-valida todos los campos (incluyendo reCAPTCHA)
     * 3. Si TODO es válido: Muestra modal de éxito + recarga página
     * 4. Si hay errores: Enfoca primer campo inválido
     * 
     * IMPORTANTE: Este formulario NO envía datos a ningún servidor.
     * Solo valida localmente y muestra confirmación de éxito.
     */
    handleSubmit(event) {
        event.preventDefault();
        
        // 🔄 Validar todos los campos una vez más
        this.validateAllFields();
        
        // 🔍 Verificar si todos los campos son válidos (incluyendo reCAPTCHA)
        const allValid = Object.values(this.fieldValidation).every(isValid => isValid);
        
        if (allValid) {
            // ✅ Todo válido: Mostrar modal y recargar
            this.showSuccessMessage();
        } else {
            // ❌ Hay errores: Enfocar primer campo inválido
            this.focusFirstInvalidField();
        }
    }
    
    /**
     * ✅ Valida todos los campos del formulario
     */
    validateAllFields() {
        this.validateFullName();
        this.validateEmail();
        this.validatePassword();
        this.validateConfirmPassword();
        this.validateBirthDate();
        this.validateMobile();
        this.validatePhone();
        this.validateTerms();
        // 🤖 reCAPTCHA se valida automáticamente cuando se completa
    }
    
    /**
     * 🎯 Enfoca el primer campo inválido
     */
    focusFirstInvalidField() {
        const fields = ['fullName', 'email', 'password', 'confirmPassword', 'birthDate', 'mobile', 'phone', 'terms', 'recaptcha'];
        
        for (const fieldName of fields) {
            if (!this.fieldValidation[fieldName]) {
                if (fieldName === 'recaptcha') {
                    // 🤖 Para reCAPTCHA, hacer scroll al contenedor
                    const recaptchaContainer = document.getElementById('recaptcha-container');
                    if (recaptchaContainer) {
                        recaptchaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    document.getElementById(fieldName).focus();
                }
                break;
            }
        }
    }
    
    /**
     * 🎉 MUESTRA MODAL DE ÉXITO Y MANEJA EL FLUJO FINAL
     * 
     * COMPORTAMIENTO REQUERIDO:
     * 1. Muestra un modal/alert de "Registro Exitoso"
     * 2. Al hacer click en OK, recarga la página
     * 3. No envía datos a ningún servidor (simulación únicamente)
     */
    showSuccessMessage() {
        // 📊 Obtener datos del formulario para logs (solo simulación)
        const formData = this.getFormData();
        
        // 📝 Log de los datos simulados
        console.log('✅ REGISTRO SIMULADO EXITOSO');
        console.log('📋 Datos capturados:', formData);
        console.log('🔒 reCAPTCHA: Validado correctamente');
        console.log('⚠️ Nota: Estos datos NO se envían a ningún servidor');
        
        // 🎉 Mostrar modal de éxito
        const mensaje = `🎉 ¡Registro Exitoso!
        
✅ Todos los datos han sido validados correctamente
🔒 reCAPTCHA verificado con Google
📝 Usuario: ${formData.fullName}
📧 Email: ${formData.email}

Presiona OK para continuar.`;

        // 🎯 Mostrar alert y recargar página al confirmar
        alert(mensaje);
        
        // 🔄 Recargar la página después del modal
        window.location.reload();
    }
    
    /**
     * 📊 OBTIENE LOS DATOS DEL FORMULARIO PARA SIMULACIÓN
     * 
     * Nota: Esta función solo captura datos para mostrar en logs.
     * En un sistema real, la contraseña se hashearía antes del envío.
     */
    getFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: '[OCULTA POR SEGURIDAD]', // No mostrar contraseña en logs
            birthDate: document.getElementById('birthDate').value,
            mobile: document.getElementById('mobile').value.replace(/\s/g, ''),
            phone: document.getElementById('phone').value.replace(/\s/g, '') || 'No proporcionado',
            termsAccepted: document.getElementById('terms').checked,
            recaptchaValidated: this.fieldValidation.recaptcha,
            registrationDate: new Date().toISOString()
        };
    }
    
    /**
     * 🔄 Reinicia el formulario
     */
    resetForm() {
        this.form.reset();
        this.form.style.display = 'block';
        this.successMessage.style.display = 'none';
        
        // Limpiar clases de validación
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        
        // Limpiar mensajes de error
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
        
        // Reiniciar estado de validación
        this.fieldValidation = {
            fullName: false,
            email: false,
            password: false,
            confirmPassword: false,
            birthDate: false,
            mobile: false,
            phone: true, // Opcional
            terms: false,
            recaptcha: false
        };
        
        // 🤖 Resetear reCAPTCHA
        this.resetRecaptcha();
        const statusElement = document.getElementById('recaptcha-status');
        if (statusElement) {
            statusElement.style.display = 'none';
        }
        
        this.updateSubmitButton();
        document.getElementById('fullName').focus();
    }
}

// 🚀 Inicializar el validador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
    console.log('✅ Validador de formulario inicializado correctamente');
    
    // 📚 DOCUMENTACIÓN DEL FLUJO DE VALIDACIÓN:
    console.log(`
    🔍 FLUJO DE VALIDACIÓN PASO A PASO:
    
    1. 🎬 INICIALIZACIÓN:
       - Se crea una instancia de FormValidator
       - Se definen las expresiones regulares para cada tipo de validación
       - Se establece el estado inicial de cada campo (falso excepto teléfono opcional)
       - Se adjuntan event listeners a cada campo
    
    2. 🎯 EVENTOS EN TIEMPO REAL:
       - 'input': Se ejecuta mientras el usuario escribe
       - 'blur': Se ejecuta cuando el usuario sale del campo
       - 'change': Se ejecuta cuando cambia el valor (fechas, checkboxes)
    
    3. 🔄 PROCESO DE VALIDACIÓN POR CAMPO:
       a) Se obtiene el valor del campo
       b) Se limpia el valor si es necesario (.trim(), espacios)
       c) Se aplican validaciones en orden de importancia:
          - Campo obligatorio (si aplica)
          - Formato/longitud
          - Reglas específicas (edad, formato teléfono, etc.)
       d) Se actualiza el estado visual (CSS classes)
       e) Se actualiza el estado interno (fieldValidation object)
       f) Se verifica si el botón de envío debe habilitarse
    
    4. 🎮 CONTROL DEL BOTÓN DE ENVÍO:
       - Solo se habilita cuando TODOS los campos son válidos
       - Se actualiza automáticamente después de cada validación
       - Proporciona feedback visual al usuario
    
    5. 📤 ENVÍO SIMULADO DEL FORMULARIO:
       - Se previene el envío por defecto del navegador
       - Se re-validan todos los campos por seguridad (incluyendo reCAPTCHA)
       - Si todo es válido: se muestra modal de "Registro Exitoso" + recarga
       - Si hay errores: se enfoca el primer campo inválido
       - NO se envían datos a ningún servidor (solo simulación)
    
    🛡️ SEGURIDAD Y VALIDACIONES IMPLEMENTADAS:
    - ✅ Validación dual: Frontend (UX) + Backend reCAPTCHA 
    - ✅ Expresiones regulares específicas para cada tipo de dato
    - ✅ Sanitización de inputs (trim, eliminación de espacios)
    - ✅ Validación de edad precisa con cálculos de fecha
    - ✅ Formatos específicos para números colombianos
    - ✅ reCAPTCHA validado con Google antes de permitir envío
    - ✅ Contraseña oculta en logs por seguridad
    
    🎯 FLUJO DE reCAPTCHA:
    1. Frontend carga widget de Google reCAPTCHA
    2. Usuario completa el challenge
    3. Google envía token al frontend
    4. Frontend envía token al backend (/validate-recaptcha)
    5. Backend valida token con Google API
    6. Backend responde éxito/error al frontend
    7. Solo si reCAPTCHA es válido, se permite envío del formulario
    `);
});
