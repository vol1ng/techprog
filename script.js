async function sendVerificationCode(email) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const response = await fetch('http://localhost:3000/api/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    if (data.success) {
      return { success: true, code };
    } else {
      throw new Error(data.message || 'Ошибка при отправке кода');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    return { success: false, message: error.message };
  }
}

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const verificationCode = document.getElementById('verificationCode').value;

  if (!email || !password || !confirmPassword) {
    showMessage('Пожалуйста, заполните все поля', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('Пароли не совпадают', 'error');
    return;
  }

  if (!verificationCode) {
    showMessage('Пожалуйста, введите код подтверждения', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, verificationCode }),
    });

    const data = await response.json();
    if (data.success) {
      showMessage('Регистрация успешна!', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      showMessage(data.message || 'Ошибка при регистрации', 'error');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    showMessage('Ошибка при регистрации', 'error');
  }
}

async function requestVerificationCode() {
  const email = document.getElementById('email').value;
  if (!email) {
    showMessage('Пожалуйста, введите email', 'error');
    return;
  }

  const result = await sendVerificationCode(email);
  if (result.success) {
    showMessage('Код подтверждения отправлен на ваш email', 'success');
  } else {
    showMessage(result.message || 'Ошибка при отправке кода', 'error');
  }
} 