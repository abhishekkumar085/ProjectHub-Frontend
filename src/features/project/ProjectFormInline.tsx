import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createProject, updateProject } from "./api/projectApi";
import api from "../../api/axios";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

import {
  FiUploadCloud,
  FiTrash2,
  FiFileText,
  FiUser,
  FiX,
  FiEye,
} from "react-icons/fi";
import type {
  CreateProjectPayload,
  Project,
  ProjectDocument,
  ProjectPriority,
  ProjectStatus,
} from "./types/project.types";

interface Props {
  project?: Project | null;
  isEditMode?: boolean;
  isViewMode?: boolean;
  onSaved?: () => void;
}

const statuses: { value: ProjectStatus; label: string }[] = [
  { value: "PLANNING", label: "Planning" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "REVIEW", label: "Review" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "CANCELLED", label: "Cancelled" },
];

const priorities: { value: ProjectPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

export default function ProjectFormInline({
  project,
  isEditMode,
  isViewMode,
  onSaved,
}: Props) {
  const isEditing = !!project || !!isEditMode;
  const isViewOnly = !!isViewMode;
  const [previewDocument, setPreviewDocument] =
    useState<ProjectDocument | null>(null);

  const getDocumentUrl = (doc: ProjectDocument) => {
    if (doc.file) {
      return URL.createObjectURL(doc.file);
    }

    const baseUrl = (api.defaults.baseURL || "").replace(/\/$/, "");
    if (doc.filename?.startsWith("http")) {
      return doc.filename;
    }

    if (doc.projectId && doc.filename) {
      return `${baseUrl}/project/${doc.projectId}/documents/${encodeURIComponent(doc.filename)}`;
    }

    return "";
  };

  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [developerInput, setDeveloperInput] = useState("");
  const [developers, setDevelopers] = useState<string[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [developerError, setDeveloperError] = useState("");
  const [documentError, setDocumentError] = useState("");

  const [isAssignedOpen, setIsAssignedOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const assignedOptions = ["John", "Rahul", "Priya", "Admin"];

  const handleAssignedChange = (value: string) => {
    setAssignedTo((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateProjectPayload>({
    defaultValues: {
      name: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      clientName: "",
      startDate: "",
      endDate: "",
      devUrl: "",
      uatUrl: "",
      prodUrl: "",
    },
  });

  const copyToClipboard = async (value: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || "",
        status: project.status,
        priority: project.priority,
        clientName: project.clientName || "",
        startDate: project.startDate?.slice(0, 10) || "",
        endDate: project.endDate?.slice(0, 10) || "",
        devUrl: project.devUrl || "",
        uatUrl: project.uatUrl || "",
        prodUrl: project.prodUrl || "",
      });

      setDevelopers(project.developers || []);
      setDocuments(project.documents || []);
    } else {
      reset();
      setDevelopers([]);
      setDocuments([]);
    }
  }, [project, reset]);

  const validateUrl = (value: any) => {
    if (!value || typeof value !== "string") return true;

    try {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const addDeveloper = () => {
    const value = developerInput.trim();
    if (!value) return;
    if (developers.includes(value)) {
      setDeveloperInput("");
      return;
    }
    setDevelopers([...developers, value]);
    setDeveloperInput("");
    setDeveloperError("");
    clearErrors("developers");
  };

  const removeDeveloper = (name: string) => {
    setDevelopers(developers.filter((d) => d !== name));
  };

  const handleDeveloperKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addDeveloper();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingFile(true);

      const selectedDocs = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        originalName: file.name,
        size: file.size,
        file,
      }));

      setDocuments((prev: any) => [...selectedDocs, ...prev]);
      setDocumentError("");
      clearErrors("documents");
    } catch (error) {
      console.error("File selection failed", error);
    } finally {
      setUploadingFile(false);
    }
  };

  const onSubmit = async (data: CreateProjectPayload) => {
    clearErrors();
    setDeveloperError("");
    setDocumentError("");

    if (developers.length === 0) {
      const message = "At least one developer is required";
      setError("developers", { type: "required", message });
      setDeveloperError(message);
      return;
    }

    if (documents.length === 0) {
      const message = "At least one document is required";
      setError("documents", { type: "required", message });
      setDocumentError(message);
      return;
    }

    try {
      setSaving(true);

      const payload: CreateProjectPayload = { ...data, developers };

      if (!isEditing) {
        await createProject(
          payload,
          documents.map((doc) => doc.file).filter((f): f is File => !!f),
        );
        showSuccessToast("Project created successfully.");
      } else if (project) {
        await updateProject(
          project.id,
          payload,
          documents.map((doc) => doc.file).filter((f): f is File => !!f),
        );
        showSuccessToast("Project updated successfully.");
      }

      onSaved?.();
    } catch (error: any) {
      console.error(error);
      showErrorToast(
        error?.message || "Unable to save project. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="">
      <div
        className=" 
   "
      >
        <h2 className="text-[20px] font-semibold leading-[100%] tracking-[0%] text-[#00076F] font-[Poppins] mb-4">
          {isViewOnly
            ? "View Project"
            : isEditing
              ? "Edit Project"
              : "Add Project"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="card p-5 space-y-4 md:col-span-2 xl:col-span-3 bg-white  rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Name
                <span className="text-[#E72027] font-[Poppins] font-medium text-[14px] leading-[100%] tracking-[0px]">
                  *
                </span>
              </label>
              <input
                {...register("name", { required: true })}
                disabled={isViewOnly}
                placeholder="Enter Project Name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 
             placeholder:font-[Poppins] placeholder:font-medium placeholder:text-[14px] 
             placeholder:leading-[100%] placeholder:tracking-[0px] placeholder:text-[#7A7A7A]"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message || "Project name is required"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description", {
                  required: "Description is required",
                })}
                disabled={isViewOnly}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned To
                </label>

                {/* Selected Cards */}
                {assignedTo.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {assignedTo.map((person) => (
                      <div
                        key={person}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        {person}
                        {!isViewOnly && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignedChange(person);
                            }}
                            className="ml-1"
                          >
                            <FiX size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown Button */}
                <div
                  onClick={() =>
                    !isViewOnly && setIsAssignedOpen(!isAssignedOpen)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 cursor-pointer bg-white"
                >
                  {assignedTo.length > 0
                    ? `${assignedTo.length} selected`
                    : "Select Assigned To"}
                </div>

                {/* Dropdown Options */}
                {isAssignedOpen && (
                  <div className="absolute mt-2 w-full bg-white border border-slate-300 rounded-xl shadow-lg z-10 p-3">
                    {assignedOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={assignedTo.includes(option)}
                          onChange={() => handleAssignedChange(option)}
                          disabled={isViewOnly}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  {...register("status")}
                  disabled={isViewOnly}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  disabled={isViewOnly}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Client Name
                </label>
                <input
                  {...register("clientName", {
                    required: "Client name is required",
                  })}
                  disabled={isViewOnly}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Optional"
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.clientName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  disabled={isViewOnly}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  {...register("endDate", { required: "End date is required" })}
                  disabled={isViewOnly}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* card two */}
          <div className="card p-5 space-y-4 md:col-span-2 xl:col-span-3 bg-white  rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
            <label className="block font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-2">
              Environment Links
            </label>

            <div className="space-y-4">
              {[
                {
                  name: "devUrl",
                  label: "DEV",
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  name: "uatUrl",
                  label: "UAT",
                  color: "bg-orange-100 text-orange-700",
                },
                {
                  name: "prodUrl",
                  label: "PROD",
                  color: "bg-green-100 text-green-700",
                },
              ].map((env) => {
                const envValue = getValues(
                  env.name as keyof CreateProjectPayload,
                ) as string;
                return (
                  <div className=" px-2 py-0 bg-white border border-[#E5E5E5] rounded-lg">
                    <div
                      key={env.name}
                      className="grid gap-3 sm:grid-cols-[80px_1fr_auto] flex justify-center items-center"
                    >
                      <div
                        className={`flex w-[55px] h-[30px] items-center justify-center rounded-[26px] px-4 py-[6px] text-xs font-bold ${env.color}`}
                      >
                        {env.label}
                      </div>

                      <input
                        {...register(env.name as keyof CreateProjectPayload, {
                          required: `${env.label} URL is required`,
                          validate: (value) =>
                            validateUrl(value) || "Invalid URL",
                        })}
                        disabled={isViewOnly}
                        className="w-full rounded-xl px-4 py-3 outline-none focus:outline-none font-[Poppins] placeholder:text-[#7A7A7A] placeholder:font-medium placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0px]"
                        placeholder="Enter here..."
                      />
                      {errors[env.name as keyof CreateProjectPayload] && (
                        <p className="sm:col-span-3 mt-1 text-sm text-red-500">
                          {
                            errors[env.name as keyof CreateProjectPayload]
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-5 space-y-4 md:col-span-2 xl:col-span-3 bg-white  rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
            <label className="block font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-2">
              Developers
            </label>
            <div className="flex gap-2">
              <input
                value={developerInput}
                onChange={(e) => setDeveloperInput(e.target.value)}
                onKeyDown={handleDeveloperKeyDown}
                disabled={isViewOnly}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Type name and press Enter"
              />
              {!isViewOnly && (
                <button
                  type="button"
                  onClick={addDeveloper}
                  className="rounded-xl border border-[#0059FF] bg-white px-4 py-2 
             font-[Poppins] font-medium text-[14px] 
             leading-[100%] tracking-[0px] text-center align-middle 
             text-[#0059FF] hover:bg-blue-50 transition"
                >
                  Add
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {developers.map((d) => (
                <div
                  key={d}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  <FiUser size={14} />
                  {d}
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={() => removeDeveloper(d)}
                      className="ml-1"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {(errors.developers || developerError) && (
              <p className="mt-2 text-sm text-red-500">
                {developerError || errors.developers?.message}
              </p>
            )}
          </div>

          <div className="card p-5 space-y-4 md:col-span-2 xl:col-span-3 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
            <label className="block font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-2">
              Documents
            </label>

            {!isViewOnly && (
              <div
                className="w-[542px] h-[202px] border-2 border-dashed border-blue-400 rounded-2xl bg-[#F3F6FB] p-8 text-center cursor-pointer hover:bg-[#EEF4FF] transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload({
                    target: { files: e.dataTransfer.files },
                  } as any);
                }}
              >
                <label className="cursor-pointer flex flex-col items-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-blue-500 text-blue-600 mb-4">
                    <FiUploadCloud size={28} />
                  </div>
                  <p className="font-[Poppins] font-medium text-[16px] leading-[24px] tracking-[0%] text-center align-middle text-slate-800">
                    Drag & drop files or{" "}
                    <span className="text-blue-600 underline">Browse</span>
                  </p>

                  <p className="font-[Poppins] font-normal text-[12px] leading-[18px] tracking-[0%] text-center align-middle text-[#444444] mt-2">
                    Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word,
                    PPT
                  </p>

                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
            {/* Uploaded Files List */}
            <div className="mt-4 space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                      <FiFileText size={16} className="text-slate-500" />
                    </div>

                    <div>
                      <p className="font-medium text-slate-800 truncate w-32 sm:w-60">
                        {doc.originalName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {doc.size
                          ? `${(doc.size / 1024 / 1024).toFixed(2)} MB`
                          : "File"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewDocument(doc)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                      <FiEye />
                    </button>

                    {!isViewOnly && (
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(errors.documents || documentError) && (
              <p className="mt-2 text-sm text-red-500">
                {documentError || errors.documents?.message}
              </p>
            )}
          </div>
        </form>
      </div>

      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Document Preview
                </h2>
                <p className="mt-1 text-sm text-slate-500 truncate">
                  {previewDocument.originalName}
                </p>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="h-[60vh] sm:h-[75vh] bg-slate-100">
              {getDocumentUrl(previewDocument) ? (
                <iframe
                  title={previewDocument.originalName}
                  src={getDocumentUrl(previewDocument)}
                  className="h-full w-full rounded-b-2xl"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Document preview is not available for this file.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-end gap-6 mt-4">
        {/* Cancel Button */}
        <button
          type="button"
          className="w-[99px] h-[45px] px-[24px] py-[12px] rounded-[8px] border border-[#7A7A7A] 
             bg-white font-[Poppins] font-medium text-[14px] 
             leading-[100%] tracking-[0px] text-center align-middle 
             text-[#7A7A7A] hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        {/* Save Details Button */}
        <button
          type="submit"
          className=" h-[45px] px-[24px] py-[12px] rounded-[8px] 
             bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)] 
             font-[Poppins] font-medium text-[14px] 
             leading-[100%] tracking-[0px] text-center align-middle 
             text-white 
             shadow-[0px_2px_6px_rgba(0,0,0,0.15)] 
             hover:opacity-90 transition"
          style={{
            borderImage: "linear-gradient(90deg, #6B9FFF 0%, #0059FF 100%) 1",
          }}
        >
          Save Details
        </button>
      </div>
    </div>
  );
}
