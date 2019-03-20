// Рендерим шаблоны с помощью handlebars
function renderHtml(templateName, list, obj) {
    let template = document.querySelector(templateName).textContent;
    let render = Handlebars.compile(template);
    let html = render(obj);
    let result = document.querySelector(list);
    result.innerHTML = html;
}

// Форматирование даты в строку
function getStringData(date) {
    let curr_date = date.getDate();
    let curr_month = date.getMonth() + 1;
    let curr_year = date.getFullYear();
    let thisDate = { date: `${curr_year}-${curr_month}-${curr_date}` };
    return thisDate;
}

// Получаем даты в виде массива  
function getDatesArray() {
    let dateOld = new Date();
    let now = new Date();
    let arrayOld = [];
    let arrayNew = [];

    for (let index = 0; index <= 6; index++) {
        dateOld.setDate(dateOld.getDate() - 1);
        let dateString = getStringData(dateOld)
        arrayOld.push(dateString);
    }

    for (let index = 0; index <= 6; index++) {
        if (index !== 0) {
            now.setDate(now.getDate() + 1);
        }
        let dateString = getStringData(now)
        arrayNew.push(dateString);
    }

    return arrayOld.reverse().concat(arrayNew);
}

// Ищем бронирование на определенную дату и время(Возвращаем найденную бронь по дате и времени, если была, и массив всех броней)
function searchRegistration(date, time) {
    let storageArray = JSON.parse(localStorage.getItem("registration"));
    let returnArray = storageArray.find((item => {
        if (item.time == time && item.date == date)
            return item;
        else
            return false;
    }));
    return {
        findReg: returnArray,
        allReg: storageArray
    };
}

const dateSelect = getDatesArray();
const timeSelect = [{ time: '10:00' }, { time: '12:00' }, { time: '14:00' }, { time: '16:00' }, { time: '18:00' }, { time: '20:00' }];
const placesBegin = [{ id: 1, busy: false }, { id: 2, busy: false }, { id: 3, busy: false }, { id: 4, busy: false }, { id: 5, busy: false }];

$(document).ready(function() {
    // Рендерим селекты 
    renderHtml('#date_list', '.select_date', { array: dateSelect });
    renderHtml('#time_list', '.select_time', { array: timeSelect });
    // Инициализация localStorage
    alert('После выбора даты и времени нажимайте кнопку "Проверить наличие" чтобы посмотреть наличие броней на дату и время');
    if (!localStorage.getItem("registration")) {
        let test = [{
            date: '11-11-11',
            time: '12:00',
            places: placesBegin
        }];
        localStorage.setItem("registration", JSON.stringify(test));
    }

    // При клике на место в зале задаем атрибут для последующего считывания
    document.addEventListener('click', (e) => {
        let elem = e.target;
        if (elem.classList.contains('place')) {
            if (elem.getAttribute('verb') == 'false')
                elem.setAttribute('verb', 'true');
            else
                elem.setAttribute('verb', 'false');
        }
    })

    // При клике на кнопку проверяем наличие мест на установленный момент времени
    $('#check_availability').click(() => {
        let date = $("#date").val();
        let time = $("#time").val();
        let findArray = searchRegistration(date, time);
        let renderArray = findArray.findReg ? findArray.findReg.places : placesBegin;
        let count = 0;
        renderArray.forEach((item) => {
                if (item.busy === 'true') count++;
            })
            // Рендерим места в зале (если на данный момент были забронированы места в зале, отображаем их)
        renderHtml('#place_list', '.tablo_body', { count: count, array: renderArray });
    })

    // При клике на кнопку бронируем выбранные места
    $('#regist').click(() => {
        let date = $("#date").val();
        let time = $("#time").val();
        let currentDate = new Date();
        if (Date.parse(currentDate) - 86400000 > Date.parse(date)) {
            // Очищаем поля броней
            renderHtml('#place_list', '.tablo_body', { array: placesBegin });
            alert('Бронь невозможна задним числом (только просмотр броней на тот момент по нажатию на кнопу "Проверить наличие")');
        } else {
            let boof = document.querySelectorAll('.place');
            let placeArray = [];

            // Перебираем элементы DOM, строим массив объектов
            boof.forEach(item => {
                placeArray.push({
                    id: item.getAttribute('position'),
                    busy: item.getAttribute('verb')
                });
            });

            // Объект для сохранения в localStorage
            let objFromSave = {
                date: date,
                time: time,
                places: placeArray
            };
            // Сохраняем измененения с учетом броней(если были на этот период) 
            let resaveArray = searchRegistration(date, time);
            // Фильтруем и получаем массив броней, если была найдена бронь на данную дату, убираем ее
            let allReg = resaveArray.allReg.filter(item => {
                if (item.time == time && item.date == date)
                    return false;
                else
                    return item;
            });
            // Пушим обновленный объект брони
            allReg.push(objFromSave);
            // Сохраняем обновленный список в localStorage
            localStorage.setItem("registration", JSON.stringify(allReg));
            alert('Бронь успешно сохранена!!! Нажмите кнопку "Проверить наличие" чтобы обновить список броней');
        }
    })
})