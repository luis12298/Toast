/**
 * Sistema de Toast en JavaScript Vanilla
 * Uso: showToast('success', 'Título', 'Mensaje', 5000, 'top' o 'bottom')
 */

class ToastSystem {
    constructor(position = 'top') {
        this.container = null;
        this.toasts = [];
        this.stylesInjected = false;
        this.position = position;
        this.init();
    }

    init() {
        this.injectStyles();
        this.createContainer();
    }

    injectStyles() {
        if (this.stylesInjected) return;

        const styles = `
        .toast-container {
            position: fixed;
            z-index: 9999;
            max-width: 300px;
            pointer-events: none;
        }

        .toast-container.top {
            top: 20px;
            right: 10px;
        }

        .toast-container.bottom {
            bottom: 20px;
            right: 10px;
        }

        .toast {
            background: white;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid #007bff;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 200px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            position: relative;
            pointer-events: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        .toast.hide {
            opacity: 0;
            transform: translateX(100%);
        }

        .toast.success { border-left-color: #28a745; }
        .toast.error { border-left-color: #dc3545; }
        .toast.warning { border-left-color: #ffc107; }
        .toast.info { border-left-color: #17a2b8; }

        .toast-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            flex-shrink: 0;
        }

        .toast.success .toast-icon { background-color: #28a745; }
        .toast.error .toast-icon { background-color: #dc3545; }
        .toast.warning .toast-icon { background-color: #ffc107; }
        .toast.info .toast-icon { background-color: #17a2b8; }

        .toast-content {
            flex: 1;
        }

        .toast-title {
            font-weight: bold;
            margin-bottom: 4px;
            color: #333;
            font-size: 14px;
        }

        .toast-message {
            color: #666;
            font-size: 13px;
            line-height: 1.4;
        }

        .toast-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #999;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }

        .toast-close:hover {
            background-color: #f0f0f0;
            color: #333;
        }

        .toast-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 0 0 8px 8px;
            transition: width linear;
        }

        .toast.success .toast-progress { background-color: #28a745; }
        .toast.error .toast-progress { background-color: #dc3545; }
        .toast.warning .toast-progress { background-color: #ffc107; }
        .toast.info .toast-progress { background-color: #17a2b8; }

        /* --- MODO RESPONSIVE: animación de arriba hacia abajo --- */
       @media (max-width: 480px) {
    .toast-container.top,
    .toast-container.bottom {
        left: 50%;
        transform: translateX(-50%);
        right: auto;
        max-width: 90%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .toast {
        width: 100%;
        min-width: auto;
        transform: translateY(-120%);
    }

    .toast.show {
        transform: translateY(0);
    }

    .toast.hide {
        transform: translateY(-120%);
    }
}

    `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        this.stylesInjected = true;
    }

    createContainer() {
        let selector = `.toast-container.${this.position}`;
        this.container = document.querySelector(selector);

        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = `toast-container ${this.position}`;
            document.body.appendChild(this.container);
        }
    }

    show(type = 'info', title = 'Toast Title', message = 'Toast Message', duration = 5000) {
        const toast = this.createToast(type, title, message, duration);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        if (duration !== false && duration > 0) {
            const progressBar = toast.querySelector('.toast-progress');
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.transitionDuration = duration + 'ms';
                setTimeout(() => {
                    progressBar.style.width = '0%';
                }, 100);
            }

            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    createToast(type, title, message, duration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '!',
            info: 'i'
        };

        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => this.hide(toast);

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || 'i'}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            ${duration !== false ? '<div class="toast-progress"></div>' : ''}
        `;

        toast.appendChild(closeBtn);
        return toast;
    }

    hide(toast) {
        if (!toast || !toast.parentElement) return;

        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }

            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    hideAll() {
        this.toasts.forEach(toast => {
            this.hide(toast);
        });
    }
}

// Manejador de múltiples instancias por posición
const toastInstances = {
    top: null,
    bottom: null
};

function initToastSystem(position = 'top') {
    if (!toastInstances[position]) {
        toastInstances[position] = new ToastSystem(position);
    }
    return toastInstances[position];
}

// Función pública para mostrar toasts
function showToast(type, title, message, duration = 5000, position = 'top') {
    const system = initToastSystem(position);
    return system.show(type, title, message, duration);
}

// Atajos para diferentes tipos
function showSuccess(title, message, duration = 5000, position = 'top') {
    return showToast('success', title, message, duration, position);
}

function showError(title, message, duration = 5000, position = 'top') {
    return showToast('error', title, message, duration, position);
}

function showWarning(title, message, duration = 5000, position = 'top') {
    return showToast('warning', title, message, duration, position);
}

function showInfo(title, message, duration = 5000, position = 'top') {
    return showToast('info', title, message, duration, position);
}

function hideAllToasts(position = 'top') {
    const system = toastInstances[position];
    if (system) system.hideAll();
}

// Ejemplo de uso:
// showToast('success', 'Éxito', 'Operación completada correctamente', 3000, 'bottom');
