import json
import string

# Путь к исходному JSON-файлу
input_file = "WordsDictENG.json"
output_file = "WordsDictENG_fast.json"

# Чтение исходного JSON
with open(input_file, "r", encoding="utf-8") as file:
    data = json.load(file)

# Инициализация новой структуры
grouped_data = {letter: {} for letter in string.ascii_lowercase}

# Группировка слов по первой букве
for word, details in data.items():
    first_letter = word[0].lower()
    if first_letter in grouped_data:
        grouped_data[first_letter][word] = details

# Удаление пустых букв
grouped_data = {key: value for key, value in grouped_data.items() if value}

# Запись новой структуры в JSON-файл
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(grouped_data, file, ensure_ascii=False, indent=4)

print(f"Новый JSON сохранен в файл: {output_file}")
