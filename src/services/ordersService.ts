import api from "../lib/api";
import type { ApiOrder } from "../types/api";

export const ordersService = {
  getCustomerOrders: () =>
    api
      .get<{ message: string; orders: ApiOrder[] }>("/customer/orders")
      .then((r) => r.data.orders),
};
