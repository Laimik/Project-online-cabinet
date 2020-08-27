###Установка docker
Скачать и установить docker:
https://www.docker.com/products/docker-desktop

###Установка docker-compose

https://docs.docker.com/compose/install/
На windows должен быть установлен после установки docker 
(соответсвенно данный пункт можно пропустить).

###Запуск бекенда
Создать .env файл по пути C:\Users\<user>\backend\.env
со следующим содержимым:
```
TZ=UTC
DB_HOST=192.168.0.1 //здесь должен быть ip вашей машины.
DB_USER=user
DB_PASS=password
DB_NAME=online_cabinet
DB_PORT=3306
SALT_ROUNDS=10
JWT_SECRET=mysupersecurestring
```
Команды в консоли, необходимо запускать из папки docker:
- docker-compose up -d (поднять docker, первый запуск чтобы собрать образ бэка).
- docker-compose stop (остановить контейнеры)
- docker-compose start (запустить контейнеры)
- docker-compose down (удалить контейнеры)

Чтобы перейти на документацию swagger, необходимо добавить в адресу api-docs
Например: http://localhost:3000/api-docs

