import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/helpers/format-file-size";
import { Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFileUpload } from "use-file-upload";

export default function MovieFileUpload({ field, isPending, initialFile }) {
  const [file, selectFile] = useFileUpload();
  const [fileMeta, setFileMeta] = useState({ name: "", size: "" });

  const handleSelectedFile = () => {
    selectFile({ accept: "video/mp4" }, ({ name, size, source, file }) => {
      // console.log("file selected is", { name, size, source, file });

      // Update the form field with the selected file
      field.onChange(file);
      setFileMeta({ name, size: formatFileSize(size) });
    });
  };

  const handleClearFile = () => {
    field.onChange(null); // Clear the file in form state
    setFileMeta({ name: "", size: "" });
  };

  return (
    <div className="flex items-center gap-2 flex-col border-1 p-3 rounded-sm">
      <div className="w-full flex justify-center">
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleSelectedFile}
          disabled={isPending}
        >
          <Upload className="mr-2" /> Upload Video
        </Button>
      </div>
      {field.value && (
        <div className="flex items-center gap-1 w-full truncate   rounded-sm justify-between">
          <div className="flex flex-1 items-center gap-3 max-w-[250px] truncate justify-center ">
            <span
              className="text-sm text-gray-700 truncate"
              title={fileMeta.name}
            >
              {fileMeta.name}
            </span>
            <span className="text-xs text-gray-500">({fileMeta.size})</span>
          </div>
          <Button variant="ghost" type="button" onClick={handleClearFile}>
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
