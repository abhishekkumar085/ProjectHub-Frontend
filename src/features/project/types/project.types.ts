export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export type ProjectPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface ProjectDocument {
  id: string;
  projectId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  file?: File;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  clientName: string | null;
  // budget: string | null;
  startDate: string | null;
  endDate: string | null;
  developers: string[];
  devUrl: string | null;
  uatUrl: string | null;
  prodUrl: string | null;
  // ownerId: string;
  documents: ProjectDocument[];
  // createdAt: string;
  // updatedAt: string;
}



export interface CreateProjectPayload {
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  clientName?: string | null;
  
  startDate?: string | null;
  endDate?: string | null;
  developers?: string[];
  devUrl?: string | null;
  uatUrl?: string | null;
  prodUrl?: string | null;
  documents?: ProjectDocument[];
  validate?: (value: string) => boolean | string;
}
export interface Project {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
}