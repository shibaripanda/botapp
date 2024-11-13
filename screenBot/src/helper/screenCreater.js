export const screens = [
    {
        owner: '',
        name: 'screen_1',
        protect: false,
        status: true,

        text: '',
        media: [],
        buttons: []
    }
]

export const screensStart = [
    {
        screen: 'screen_1',
        text: '1. Приветствие.txt',
        buttons: [
            [{ text: 'Продолжить', callback_data: 'screen_2' }],
        ]
    },
    {
        screen: 'screen_2',
        text: '2. Выбор.txt',
        buttons: [
            [{ text: '«Сутра. В потоке восторга»', callback_data: 'screen_3' }],
            [{ text: 'Хроники Акаши', callback_data: 'screen_4' }],
            [{ text: 'КиО', callback_data: 'screen_5' }],
            [{ text: 'Лила', callback_data: 'screen_6' }],
        ]
    },
    {
        screen: 'screen_3',
        text: '3. Сутра.txt',
        buttons: [
            [{ text: 'Записаться онлайн', callback_data: 'screen_17' }],
            [{ text: 'Записаться на живую встречу', callback_data: 'screen_17' }],
            [{ text: 'в начало', callback_data: 'screen_2' }]
        ]
    },
    {
        screen: 'screen_4',
        text: '4. ХА.txt',
        buttons: [
            [{ text: 'Правила формирования запроса ХА ', callback_data: 'screen_7' }],
            [{ text: 'Примеры запросов', callback_data: 'screen_8' }],
            [{ text: 'Записаться онлайн', callback_data: 'screen_17' }],
            [{ text: 'Записаться на живую встречу', callback_data: 'screen_17' }],
            [{ text: 'назад', callback_data: 'screen_4' }],
            [{ text: 'в начало', callback_data: 'screen_2' }],
        ]
    },
    {
        screen: 'screen_5',
        text: '5. КиО.txt',
        buttons: [
            [{ text: 'Противопоказания', callback_data: 'screen_9' }],
            [{ text: 'Заполните анкету', callback_data: 'screen_10' }],
            [{ text: 'Записаться на приём', callback_data: 'screen_17' }],
            [{ text: 'назад', callback_data: 'screen_5' }],
            [{ text: 'в начало', callback_data: 'screen_2' }],
        ]
    },
    {
        screen: 'screen_6',
        text: '6. Лила.txt',
        buttons: [
            [{ text: 'Правила', callback_data: 'screen_11' }],
            [{ text: 'Кубик', callback_data: 'screen_12' }],
            [{ text: 'Поле игры', callback_data: 'screen_13' }],
            [{ text: 'Причины играть в  Лилу', callback_data: 'screen_14' }],
            [{ text: 'Подготовка к игре', callback_data: 'screen_15' }],
            [{ text: 'Формирование запроса', callback_data: 'screen_16' }],
            [{ text: 'Записаться онлайн', callback_data: 'screen_17' }],
            [{ text: 'Записаться на живую встречу', callback_data: 'screen_17' }],
            [{ text: 'назад', callback_data: 'screen_6' }],
            [{ text: 'в начало', callback_data: 'screen_2' }],
        ]
    },
    {
        screen: 'screen_7',
        text: '7. Правила формирования запроса ХА.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_4' }]
        ]
    },
    {
        screen: 'screen_8',
        text: '8. Примеры запросов ХА.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_4' }]
        ]
    },
    {
        screen: 'screen_9',
        text: '9. Противопоказания.txt',
        buttons: [
            [{ text: 'Со списком противопоказаний ознакомлен(а)', callback_data: 'screen_5' }]
        ]
    },
    {
        screen: 'screen_10',
        text: '10. Анкета.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_5' }]
        ]
    },
    {
        screen: 'screen_11',
        text: '11. Правила Лилы.txt',
        buttons: [
            [{ text: 'С правилами ознакомлен(а)', callback_data: 'screen_6' }]
        ]
    },
    {
        screen: 'screen_12',
        text: '12. Кубик.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_6' }]
        ]
    },
    {
        screen: 'screen_13',
        text: '13. Поле игры.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_6' }]
        ]
    },
    {
        screen: 'screen_14',
        text: '14. Причины играть в  Лилу.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_6' }]
        ]
    },
    {
        screen: 'screen_15',
        text: '15. Подготовка к игре.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_6' }]
        ]
    },
    {
        screen: 'screen_16',
        text: '16. Формирование запроса.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_6' }]
        ]
    },
    {
        screen: 'screen_17',
        text: '18. Реквизиты карты.txt',
        buttons: [
            [{ text: 'назад', callback_data: 'screen_6' }]
        ]
    },
    {
        screen: 'screen_18',
        text: '18. Реквизиты карты.txt',
        buttons: [
        ]
    }
]


