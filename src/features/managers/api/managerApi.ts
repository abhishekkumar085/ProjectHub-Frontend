import api from "../../../api/axios";
import type {
  CreateManagerPayload,
  Manager,
} from "../types/manager.types";

export type ListManagersResult = {
  users: Manager[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const listManagers =
  async (page = 1, limit = 10): Promise<ListManagersResult> => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);

    const payload = response.data as any;

    if (Array.isArray(payload)) {
      return { users: payload, total: payload.length, page, limit, totalPages: 1 };
    }

    const users = payload?.data?.users ?? [];
    const total = payload?.data?.total ?? users.length;
    const totalPages = payload?.data?.totalPages ?? 1;
    const respPage = payload?.data?.page ?? page;
    const respLimit = payload?.data?.limit ?? limit;

    return {
      users,
      total,
      page: respPage,
      limit: respLimit,
      totalPages,
    };
  };

export const createManager = async (
  payload: CreateManagerPayload
): Promise<Manager> => {
  const response = await api.post(
    "/auth/register",
    payload
  );

  return response.data;
};

export const updateManager = async (
  id: string,
  payload: CreateManagerPayload
): Promise<Manager> => {
  const response = await api.put(
    `/managers/${id}`,
    payload
  );

  return response.data;
};

export const deleteManager = async (
  id: string
): Promise<void> => {
  await api.delete(
    `/managers/${id}`
  );
};