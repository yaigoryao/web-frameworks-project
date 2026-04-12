/** Кэш списков клиента (машины, заказы) */
export const CUSTOMER_LIST_TTL_MS = 45_000;

/** Кэш списка пользователей (/users) */
export const USERS_LIST_TTL_MS = 30_000;

/** Справочник статусов заказов (staff) */
export const ORDER_STATUSES_TTL_MS = 300_000;

/** Данные staff по userId (профиль, заказы, машины другого пользователя) */
export const STAFF_USER_DATA_TTL_MS = 45_000;

/** Роли для владельца (редко меняются) */
export const STAFF_ROLES_TTL_MS = 300_000;
