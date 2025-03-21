"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useContextFileManager} from "@/context/context-file-manager";
import Image from "next/image";

const StoragePage = () => {
    const {fileContext} = useContextFileManager();
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const router = useRouter();

    const handleClick = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        setSelectedFolder(id);
    };

    const handleDoubleClick = (id: string) => {
        router.push(`storage/folder/${id}`);
    };

    return (
        <div className="h-full w-full grid grid-cols-12 grid-rows-12 gap-1 p-2">
            <div className="col-span-2 row-span-12 p-2 border-2">Folder tree</div>
            <div className="col-span-10 row-span-2 p-2 border-2">Storage setting</div>

            <div className="col-span-10 row-span-10 grid grid-cols-8 gap-3 p-3 border-2 overflow-auto">
                {fileContext?.map((file) => (
                    <div
                        key={file.id}
                        className={`p-2 border rounded w-fit h-fit ${
                            selectedFolder === file.id ? "bg-blue-200" : "bg-white"
                        }`}
                        onClick={(event) => handleClick(event, file.id)}
                        onDoubleClick={() => handleDoubleClick(file.id)}
                    >
                        {file.isDir && (
                            <div className={"flex flex-col items-center justify-center"}>
                                <Image src="/folder-icon.svg" alt="folder icon" width={100} height={100}/>
                                <span>{file.name}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoragePage;
