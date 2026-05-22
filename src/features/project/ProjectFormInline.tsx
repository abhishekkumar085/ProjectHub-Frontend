import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
    createProject,
    updateProject,
} from "./api/projectApi";
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
import type { CreateProjectPayload, Project, ProjectDocument, ProjectPriority, ProjectStatus } from "./types/project.types";

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

export default function ProjectFormInline({ project, isEditMode, isViewMode, onSaved }: Props) {
    const isEditing = !!project || !!isEditMode;
    const isViewOnly = !!isViewMode;
    const [previewDocument, setPreviewDocument] = useState<ProjectDocument | null>(null);

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
                await createProject(payload, documents.map((doc) => doc.file).filter((f): f is File => !!f));
                showSuccessToast("Project created successfully.");
            } else if (project) {
                await updateProject(
                    project.id,
                    payload,
                    documents
                        .map((doc) => doc.file)
                        .filter((f): f is File => !!f)
                );
                showSuccessToast("Project updated successfully.");
            }

            onSaved?.();
        } catch (error: any) {
            console.error(error);
            showErrorToast(error?.message || "Unable to save project. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const removeDocument = (id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">{isViewOnly ? "View Project" : isEditing ? "Edit Project" : "Add Project"}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Name *</label>
                    <input {...register("name", { required: true })} disabled={isViewOnly} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message || "Project name is required"}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea rows={3} {...register("description", { required: "Description is required" })} disabled={isViewOnly} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select {...register("status")} disabled={isViewOnly} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
                            {statuses.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                        <select {...register("priority")} disabled={isViewOnly} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">
                            {priorities.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
                        <input {...register("clientName", { required: "Client name is required" })} disabled={isViewOnly} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" placeholder="Optional" />
                        {errors.clientName && <p className="mt-1 text-sm text-red-500">{errors.clientName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                        <input type="date" {...register("startDate", { required: "Start date is required" })} disabled={isViewOnly} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                        {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                        <input type="date" {...register("endDate", { required: "End date is required" })} disabled={isViewOnly} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                        {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate.message}</p>}
                    </div>
                    <div className="space-y-4 md:col-span-2 xl:col-span-3">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Environment Links</label>

                        <div className="space-y-4">
                            {[
                                { name: "devUrl", label: "DEV", color: "bg-blue-100 text-blue-700" },
                                { name: "uatUrl", label: "UAT", color: "bg-orange-100 text-orange-700" },
                                { name: "prodUrl", label: "PROD", color: "bg-green-100 text-green-700" },
                            ].map((env) => {
                                const envValue = getValues(env.name as keyof CreateProjectPayload) as string;
                                return (
                                    <div key={env.name} className="grid gap-3 sm:grid-cols-[80px_1fr_auto] items-start">
                                        <div className={`flex h-12 items-center justify-center rounded-xl text-xs font-bold ${env.color}`}>
                                            {env.label}
                                        </div>

                                        <input
                                            {...register(env.name as keyof CreateProjectPayload, {
                                                required: `${env.label} URL is required`,
                                                validate: (value) => validateUrl(value) || "Invalid URL",
                                            })}
                                            disabled={isViewOnly}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                            placeholder={`https://${env.label.toLowerCase()}.example.com`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(envValue)}
                                            disabled={!envValue}
                                            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Copy
                                        </button>
                                        {errors[env.name as keyof CreateProjectPayload] && (
                                            <p className="sm:col-span-3 mt-1 text-sm text-red-500">{errors[env.name as keyof CreateProjectPayload]?.message}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Developers</label>
                    <div className="flex gap-2">
                        <input value={developerInput} onChange={(e) => setDeveloperInput(e.target.value)} onKeyDown={handleDeveloperKeyDown} disabled={isViewOnly} className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" placeholder="Type name and press Enter" />
                        {!isViewOnly && (
                            <button type="button" onClick={addDeveloper} className="rounded-xl border border-slate-300 px-4 py-2">Add</button>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {developers.map((d) => (
                            <div key={d} className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                <FiUser size={14} />{d}
                                {!isViewOnly && (
                                    <button type="button" onClick={() => removeDeveloper(d)} className="ml-1"><FiX size={14} /></button>
                                )}
                            </div>
                        ))}
                    </div>
                    {(errors.developers || developerError) && (
                        <p className="mt-2 text-sm text-red-500">{developerError || errors.developers?.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Documents</label>
                    {!isViewOnly && (
                        <div className="flex items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                                <FiUploadCloud size={18} /> {uploadingFile ? "Uploading..." : "Upload Documents"}
                                <input type="file" hidden multiple onChange={handleFileUpload} />
                            </label>
                            <span className="text-sm text-slate-500">Multiple files supported</span>
                        </div>
                    )}

                    <div className="mt-4 space-y-2">
                        {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm"><FiFileText size={16} className="text-slate-500" /></div>
                                    <div>
                                        <p className="font-medium text-slate-800 truncate w-32 sm:w-60">{doc.originalName}</p>
                                        <p className="text-xs text-slate-500">{doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : 'File'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setPreviewDocument(doc)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                                        <FiEye />
                                    </button>
                                    {!isViewOnly && (
                                        <button type="button" onClick={() => removeDocument(doc.id)} className="text-red-500"><FiTrash2 /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {(errors.documents || documentError) && (
                        <p className="mt-2 text-sm text-red-500">{documentError || errors.documents?.message}</p>
                    )}
                </div>

                {!isViewOnly && (
                    <div className="flex justify-end gap-3">
                        <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 text-white">{saving ? 'Saving...' : isEditing ? 'Edit Project' : 'Add Project'}</button>
                    </div>
                )}
            </form>

            {previewDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Document Preview</h2>
                                <p className="mt-1 text-sm text-slate-500 truncate">{previewDocument.originalName}</p>
                            </div>
                            <button onClick={() => setPreviewDocument(null)} className="rounded-lg p-2 hover:bg-slate-100">
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
        </div>
    );
}
