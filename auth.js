// Функции для работы с попапами
function openAuthPopup() {
    document.getElementById('authPopup').classList.add('active');
}

function closeAuthPopup() {
    document.getElementById('authPopup').classList.remove('active');
}

// Функция для закрытия попапа Marked Words
function closeMarkedWordsPopup() {
    document.getElementById('markedWordsPopup').classList.remove('active');
}

let isLoginMode = true;
let verificationCode = null;

// Функция для генерации кода подтверждения
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Функция для отправки кода на email
async function sendVerificationCode(email) {
  try {
    const code = generateVerificationCode();
    verificationCode = code;

    const response = await fetch('http://localhost:3000/api/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code })
    });

    const data = await response.json();
    if (data.success) {
      document.getElementById('verificationCodeContainer').style.display = 'block';
      return true;
    } else {
      alert('Ошибка при отправке кода: ' + data.message);
      return false;
    }
  } catch (error) {
    console.error('Ошибка при отправке кода:', error);
    alert('Ошибка при отправке кода подтверждения');
    return false;
  }
}

// Функции для работы с API
async function loginUser(email, password) {
    try {
        console.log('Отправка запроса на вход:', { email });
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Ответ сервера:', data);
        
        if (data.success) {
            return { 
                success: true, 
                token: data.token,
                name: data.name,
                userId: data.userId
            };
        } else {
            throw new Error(data.message || 'Ошибка при авторизации');
        }
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return { success: false, message: error.message };
    }
}

async function registerUser(name, email, password) {
    try {
        console.log('Отправка запроса на регистрацию:', { name, email });
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: name, email, password })
        });

        const data = await response.json();
        console.log('Ответ сервера:', data);
        
        if (data.success) {
            return { success: true, user: data.user };
        } else {
            throw new Error(data.message || 'Ошибка при регистрации');
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        return { success: false, message: error.message };
    }
}

// Функция выхода
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    updateUIAfterLogout();
}

// Функция обновления UI после авторизации
function updateUIAfterAuth() {
    const authButton = document.getElementById('authButton');
    const userInfo = document.querySelector('.user-info');
    const userName = document.getElementById('userName');
    
    if (authButton) authButton.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (userName) userName.textContent = localStorage.getItem('userName');
}

// Функция обновления UI после выхода
function updateUIAfterLogout() {
    const authButton = document.getElementById('authButton');
    const userInfo = document.querySelector('.user-info');
    
    if (authButton) authButton.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
}

// Проверка авторизации при загрузке страницы
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        updateUIAfterAuth();
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const form = document.getElementById('authForm');
    const title = form?.parentElement?.querySelector('h2');
    const submitButton = form?.querySelector('button[type="submit"]');
    const toggleLink = form?.parentElement?.querySelector('.auth-links a');
    const verificationContainer = document.getElementById('verificationCodeContainer');
    const sendCodeContainer = document.getElementById('sendCodeContainer');
    const nameInput = document.getElementById('authName');

    if (isLoginMode) {
        if (title) title.textContent = 'Вход';
        if (submitButton) submitButton.textContent = 'Войти';
        if (toggleLink) toggleLink.textContent = 'Нет аккаунта? Зарегистрироваться';
        if (verificationContainer) verificationContainer.style.display = 'none';
        if (sendCodeContainer) sendCodeContainer.style.display = 'none';
        if (nameInput) nameInput.remove();
    } else {
        if (title) title.textContent = 'Регистрация';
        if (submitButton) submitButton.textContent = 'Зарегистрироваться';
        if (toggleLink) toggleLink.textContent = 'Уже есть аккаунт? Войти';
        if (verificationContainer) verificationContainer.style.display = 'none';
        if (sendCodeContainer) sendCodeContainer.style.display = 'none';
        if (!nameInput && form) {
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обработчик изменения email
    const emailInput = document.getElementById('authEmail');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const email = this.value;
            const sendCodeContainer = document.getElementById('sendCodeContainer');
            const verificationContainer = document.getElementById('verificationCodeContainer');
            
            if (email && !isLoginMode) {
                if (sendCodeContainer) sendCodeContainer.style.display = 'block';
                if (verificationContainer) verificationContainer.style.display = 'none';
            } else {
                if (sendCodeContainer) sendCodeContainer.style.display = 'none';
                if (verificationContainer) verificationContainer.style.display = 'none';
            }
        });
    }

    // Обработчик кнопки отправки кода
    const sendCodeButton = document.getElementById('sendCodeButton');
    if (sendCodeButton) {
        sendCodeButton.addEventListener('click', async function() {
            const email = document.getElementById('authEmail')?.value;
            if (email) {
                const success = await sendVerificationCode(email);
                if (success) {
                    const sendCodeContainer = document.getElementById('sendCodeContainer');
                    const verificationContainer = document.getElementById('verificationCodeContainer');
                    if (sendCodeContainer) sendCodeContainer.style.display = 'none';
                    if (verificationContainer) verificationContainer.style.display = 'block';
                }
            }
        });
    }

    // Обработчик формы
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('authEmail')?.value;
            const password = document.getElementById('authPassword')?.value;
            const code = document.getElementById('verificationCode')?.value;

            try {
                if (isLoginMode) {
                    // Логика входа
                    const response = await loginUser(email, password);
                    if (response.success) {
                        localStorage.setItem('authToken', response.token);
                        localStorage.setItem('userName', response.name);
                        localStorage.setItem('userId', response.userId);
                        closeAuthPopup();
                        updateUIAfterAuth();
                    } else {
                        alert('Ошибка авторизации: ' + response.message);
                    }
                } else {
                    // Проверка кода подтверждения
                    if (code !== verificationCode) {
                        alert('Неверный код подтверждения');
                        return;
                    }

                    // Логика регистрации
                    const name = document.getElementById('authName')?.value;
                    const response = await registerUser(name, email, password);
                    if (response.success) {
                        // После успешной регистрации сразу выполняем вход
                        const loginResponse = await loginUser(email, password);
                        if (loginResponse.success) {
                            localStorage.setItem('authToken', loginResponse.token);
                            localStorage.setItem('userName', loginResponse.name);
                            localStorage.setItem('userId', loginResponse.userId);
                            closeAuthPopup();
                            updateUIAfterAuth();
                            alert('Регистрация и вход выполнены успешно!');
                        } else {
                            alert('Регистрация успешна, но не удалось выполнить вход. Пожалуйста, войдите вручную.');
                            toggleAuthMode(); // Переключаемся на форму входа
                        }
                    } else {
                        alert('Ошибка регистрации: ' + response.message);
                    }
                }
            } catch (error) {
                alert('Произошла ошибка: ' + (isLoginMode ? 'при авторизации' : 'при регистрации'));
                console.error('Auth error:', error);
            }
        });
    }

    // Обработчик кнопки авторизации
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.addEventListener('click', () => {
            openAuthPopup();
        });
    }

    // Обработчик кнопки выхода
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logout();
        });
    }

    // Проверка авторизации при загрузке страницы
    checkAuth();

    // Закрываем все попапы при загрузке
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.remove('active');
    });
}); 