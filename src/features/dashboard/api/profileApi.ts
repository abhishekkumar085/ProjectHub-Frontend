import api from "../../../api/axios";

export type ProfileUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  empId?: string;
  designation?: string;
  role?: string;
  mobileNumber?: string;
};

export type UpdateProfilePayload = {
  designation: string;
  role: string;
  mobileNumber: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const readStoredUser = (): ProfileUser | null => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getUserFromResponse = (payload: any): ProfileUser => {
  return payload?.data?.user ?? payload?.data?.manager ?? payload?.data ?? payload;
};

const saveStoredUser = (user: ProfileUser) => {
  const storedUser = readStoredUser();
  localStorage.setItem("user", JSON.stringify({ ...storedUser, ...user }));
};

export const getProfile = async (): Promise<ProfileUser> => {
  const storedUser = readStoredUser();
  const userId = storedUser?.id ?? storedUser?._id;

  try {
    const response = await api.get("/profile/profile");
    const user = getUserFromResponse(response.data);
    saveStoredUser(user);
    return user;
  } catch (error) {
    if (!userId) {
      throw error;
    }

    const response = await api.get(`/users/${userId}`);
    const user = getUserFromResponse(response.data);
    saveStoredUser(user);
    return user;
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<ProfileUser> => {
  const storedUser = readStoredUser();
  const userId = storedUser?.id ?? storedUser?._id;

  try {
    if (!userId) {
      throw new Error("Profile id is missing");
    }

    const response = await api.put(`/users/${userId}`, payload);
    const user = { ...storedUser, ...payload, ...getUserFromResponse(response.data) };
    saveStoredUser(user);
    return user;
  } catch (error) {
    const response = await api.patch("/profile/edit-profile", payload);
    const user = { ...storedUser, ...payload, ...getUserFromResponse(response.data) };
    saveStoredUser(user);
    return user;
  }
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<void> => {
  await api.patch("/profile/change-password", payload);
};
