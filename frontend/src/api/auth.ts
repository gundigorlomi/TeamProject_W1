import { api, tokenStore } from "./client";
import type { User } from "../types";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function signup(email: string, password: string, agency_name = ""): Promise<User> {
  const t = await api.post<TokenResponse>("/auth/signup", { email, password, agency_name });
  tokenStore.set(t.access_token);
  return api.get<User>("/auth/me");
}

export async function login(email: string, password: string): Promise<User> {
  const t = await api.post<TokenResponse>("/auth/login", { email, password });
  tokenStore.set(t.access_token);
  return api.get<User>("/auth/me");
}

export function logout(): void {
  tokenStore.clear();
}

export function fetchMe(): Promise<User> {
  return api.get<User>("/auth/me");
}
