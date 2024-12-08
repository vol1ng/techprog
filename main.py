import sys
from time import sleep
import time
import json
import pymsgbox as pymsgbox
from selenium import webdriver
import lxml
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
import os
from datetime import datetime
import json
import bz2


def get_html():
    url = f"https://wooordhunt.ru/dic/list/en_ru/ab"
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36")
    browser = webdriver.Chrome(options=options)

    browser.get(url)
    sleep(5)

    htmlCode = browser.page_source
    return htmlCode


def get_links():
    #url = f"https://wooordhunt.ru/dic/content/en_ru"
    url = f"https://wooordhunt.ru/dic/content/ru_en"

    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36")
    browser = webdriver.Chrome(options=options)

    browser.get(url)
    sleep(5)
    htmlCode = browser.page_source
    soup = BeautifulSoup(htmlCode, "lxml")
    links = ["https://wooordhunt.ru" + link['href'] for link in soup.find('div', id='content').find_all("a") if
             'href' in link.attrs]
    print(links)
    with open(file='links1.txt', mode='w') as file:
        for link in links:
            file.write(link + '\n')
    # return links


def read_links(url):
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36")
    browser = webdriver.Chrome(options=options)

    browser.get(url)
    sleep(3)

    htmlCode = browser.page_source
    dict = getDataFromRequest(htmlCode)
    return dict


def getDataFromRequest(code):
    soup = BeautifulSoup(code, "lxml")
    all_words = soup.find_all("p")
    words_info = {}
    # print(len(all_words))
    for wordLine in all_words:
        text_ = wordLine.text
        word_info_temp = list(map(str, text_.split("—")))
        word_info_final = list()

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


def write_to_json(words_dict):
    with open("WordsDictRU.json", "w", encoding="utf-8") as json_file:
        json.dump(words_dict, json_file, ensure_ascii=False, indent=4)




def compress_json_bz2(input_file, output_file):
    # Чтение JSON файла
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Запись сжатого файла
    with bz2.open(output_file, "wt", encoding="utf-8") as bz:
        json.dump(data, bz, ensure_ascii=False, indent=4)


def read_json():
    with open("WordsDict2.json", "r", encoding="utf-8") as json_file:
        dict = json.load(json_file)
        for key in dict:
            print(key)
        #print(len(dict))


def read_bz2_json(file_path):
    with bz2.open(file_path, "rt", encoding="utf-8") as bz:
        data = json.load(bz)
        for key in data:
            print(key)
        #print(len(data))






def main():
    # get_links()
    dict = {}
    with open(file='links1.txt', mode='r') as file:
        # for line in file.readlines():
        lines = file.readlines()
        n = len(lines)
        all_time = 0
        for i in range(n-470):
            start_time = time.time()
            dict.update(read_links(lines[i]))
            end_time = time.time()
            execution_time_ms = (end_time - start_time) * 1000
            all_time += execution_time_ms
            print(
                f"{i}/{n} timeSpend:{all_time / 60000} This:{execution_time_ms} Осталось:{execution_time_ms * (n - i) / 60000}")

    write_to_json(dict)


if __name__=="__main__":
    main()