interface LengData {
    rutext: string
    index: string
    info_data: string
}

export const textArray: LengData[] = [
    {rutext: 'Привет', index: 'hello', info_data: 'приветствие'},
    {rutext: 'Создай свой Телеграм бот легко и с огромными возможностями', index: 'createBot', info_data: 'приветствие'},
    {rutext: 'Телеграм Бот Конструктор', index: 'constructor', info_data: 'конструктор'},
    {rutext: 'Загрузка...', index: 'loading', info_data: 'загрузка'},
    {rutext: 'Создать новый бот', index: 'createNewBot', info_data: 'новый бот'},
    {rutext: 'Создать', index: 'create', info_data: 'создать'},
    {rutext: 'Токен', index: 'token', info_data: 'токен'},
    {rutext: 'Выключить', index: 'off', info_data: 'выключить'},
    {rutext: 'Включить', index: 'on', info_data: 'включить'},
    {rutext: 'Мониторинг', index: 'monit', info_data: 'монитор'},
    {rutext: 'Мероприятия', index: 'events', info_data: 'мероприятия'},
    {rutext: 'Конструктор', index: 'constr', info_data: 'конструктор'},
    {rutext: 'Контент', index: 'content', info_data: 'контент'},
    {rutext: 'Удалить', index: 'delete', info_data: 'удалить'},
    {rutext: 'Статус', index: 'status', info_data: 'статус'},
    {rutext: 'Режим добавления контента', index: 'addContentMode', info_data: 'добавления контента'},
    {rutext: 'Создан', index: 'created', info_data: 'создано'},
    {rutext: 'Имя бота', index: 'botName', info_data: 'имябота'},
    {rutext: 'Назад', index: 'back', info_data: 'назад'},
    {rutext: 'Создать новый экран', index: 'createNewScreen', info_data: 'создать новый экран'},
    {rutext: 'Сбросить фильтр', index: 'resetFilter', info_data: 'сбросить фильтр'},
    {rutext: 'Имя для нового экрана', index: 'newScreenName', info_data: 'имя нового экрана'},
    {rutext: 'Найти экран по имени', index: 'findScreenByName', info_data: 'найти экран по имени'},
    {rutext: 'Имя экрана', index: 'screenName', info_data: 'имя экрана'},
    {rutext: 'Имя экрана для удаления', index: 'screenNameForDelete', info_data: 'имя экрана для удаления'},
    {rutext: 'Активные ссылки на экран', index: 'activLinkToScreen', info_data: 'активные ссылки на экран'},
    {rutext: 'Копия', index: 'copy', info_data: 'копия'},
    {rutext: 'Послать мне', index: 'sendMe', info_data: 'послать мне'},
    {rutext: 'Контент посланный боту будет добавлен в этот экран', index: 'sendContentToBot', info_data: 'контент посланый в бот'},
    {rutext: 'Редактировать', index: 'edit', info_data: 'редактировать'},
    {rutext: 'Сохранить переменную', index: 'saveConst', info_data: 'сохранить переменную'},
    {rutext: 'Удалить переменную', index: 'deleteConst', info_data: 'удалить переменную'},
    {rutext: 'Сохранить клавиатуру', index: 'saveKeyboard', info_data: 'сохранить клавиатуру'},
    {rutext: 'Переименовать', index: 'rename', info_data: 'переименовать'},
    {rutext: 'Очистить экран', index: 'clearScreen', info_data: 'очистить экран'},
    {rutext: 'Сохранить имя', index: 'saveName', info_data: 'сохранить имя'},
    {rutext: 'Отмена', index: 'cancel', info_data: 'отмена'},
    {rutext: 'Сохранить ответ на этот экран в переменную', index: 'saveToConst', info_data: 'сохранить в переменную'},
    {rutext: 'Редактироание клавиатуры', index: 'editKeyboardMode', info_data: 'редактирование клавиатуры'},
    {rutext: 'Добавить загруженный контент', index: 'addExCont', info_data: 'добавить существующий контент'},
    {rutext: 'Защита контента от пересылки', index: 'protectContent', info_data: 'защита контента'},
    {rutext: 'Перейти на экран, если получен ответ', index: 'toScreenIfAnswer', info_data: 'экран если ответ'},
    {rutext: 'Создать кнопку', index: 'createBut', info_data: 'создать кнопку'},
    {rutext: 'Имя кнопки', index: 'butName', info_data: 'имя кнопки'},
    {rutext: 'Выбери экран или укажи ссылку в полном формате', index: 'screenOrLink', info_data: 'ссылка или экран'},
    {rutext: 'Экран или ссылка', index: 'target', info_data: 'направление'},
    {rutext: 'Твой экран', index: 'yourScreen', info_data: 'твой экран'},
    {rutext: 'Добавить кнопку', index: 'addBut', info_data: 'добавить кнопку'},
    {rutext: 'Только активные пользователи', index: 'onlyActiv', info_data: 'только активные'},
    
    
]

interface LengDataStart {
    title: string
    index: string
    info: string
}

export const lengs: LengDataStart[] = [
    {title: 'Русский', index: 'ru', info: 'русский'},
    {title: 'English', index: 'en', info: 'английский'},
    {title: 'Español', index: 'es', info: 'испанский'},
    {title: 'Français', index: 'fr', info: 'французский'},
    {title: 'Português', index: 'pt', info: 'португальский'},
    {title: 'Deutsch', index: 'de', info: 'немецкий'},
    {title: '中文', index: 'zh', info: 'китайский'},
    {title: 'Italiano', index: 'it', info: 'итальянский'},
    {title: '日本語', index: 'ja', info: 'японский'},
    {title: '한국어', index: 'ko', info: 'корейский'},
    {title: 'العربية', index: 'ar', info: 'арабский'},
    {title: 'हिन्दी', index: 'hi', info: 'хинди'},
    {title: 'עברית', index: 'he', info: 'иврит'},
    {title: 'Türkçe', index: 'tr', info: 'турецкий'},
    {title: 'Tiếng Việt', index: 'vi', info: 'вьетнамский'},
    {title: 'Nederlands', index: 'nl', info: 'голландский'},
    {title: 'Polski', index: 'pl', info: 'польский'},
    {title: 'Bahasa Indonesia', index: 'id', info: 'индонезийский'},
    {title: 'Svenska', index: 'sv', info: 'шведский'},
    {title: 'Čeština', index: 'cs', info: 'чешский'},
    {title: 'Українська', index: 'uk', info: 'украинский'},
    {title: 'Magyar', index: 'hu', info: 'венгерский'},
    {title: 'ไทย', index: 'th', info: 'тайский'},
    {title: 'Ελληνικά', index: 'el', info: 'греческий'},
    {title: 'Dansk', index: 'da', info: 'датский'},
    {title: 'Suomi', index: 'fi', info: 'финский'},
    {title: 'Română', index: 'ro', info: 'румынский'},
    {title: 'Slovenčina', index: 'sk', info: 'словацкий'},
    {title: 'Беларуская', index: 'be', info: 'белорусский'}
]