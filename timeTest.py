import json
import time
import msgpack


# Функция для чтения JSON-файла
def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)


def read_msgpack(msgpack_file_path):
    # Чтение данных из MessagePack файла
    with open(msgpack_file_path, "rb") as file:
        return msgpack.unpackb(file.read(), raw=False)


# Основной код
if __name__ == "__main__":
    # Путь к JSON-файлу
    #json_file_path = "WordsDictENG.json"  # Замените на ваш файл
    json_file_path = "WordsDictENG_fast.json"  # Замените на ваш файл
    #json_file_path = "WordsDictRU.json"  # Замените на ваш файл
    data = read_json(json_file_path)
    # Замер времени чтения JSON
    start_time = time.perf_counter()

    print(data['z']['zwitterion'])

    end_time = time.perf_counter()

    print(f"Время выполнения: {end_time - start_time:.50f} секунд.")
    json_file_path = "WordsDictENG.json"  # Замените на ваш файл

    data = read_json(json_file_path)
    # Замер времени чтения JSON
    start_time1 = time.perf_counter()

    print(data['zwitterion'])

    end_time1 = time.perf_counter()

    print(f"Время выполнения: {end_time1 - start_time1:.50f} секунд.")

#Время выполнения: 0.00002439999999997999324818920285906642675399780273 секунд.
