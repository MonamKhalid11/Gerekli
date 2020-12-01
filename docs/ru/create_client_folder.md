## Создание папки клиента

  1. Создаём папку клиента в папке users.
      - ./users/client_folder_name (например, com.barakat.app)

  2. Наполняем папку клиента следующим содержимым:
      - android/app/src/main/res/*
      - ios/csnative/Images.xcassets/*
      - ios/csnative/Info.plist
      - src/config/index.js
      - src/config/theme/js

  3. В корне проекта запускаем команду:
      ```sh
        $ make change USER=client_folder_name
      ```

  4. Собираем приложение

## Примечание

  > Пример готовой папки клиента - com.simtech.multivendor

  > Полученные изменения коммитить не надо