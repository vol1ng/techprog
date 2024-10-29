document.getElementById('searchButton').addEventListener('click', function() {
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
});