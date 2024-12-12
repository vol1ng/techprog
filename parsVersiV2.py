import asyncio
import aiohttp
import json
from bs4 import BeautifulSoup
import time


async def fetch_html(session, url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36"
    }
    async with session.get(url, headers=headers) as response:
        return await response.text()


def get_data_from_html(html):
    soup = BeautifulSoup(html, "lxml")
    all_words = soup.find_all("p")
    words_info = {}
    for word_line in all_words:
        text_ = word_line.text
        word_info_temp = list(map(str, text_.split("—")))
        if '[' in word_info_temp[0]:
            temp = word_info_temp[0].split("[")
            words_info[temp[0].strip()] = {
                'transcription': "[" + temp[1],
                'translation': word_info_temp[1]
            }
        else:
            words_info[word_info_temp[0].strip()] = {
                'translation': word_info_temp[1]
            }
    return words_info


async def parse_url(session, url):
    html = await fetch_html(session, url)
    return get_data_from_html(html)


async def main():
    # Загрузка ссылок
    with open('links.txt', 'r') as file:
        urls = file.read().splitlines()

    words_dict = {}
    start_time = time.time()

    # Асинхронный парсинг ссылок
    async with aiohttp.ClientSession() as session:
        tasks = [parse_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        for result in results:
            words_dict.update(result)

    # Запись в файл
    with open("WordsDictENG.json", "w", encoding="utf-8") as json_file:
        json.dump(words_dict, json_file, ensure_ascii=False, indent=4)

    print(f"Время выполнения: {time.time() - start_time:.2f} секунд")


# Запуск основного процесса
if __name__ == "__main__":
    asyncio.run(main())
