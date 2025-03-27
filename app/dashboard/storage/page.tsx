"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useContextFileManager} from "@/context/context-file-manager";
import {FileComponent} from "@/components/FileComponent";

const StoragePage = () => {
    const {fileContext} = useContextFileManager();
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const router = useRouter();

    // Filter to only show root folders (parentId === "0" or undefined)
    const rootFolders = fileContext.filter(file => file.parentId === "0");

    const handleClick = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        setSelectedFolder(id);
    };

    const handleDoubleClick = (id: string) => {
        router.push(`storage/folder/${id}`);
    };

    return (
        <div className={"col-span-10 flex flex-row gap-2"}>
            {rootFolders.length === 0 ? (
                <div className="w-full text-center py-8 text-gray-500">
                    No folders yet. Right-click to create a new folder.
                </div>
            ) : (
                rootFolders.map((file) => (
                    <div
                        key={file.id}
                        className={`p-2 border rounded w-fit h-fit hover:shadow-md transition-shadow ${
                            selectedFolder === file.id ? "bg-blue-200" : "bg-white"
                        }`}
                        onClick={(event) => handleClick(event, file.id)}
                        onDoubleClick={() => handleDoubleClick(file.id)}
                    >
                        <FileComponent nameFile={file.name} isDir={file.isDir}/>
                    </div>
                ))
            )}
        </div>
    );
};

export default StoragePage;