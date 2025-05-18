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

// Обработчик изменения email
document.getElementById('authEmail').addEventListener('input', function() {
    const email = this.value;
    const sendCodeContainer = document.getElementById('sendCodeContainer');
    const verificationContainer = document.getElementById('verificationCodeContainer');
    
    if (email && !isLoginMode) {
        sendCodeContainer.style.display = 'block';
        verificationContainer.style.display = 'none';
    } else {
        sendCodeContainer.style.display = 'none';
        verificationContainer.style.display = 'none';
    }
});

// Обработчик кнопки отправки кода
document.getElementById('sendCodeButton').addEventListener('click', async function() {
    const email = document.getElementById('authEmail').value;
    if (email) {
        const success = await sendVerificationCode(email);
        if (success) {
            document.getElementById('sendCodeContainer').style.display = 'none';
        }
    } else {
        alert('Пожалуйста, введите email');
    }
});

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const form = document.getElementById('authForm');
    const title = form.parentElement.querySelector('h2');
    const submitButton = form.querySelector('button[type="submit"]');
    const toggleLink = form.parentElement.querySelector('.auth-links a');
    const verificationContainer = document.getElementById('verificationCodeContainer');
    const sendCodeContainer = document.getElementById('sendCodeContainer');
    const nameInput = document.getElementById('authName');

    if (isLoginMode) {
        title.textContent = 'Вход';
        submitButton.textContent = 'Войти';
        toggleLink.textContent = 'Нет аккаунта? Зарегистрироваться';
        verificationContainer.style.display = 'none';
        sendCodeContainer.style.display = 'none';
        if (nameInput) nameInput.remove();
    } else {
        title.textContent = 'Регистрация';
        submitButton.textContent = 'Зарегистрироваться';
        toggleLink.textContent = 'Уже есть аккаунт? Войти';
        verificationContainer.style.display = 'none';
        sendCodeContainer.style.display = 'none';
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

// Обработчик для повторной отправки кода
document.getElementById('resendCode').addEventListener('click', async () => {
  const email = document.getElementById('authEmail').value;
  if (email) {
    await sendVerificationCode(email);
  } else {
    alert('Пожалуйста, введите email');
  }
});

// Обновляем обработчик формы
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const code = document.getElementById('verificationCode').value;

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
            // Проверка кода подтверждения
            if (code !== verificationCode) {
                alert('Неверный код подтверждения');
                return;
            }

            // Логика регистрации
            const name = document.getElementById('authName')?.value;
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

// Функции для работы с API
async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        return { success: false, message: 'Ошибка при подключении к серверу' };
    }
}

async function registerUser(name, email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: name, email, password })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        return { success: false, message: 'Ошибка при подключении к серверу' };
    }
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    // Закрываем все попапы при загрузке
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.remove('active');
    });
}); 