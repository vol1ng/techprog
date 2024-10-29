const searchWord = () => {
    const word = document.getElementById('wordInput').value.trim();
    fetch('dict.json')
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            const entry = data[word];

            if (entry) {
                const translation = entry.translation ? `<strong>Перевод:</strong> ${entry.translation}` : 'Перевод отсутствует.';
                const transcription = entry.transcription ? `<strong>Транскрипция:</strong> ${entry.transcription}` : 'Транскрипция отсутствует.';

                resultDiv.innerHTML = `
                    <p>${translation}</p>
                    <p>${transcription}</p>
                `;
            } else {
                resultDiv.innerHTML = 'Такого слова не существует.';
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            document.getElementById('result').innerHTML = 'Произошла ошибка при загрузке данных.';
        });
};

document.getElementById('wordInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchWord();
    }
});

// Подсказки при вводе текста
document.getElementById('wordInput').addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    const suggestionBox = document.getElementById('suggestionBox');

    if (!query) {
        suggestionBox.innerHTML = '';
        suggestionBox.style.display = 'none';
        return;
    }

    fetch('dict.json')
        .then(response => response.json())
        .then(data => {
            const suggestions = Object.keys(data)
                .filter(word => word.startsWith(query))
                .sort()
                .slice(0, 5);

            suggestionBox.innerHTML = '';
            if (suggestions.length > 0) {
                suggestionBox.style.display = 'block';
                suggestions.forEach(word => {
                    const item = document.createElement('div');
                    item.className = 'suggestion';
                    item.textContent = word;
                    item.addEventListener('click', () => {
                        document.getElementById('wordInput').value = word;
                        suggestionBox.innerHTML = '';
                        suggestionBox.style.display = 'none';
                        searchWord(); // Выполняем поиск сразу после выбора слова из предложений
                    });
                    suggestionBox.appendChild(item);
                });
            } else {
                suggestionBox.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
        });
});

// Кнопка поиска
document.getElementById('searchButton').addEventListener('click', searchWord);
