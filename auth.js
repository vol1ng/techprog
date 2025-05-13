// Функции для работы с попапами
function openAuthPopup() {
    document.getElementById('authPopup').style.display = 'block';
}

function closeAuthPopup() {
    document.getElementById('authPopup').style.display = 'none';
}

let isLoginMode = true;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const form = document.getElementById('authForm');
    const title = form.parentElement.querySelector('h2');
    const submitButton = form.querySelector('button[type="submit"]');
    const toggleLink = form.parentElement.querySelector('.auth-links a');
    const nameInput = document.getElementById('authName');

    if (isLoginMode) {
        title.textContent = 'Вход';
        submitButton.textContent = 'Войти';
        toggleLink.textContent = 'Нет аккаунта? Зарегистрироваться';
        if (nameInput) nameInput.remove();
    } else {
        title.textContent = 'Регистрация';
        submitButton.textContent = 'Зарегистрироваться';
        toggleLink.textContent = 'Уже есть аккаунт? Войти';
        if (!nameInput) {
            const emailInput = document.getElementById('authEmail');
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.id = 'authName';
            nameInput.placeholder = 'Имя';
            nameInput.required = true;
            form.insertBefore(nameInput, emailInput);
        }
    }
}

// Обработчик события для кнопки авторизации
document.getElementById('authButton').addEventListener('click', () => {
    openAuthPopup();
});

// Обработчик события для кнопки выхода
document.getElementById('logoutButton').addEventListener('click', () => {
    logout();
});

// Обработка формы
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
        if (isLoginMode) {
            // Логика входа
            const response = await loginUser(email, password);
            if (response.success) {
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userName', response.name || email);
                closeAuthPopup();
                updateUIAfterAuth();
            } else {
                alert('Ошибка авторизации: ' + response.message);
            }
        } else {
            // Логика регистрации
            const name = document.getElementById('authName').value;
            const response = await registerUser(name, email, password);
            if (response.success) {
                alert('Регистрация успешна! Теперь вы можете войти.');
                toggleAuthMode(); // Переключаемся на форму входа
            } else {
                alert('Ошибка регистрации: ' + response.message);
            }
        }
    } catch (error) {
        alert('Произошла ошибка: ' + (isLoginMode ? 'при авторизации' : 'при регистрации'));
        console.error('Auth error:', error);
    }
});

// Функции для работы с API (заглушки)
async function loginUser(email, password) {
    // TODO: Заменить на реальный API запрос
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                token: 'dummy-token',
                name: email.split('@')[0],
                message: 'Успешная авторизация'
            });
        }, 1000);
    });
}

async function registerUser(name, email, password) {
    // TODO: Заменить на реальный API запрос
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Успешная регистрация'
            });
        }, 1000);
    });
}

// Функция выхода
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    updateUIAfterLogout();
}

// Функция обновления UI после авторизации
function updateUIAfterAuth() {
    const authButton = document.getElementById('authButton');
    const userInfo = document.querySelector('.user-info');
    const userName = document.getElementById('userName');
    
    authButton.style.display = 'none';
    userInfo.style.display = 'flex';
    userName.textContent = localStorage.getItem('userName');
}

// Функция обновления UI после выхода
function updateUIAfterLogout() {
    const authButton = document.getElementById('authButton');
    const userInfo = document.querySelector('.user-info');
    
    authButton.style.display = 'block';
    userInfo.style.display = 'none';
}

// Проверка авторизации при загрузке страницы
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        updateUIAfterAuth();
    }
}

// Запускаем проверку при загрузке страницы
document.addEventListener('DOMContentLoaded', checkAuth); 