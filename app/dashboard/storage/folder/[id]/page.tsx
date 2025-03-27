"use client"
import {useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useContextFileManager} from "@/context/context-file-manager";
import {Item, Menu, useContextMenu} from "react-contexify";
import {FileComponent} from "@/components/FileComponent";

const FOLDER_MENU_ID = "folder-context-menu";

const FolderPage = () => {
    const params = useParams();
    const folderId = params.id as string;
    const router = useRouter();
    const {fileContext, openCreateFolderDialog} = useContextFileManager();
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const {show} = useContextMenu();

    // Filter files/folders that belong to the current folder
    const folderContents = fileContext.filter(file => file.parentId === folderId);

    // Get current folder details
    const currentFolder = fileContext.find(file => file.id === folderId);

    const handleClick = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        setSelectedFolder(id);
    };

    const handleDoubleClick = (id: string) => {
        const item = fileContext.find(file => file.id === id);
        if (item && item.isDir) {
            router.push(`/storage/folder/${id}`);
        }
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        show({event, id: FOLDER_MENU_ID});
    };

    // Clear selection when clicking on empty space
    const handleContainerClick = () => {
        setSelectedFolder(null);
    };

    return (
        <div className={"col-span-10 gap-5"}>

            <div
                onContextMenu={handleContextMenu}
                onClick={handleContainerClick}
            >
                {folderContents.length === 0 ? (
                    <div className="w-full text-center py-8 text-gray-500">
                        This folder is empty. Right-click to create a folder.
                    </div>
                ) : (
                    folderContents.map((file) => (
                        <div
                            key={file.id}
                            className={`p-2 border rounded w-fit h-fit inline-block ml-2 ${
                                selectedFolder === file.id ? "bg-blue-200" : "bg-white"
                            } hover:shadow-md transition-shadow`}
                            onClick={(event) => handleClick(event, file.id)}
                            onDoubleClick={() => handleDoubleClick(file.id)}
                        >
                            <FileComponent nameFile={file.name} isDir={file.isDir}/>
                        </div>
                    ))
                )}
            </div>

            {/* Context Menu for Folder Page */}
            <Menu id={FOLDER_MENU_ID}>
                <Item onClick={() => openCreateFolderDialog(folderId)}>📂 Tạo Folder Con</Item>
                <Item onClick={() => console.log("Tải lên file vào folder này")}>📤 Upload File</Item>
                <Item onClick={() => console.log("Đổi tên folder")}>✏️ Đổi tên Folder</Item>
                <Item onClick={() => console.log("Xóa folder")}>🗑️ Xóa Folder</Item>
            </Menu>
        </div>
    );
};

export default FolderPage;