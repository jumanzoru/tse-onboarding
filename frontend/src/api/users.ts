import { get, handleAPIError, post } from "src/api/requests";

import type { APIResult } from "src/api/requests";

export type User = {
  _id: string;
  name: string;
  profilePictureURL?: string | null;
};

export type CreateUserRequest = {
  name: string;
  profilePictureURL?: string | null;
};

export async function createUser(user: CreateUserRequest): Promise<APIResult<User>> {
  try {
    const response = await post("/api/user", user);
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function getUser(id: string): Promise<APIResult<User>> {
  try {
    const response = await get(`/api/user/${id}`);
    const json = (await response.json()) as User;
    return { success: true, data: json };
  } catch (error) {
    return handleAPIError(error);
  }
}
