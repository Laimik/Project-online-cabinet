# Развертка Backend и DataBase

### 1. Развертка базы данных.
Устанавливаем mySQL по ссылке: https://dev.mysql.com/downloads/workbench/
После создать базу данных с параметрами
HOST: localhost
PORT: 3306
URL: jdbc:mysql://localhost:3306/

Создать схему "online-cabinet"

Схема будет заполнена после запуска Backend (так как настроена миграции базы данных).

### 2. Развертка сервера.

Заклонить последние изменения с репозитории на git.

Установить npm командой npm install

В папке backend создать .env файл с данными параметрами:
TZ=UTC  
HTTP_PORT=3001  
DB_HOST=localhost  
DB_USER=user  
DB_PASS=password  
DB_NAME=online_cabinet  
DB_PORT=3306  
SALT_ROUNDS=10  
JWT_SECRET=mysupersecurestring  
DADATA_API_KEY=de598717b8ab11b74459a888708e6e214c1d2cc3  
CORS_WHITELIST=localhost,http://62.109.31.180,http://adventure-galley.ru/

 Через терминал выполнить команду node ./bin/www

Проверить заработал ли сервер по ссылке http://localhost:3001/api-docs/
 
# Запуск Frontend

Заклонить последние изменения с репозитории на git.

Установить npm командой npm install

В папке frontend создать .env файл с данными параметрами:
REACT_APP_SERVER_HOST=localhost  
REACT_APP_SERVER_PORT=3001

 Через терминал выполнить команду npm run start


