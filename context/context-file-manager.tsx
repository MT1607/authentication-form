"use client"

import {FileType} from "@/utils/type";
import {createContext, useContext, useEffect, useState} from "react";

// Define context type
type ContextFileManagerType = {
    fileContext: FileType[];
    setFileContext: (fileContext: FileType[]) => void;
    isCreateFolderDialogOpen: boolean;
    openCreateFolderDialog: (parentId: string) => void;
    closeCreateFolderDialog: () => void;
    createFolder: (folderName: string) => void;
    uploadFile: (folderName: string, parentId: string) => void;
    currentParentId: string
};

const ContextFileManager = createContext<ContextFileManagerType | null>(null);

// context-file-manager.tsx
export const ContextFileManagerProvider = ({children}: { children: React.ReactNode }) => {
    const [fileContext, setFileContext] = useState<FileType[]>([]);
    const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
    const [currentParentId, setCurrentParentId] = useState("0"); // Default to root

    const openCreateFolderDialog = (parentId: string = "0") => {
        setCurrentParentId(parentId);
        setIsCreateFolderDialogOpen(true);
    };

    const closeCreateFolderDialog = () => {
        setIsCreateFolderDialogOpen(false);
    };

    const createFolder = (name: string) => {
        const newFolder: FileType = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            isDir: true,
            parentId: currentParentId,
            path: `storage/${currentParentId === "0" ? "" : currentParentId}`
        };

        setFileContext([...fileContext, newFolder]);
        closeCreateFolderDialog();
    };

    const uploadFile = (name: string, parentId: string = "0") => {
        setCurrentParentId(parentId);
        const newFile: FileType = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            isDir: false,
            parentId: parentId,
            path: `storage/${parentId}`
        };
        setFileContext([...fileContext, newFile]);
    }

    useEffect(() => {
        sessionStorage.setItem("files", JSON.stringify(fileContext));
    }, [fileContext]);

    return (
        <ContextFileManager.Provider
            value={{
                fileContext,
                setFileContext,
                isCreateFolderDialogOpen,
                openCreateFolderDialog,
                closeCreateFolderDialog,
                createFolder,
                uploadFile,
                currentParentId
            }}
        >
            {children}
        </ContextFileManager.Provider>
    );
};

export const useContextFileManager = () => {
    const context = useContext(ContextFileManager);
    if (!context) {
        throw new Error("useContextFileManager must be used within a ContextFileManagerProvider");
    }
    return context;
};

export default ContextFileManagerProvider;
