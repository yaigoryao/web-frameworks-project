// Interface для User модели (используется в shared)
// Сама реальная Sequelize модель находится в user-service/src/models/user.model.ts
export interface IUser {
  id?: number;
  name: string;
}

// Interface для Data модели (используется в shared)
// Сама реальная Sequelize модель находится в data-service/src/models/data.model.ts
export interface IData {
  id?: number;
  value: string;
}