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
            terms: false            // ❌ Inválido hasta que acepte términos y condiciones
        };
        
        this.init();
    }
    
    /**
     * 🚀 Inicializa el validador
     */
    init() {
        this.attachEventListeners();
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
     * 📤 Maneja el envío del formulario
     */
    handleSubmit(event) {
        event.preventDefault();
        
        // Validar todos los campos una vez más
        this.validateAllFields();
        
        // Verificar si todos los campos son válidos
        const allValid = Object.values(this.fieldValidation).every(isValid => isValid);
        
        if (allValid) {
            this.showSuccessMessage();
        } else {
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
    }
    
    /**
     * 🎯 Enfoca el primer campo inválido
     */
    focusFirstInvalidField() {
        const fields = ['fullName', 'email', 'password', 'confirmPassword', 'birthDate', 'mobile', 'phone', 'terms'];
        
        for (const fieldName of fields) {
            if (!this.fieldValidation[fieldName]) {
                document.getElementById(fieldName).focus();
                break;
            }
        }
    }
    
    /**
     * 🎉 Muestra mensaje de éxito
     */
    showSuccessMessage() {
        // Ocultar formulario y mostrar mensaje de éxito
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        
        // Scroll hacia el mensaje de éxito
        this.successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Simulación: aquí irían los datos al servidor
        console.log('📤 Datos del formulario (simulación):', this.getFormData());
        
        // Opcional: reiniciar formulario después de 5 segundos
        setTimeout(() => {
            if (confirm('¿Deseas registrar otro usuario?')) {
                this.resetForm();
            }
        }, 5000);
    }
    
    /**
     * 📊 Obtiene los datos del formulario
     */
    getFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value, // En producción, esto se debe hashear
            birthDate: document.getElementById('birthDate').value,
            mobile: document.getElementById('mobile').value.replace(/\s/g, ''),
            phone: document.getElementById('phone').value.replace(/\s/g, ''),
            termsAccepted: document.getElementById('terms').checked,
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
            terms: false
        };
        
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
    
    5. 📤 ENVÍO DEL FORMULARIO:
       - Se previene el envío por defecto del navegador
       - Se re-validan todos los campos por seguridad
       - Si todo es válido: se muestra mensaje de éxito
       - Si hay errores: se enfoca el primer campo inválido
    
    🛡️ SEGURIDAD IMPLEMENTADA:
    - Validación en frontend (UX) + validación en backend requerida
    - Expresiones regulares específicas para cada tipo de dato
    - Sanitización de inputs (trim, eliminación de espacios)
    - Validación de edad precisa con cálculos de fecha
    - Formatos específicos para números colombianos
    `);
});
