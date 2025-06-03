# Используем официальный образ Python
FROM python:3.12-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Устанавливаем необходимые системные зависимости
RUN apt-get update && apt-get install -y \
        build-essential \
        libpq-dev \
        && rm -rf /var/lib/apt/lists/*

# Копируем зависимости
COPY requirements.txt .

# Обновляем pip и устанавливаем зависимости (включая Git-зависимости)
RUN pip install --upgrade pip && pip install -r requirements.txt

# Копируем весь исходный код проекта в контейнер
COPY . .

# Команда запуска по умолчанию — не указываем здесь напрямую daphne, делается в docker-compose
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
