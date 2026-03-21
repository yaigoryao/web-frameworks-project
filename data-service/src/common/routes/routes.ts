export namespace Routes {

    export namespace Owner {
        export const Root = "/owner";
        export const Car = `${Root}/car`;
        export const Order = `${Root}/order`;
        export const OrderStatus = `${Root}/orderstatus`;
        export const Role = `${Root}/role`;
        export const User = `${Root}/user`;
        export const UserCar = `${Root}/usercar`;
    }

    export namespace Manager {
        export const Root = "/manager";
        export const Car = `${Root}/car`;
        export const Order = `${Root}/order`;
        export const OrderStatus = `${Root}/orderstatus`;
        export const Role = `${Root}/role`;
        export const User = `${Root}/user`;
        export const UserCar = `${Root}/usercar`;
    }

    export namespace Customer {
        export const Root = "/customer";
        export const Car = `${Root}/car`;
        export const Order = `${Root}/order`;
        export const OrderStatus = `${Root}/orderstatus`;
        export const Role = `${Root}/role`;
        export const User = `${Root}/user`;
        export const UserCar = `${Root}/usercar`;
    }
}