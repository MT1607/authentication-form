"use client"

import {FileType} from "@/utils/type";
import {createContext, useContext, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

// Define context type
type ContextFileManagerType = {
    fileContext: FileType[];
    openCreateFolderDialog: () => void;
    handleCreateFolder: (folderName: string) => void;
};

const ContextFileManager = createContext<ContextFileManagerType | null>(null);

const ContextFileManagerProvider = ({children}: { children: React.ReactNode }) => {
    const [fileContext, setFileContext] = useState<FileType[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const folderNameRef = useRef<HTMLInputElement>(null);

    const openCreateFolderDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCreateFolder = (folderName: string) => {
        if (!folderName.trim()) return;

        const id = Date.now().toString();
        const parentId = "0";
        const newFolder: FileType = {
            id,
            name: folderName,
            isDir: true,
            parentId,
            path: parentId ? `${fileContext.find(f => f.id === parentId)?.path || ''}/${folderName}` : `/${folderName}`,
        };

        setFileContext(prev => [...prev, newFolder]);
        setIsDialogOpen(false);
    };

    return (
        <ContextFileManager.Provider value={{fileContext, openCreateFolderDialog, handleCreateFolder}}>
            {children}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>Nhập tên thư mục</DialogHeader>
                    <Input ref={folderNameRef} placeholder="Tên thư mục"/>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)} variant="outline">Hủy</Button>
                        <Button onClick={() => handleCreateFolder(folderNameRef.current?.value || "")}>
                            Tạo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
