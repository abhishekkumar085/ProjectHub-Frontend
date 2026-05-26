import {
  FiDownload,
  FiFileText,
  FiX,
} from "react-icons/fi";

import type {
  ProjectDocument,
} from "./types/project.types";

interface Props {
  open: boolean;

  onClose: () => void;

  documents: ProjectDocument[];

  projectName: string;
}

function ProjectDocumentsModal({
  open,
  onClose,
  documents,
  projectName,
}: Props) {
  if (!open) return null;

  const handleDownload = (
    doc: any
  ) => {
    // REAL API FILE DOWNLOAD LATER
    // for now dummy download

    const link =
      document.createElement("a");

    link.href =
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

    const name = doc.originalName || doc.name || doc.filename || doc.file?.name || (doc.url ? String(doc.url).split('/')?.pop() : 'document');
    link.download = name;

    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Project Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {projectName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {documents.length === 0 ? (
            <div className="py-14 text-center">
              <FiFileText
                size={42}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 text-slate-500">
                No documents found
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                      <FiFileText
                        size={20}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <p className="font-medium text-slate-800">
                        {doc.originalName || doc.name || doc.filename || doc.file?.name || (doc.url ? String(doc.url).split('/')?.pop() : 'Untitled')}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(
                          doc.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>

                  {/* Download */}
                  <button
                    onClick={() =>
                      handleDownload(doc)
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <FiDownload />

                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDocumentsModal;