import api from "../lib/api";
import type { ApiAuthResponse } from "../types/api";

export interface RegisterCustomerPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterSellerPayload {
  shopName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: "customer" | "seller";
}

export interface VerifyEmailPayload {
  email: string;
  verificationCode: number;
}

export const authService = {
  registerCustomer: (payload: RegisterCustomerPayload) =>
    api
      .post<{ message: string }>("/auth/register/customer", payload)
      .then((r) => r.data),

  registerSeller: (payload: RegisterSellerPayload) =>
    api
      .post<{ message: string }>("/auth/register/seller", payload)
      .then((r) => r.data),

  verifyEmail: (payload: VerifyEmailPayload) =>
    api
      .post<ApiAuthResponse>("/auth/verify", payload)
      .then((r) => r.data),

  login: (payload: LoginPayload) =>
    api
      .post<ApiAuthResponse>("/auth/login", payload)
      .then((r) => r.data),

  logout: () =>
    api
      .post<{ message: string }>("/auth/logout")
      .then((r) => r.data),
};
