# BellIntegratorTask

Реализовать одностраничное приложение резервирования билетов в кинотеатр.
Время начала сеансов 10:00, время последнего сеанса 20:00. Шаг - каждые 2 часа. Таким образом в течение дня может быть 6 сеансов.
Интерфейс отображает доступные даты для бронирования, свободные и забронированные места.
При выборе даты меньше текущей даты, отображаются архивные данные без возможности их изменения.
Для хранения бронирований используется LocalStorage, и при перезагрузке страницы считываются сохраненные данные из LocalStorage.
Глубина архива: одна неделя до текущей даты. Максимальный период бронирования: одна неделя от текущей даты.

Запуск производится командой `npm start` в корне проекта (где располагается файл server.js).
После запуска, "интерфейс" будет доступен по адресу `http://localhost:8000/`