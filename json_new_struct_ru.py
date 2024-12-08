import json
import string

letters = [
    "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и",
    "й", "к", "л", "м", "н", "о", "п", "р", "с", "т",
    "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь",
    "э", "ю", "я"
]

input_file = "WordsDictRU.json"
output_file = "WordsDictRU_fast.json"

with open(input_file, "r", encoding="utf-8") as file:
    data = json.load(file)

grouped_data = {letter: {} for letter in letters}

for word, details in data.items():
    first_letter = word.strip()[0].lower()
    if first_letter.isalpha() and first_letter in grouped_data:
        grouped_data[first_letter][word] = details
    else:
        print(f"Пропущено слово: {word} (первая буква: {first_letter})")

grouped_data = {key: value for key, value in grouped_data.items() if value}

with open(output_file, "w", encoding="utf-8") as file:
    json.dump(grouped_data, file, ensure_ascii=False, indent=4)

print(f"Новый JSON сохранен в файл: {output_file}")
