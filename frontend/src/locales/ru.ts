export default {
  locale: {
    en: 'Английский',
    ru: 'Русский'
  },

  theme: {
    light: 'Светлая',
    dark: 'Тёмная',
    system: 'Системная'
  },

  signInToYourAccount: 'Войдите в свой аккаунт',
  search: 'Поиск',
  loginInfo: 'Данные для входа',
  additionalInfo: 'Дополнительная информация',
  username: 'Имя пользователя',
  password: 'Пароль',
  confirmPassword: 'Подтвердите пароль',
  personalInfo: 'Персональные данные',
  firstName: 'Имя',
  lastName: 'Фамилия',
  firstNameKh: 'Имя (на кхмерском)',
  lastNameKh: 'Фамилия (на кхмерском)',
  fullName: 'Полное имя',
  fullNameKh: 'Полное имя (на кхмерском)',
  email: 'Электронная почта',
  phoneNumber: 'Номер телефона',
  status: 'Статус',
  actions: 'Действия',
  description: 'Описание',
  permissions: 'Разрешения',
  selectAll: 'Выбрать все',

  signIn: 'Войти',
  forgotPassword: 'Забыли пароль?',
  forgotYourPassword: 'Забыли свой пароль?',
  submit: 'Отправить',
  save: 'Сохранить',
  saveAsDraft: 'Сохранить как черновик',
  cancel: 'Отмена',
  update: 'Обновить',
  back: 'Назад',
  create: 'Создать',
  view: 'Просмотр',
  edit: 'Редактировать',
  details: 'Детали',
  active: 'Активен',
  deactivated: 'Деактивирован',
  viewDetails: 'Посмотреть детали',
  loading: 'Загрузка...',

  login: {
    placeholder: {
      email: 'Введите адрес электронной почты',
      password: 'Введите пароль'
    },
    details: 'Детали задачи',
    validation: {
      email: 'Пожалуйста, введите корректный адрес электронной почты.',
      password: 'Пожалуйста, введите пароль.'
    }
  },

  dashboard: 'Панель управления',
  userManagement: 'Управление пользователями',
  user: {
    label: 'Пользователь',
    description:
      'Управление пользователями включает функции аутентификации, назначения прав, управления профилем, контроля паролей, отслеживания активности, деактивации/приостановки аккаунтов и взаимодействия с пользователями.',
    list: 'Пользователи',
    category: 'Категория',
    addNew: 'Добавить пользователя',
    edit: 'Редактировать пользователя'
  },

  role: {
    label: 'Роль',
    list: 'Роли',
    info: 'Информация о роли',
    name: 'Название роли',
    nameEn: 'Название роли (EN)',
    nameKh: 'Название роли (KH)',
    roleType: 'Тип роли',
    addNew: 'Добавить роль',
    edit: 'Редактировать роль'
  },

  branch: {
    label: 'Филиал',
    placeholder: 'Выберите филиал'
  },

  tasks: {
    board: 'Доска задач',
    create: 'Создать задачу',
    edit: 'Редактировать задачу',
    title: 'Название',
    description: 'Описание',
    startDate: 'Дата начала',
    endDate: 'Дата окончания',
    assignee: 'Исполнитель',
    unassigned: 'Не назначено',
    emptyState: 'Нет элементов',
    fields: {
      title: 'Название',
      description: 'Описание',
      startDate: 'Дата начала',
      endDate: 'Дата окончания',
      assignedUser: 'Исполнитель',
      status: 'Статус'
    },
    placeholders: {
      title: 'Введите название задачи',
      description: 'Введите описание задачи (по желанию)',
      assignedUser: 'Выберите исполнителя',
      status: 'Выберите статус'
    },
    filters: {
      assignedUsersPlaceholder: 'Фильтр по исполнителям',
      clearAssignedUsers: 'Очистить'
    },
    messages: {
      loading: 'Загрузка задач...',
      loadError: 'Не удалось загрузить задачи. Повторите попытку.',
      statusUpdating: 'Обновление статуса задачи...',
      statusFailed: 'Не удалось обновить статус задачи. Повторите попытку.',
      createSuccess: 'Задача успешно создана.',
      updateSuccess: 'Задача успешно обновлена.'
    },
    assignment: {
      loading: 'Загрузка списка сотрудников...',
      loadError: 'Не удалось загрузить список сотрудников.',
      inProgress: 'Обновление назначения задачи...',
      unassign: 'Снять назначение',
      emptyList: 'Нет доступных сотрудников.',
      noAssignee: 'Исполнитель не выбран',
      noEmail: 'Адрес электронной почты отсутствует',
      errors: {
        generic: 'Не удалось обновить назначение. Повторите попытку.',
        overlap: 'У пользователя уже есть задача в этот период.'
      }
    },
    status: {
      pending: 'В ожидании',
      inProgress: 'В работе',
      completed: 'Завершено',
      cancelled: 'Отменено'
    },
    dueDate: {
      tooltip: {
        overdue:
          'Задача просрочена {count} день назад | Задача просрочена {count} дня назад | Задача просрочена {count} дней назад',
        today: 'Срок по задаче сегодня',
        upcoming:
          'Срок через {count} день | Срок через {count} дня | Срок через {count} дней'
      }
    }
  },
  errors: {
    generic: 'Произошла ошибка. Повторите попытку позже.',
    userHasOverlappingTask: 'У пользователя уже есть задача в указанный период.'
  },
  validation: {
    required: 'Поле «{field}» обязательно для заполнения.',
    maxCharacters: 'Допускается не более {count} символов.',
    invalidDate: 'Выбрана недопустимая дата.',
    endDateBeforeStartDate: 'Дата окончания не может быть раньше даты начала.'
  }
};

