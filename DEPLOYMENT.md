# Task Manager API Deployment Guide

## Requirements
   - Docker Desktop
   - VS Code (recommended)
   - Docker extension for VS Code (recommended)

## Deployment Steps

1. Ensure Docker Desktop is running (green whale icon in tray)

2. Clone repository
   $ git clone https://github.com/UselessFreak/task-manager-api.git


3. Open project in VS Code

4. Verify root directory contains:
   - Dockerfile
   - docker-compose.yml

5. Start application in terminal:
   $ docker compose up --build

6. After successful launch:
   - Open Swagger UI: http://localhost:3000/api
   - Test API endpoints via Swagger

## Useful Commands

1. Start containers:
 $ docker compose up

2. Stop containers:
 $ docker compose down

3. View logs:
 $ docker compose logs

## Project Structure
   - /src - source code
   - /dist - compiled files
   - Dockerfile - image build instructions
   - docker-compose.yml - container configuration

--------------------------------------------------------------------------------
--------------------------------------------------------------------------------

# Инструкция по развертыванию Task Manager API

## Требования
   - Docker Desktop
   - VS Code (рекомендуется)
   - Docker расширение для VS Code (рекомендуется)

## Шаги развертывания

1. Убедитесь, что Docker Desktop запущен (зеленая иконка кита в трее)

2. Клонируйте репозиторий
   $ git clone https://github.com/UselessFreak/task-manager-api.git 

3. Откройте проект в VS Code

4. Убедитесь, что в корне проекта есть файлы:
   - Dockerfile
   - docker-compose.yml

5. Запустите приложение командой в терминале:
   $ docker compose up --build

6. После успешного запуска:
   - Откройте Swagger UI: http://localhost:3000/api
   - Тестируйте API endpoints через Swagger

## Полезные команды
1. Запуск контейнеров:
   $ docker compose up

2. Остановка контейнеров:
   $ docker compose down

3. Просмотр логов:
   $ docker compose logs

## Структура проекта
   - /src - исходный код
   - /dist - скомпилированные файлы
   - Dockerfile - инструкции для сборки образа
   - docker-compose.yml - конфигурация контейнеров