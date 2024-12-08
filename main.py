import os
from PIL import Image, ImageOps

#da
def fit_to_16_9_with_padding(input_path, output_path, color=(255, 255, 255)):
    target_ratio = 16 / 9  # Соотношение сторон 16:9

    # Открываем изображение
    img = Image.open(input_path)
    width, height = img.size
    current_ratio = width / height

    # Рассчитываем новые размеры для полотна
    if current_ratio > target_ratio:
        # Изображение слишком широкое: высота равна ширине делённой на 16:9
        new_width = width
        new_height = int(width / target_ratio)
    else:
        # Изображение слишком узкое: ширина равна высоте умноженной на 16:9
        new_width = int(height * target_ratio)
        new_height = height

    # Создаём полотно с новым размером и белым фоном
    new_img = Image.new("RGB", (new_width, new_height), color)

    # Центрируем изображение
    x_offset = (new_width - width) // 2
    y_offset = (new_height - height) // 2

    # Вставляем оригинальное изображение на белое полотно
    new_img.paste(img, (x_offset, y_offset))

    # Меняем размеры итогового изображения под точное 16:9
    result_img = new_img.resize((1920, 1080), Image.Resampling.LANCZOS)

    # Сохраняем результат
    result_img.save(output_path, format="JPEG")



input_dir = "images"
output_dir = "resizeImages"
os.makedirs(output_dir, exist_ok=True)

for filename in os.listdir(input_dir):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        fit_to_16_9_with_padding(input_path, output_path)  # или resize_and_crop_to_16_9
