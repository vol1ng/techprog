import json
import msgpack

# Путь к исходному JSON-файлу
json_file_path = "WordsDictENG.json"
msgpack_file_path = "WordsDictENG.msgpack"

# Чтение JSON
with open(json_file_path, "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

# Запись данных в формате MessagePack
with open(msgpack_file_path, "wb") as msgpack_file:
    msgpack_file.write(msgpack.packb(data))

print(f"JSON данные успешно сохранены в MessagePack файл: {msgpack_file_path}")
