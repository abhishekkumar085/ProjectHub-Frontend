import type { CreateProjectPayload, Project, ProjectDocument } from "../types/project.types";
import api from "../../../api/axios";


export type ListProjectsResult = {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const listProjects = async (
  page = 1,
  limit = 10
): Promise<ListProjectsResult> => {
  const res = await api.get(`/project/projects?page=${page}&limit=${limit}`);

  const payload = res.data as any;

  // Newer backend wraps data under `data.projects` with pagination metadata
  if (payload?.data?.projects) {
    const projects: Project[] = payload.data.projects;
    const total = payload.data.total ?? projects.length;
    const totalPages = payload.data.totalPages ?? 1;
    const respPage = payload.data.page ?? page;
    const respLimit = payload.data.limit ?? limit;

    return {
      projects,
      total,
      page: respPage,
      limit: respLimit,
      totalPages,
    };
  }

  // fallback when API returns projects array at top-level
  if (Array.isArray(payload?.projects)) {
    const projects: Project[] = payload.projects;
    return { projects, total: projects.length, page, limit, totalPages: 1 };
  }

  return { projects: [], total: 0, page, limit, totalPages: 1 };
};

export const createProject = async (
  payload: CreateProjectPayload,
  files: File[]
): Promise<Project> => {
  const formData = new FormData();

  formData.append("project", JSON.stringify(payload));

  files.forEach((file) => {
    formData.append("documents", file);
  });

  const res = await api.post("/project/create-project", formData);
  return res.data.data;
};

export const updateProject = async (
  id: string,
  payload: Partial<CreateProjectPayload>
): Promise<Project> => {
  const res = await api.patch(`/projects/${id}`, payload);
  return res.data.data;
};

export const deleteProject = async (
  id: string
): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const uploadDocument = async (
  projectId: string,
  file: File
): Promise<ProjectDocument> => {
  const fd = new FormData();
  fd.append("file", file);

  const res = await api.post(
    `/projects/${projectId}/documents`,
    fd
  );

  return res.data.data;
};