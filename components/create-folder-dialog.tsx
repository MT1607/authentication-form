"use client"

import {useState} from "react";
import {useContextFileManager} from "@/context/context-file-manager";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

const CreateFolderDialog = () => {
    const {isCreateFolderDialogOpen, closeCreateFolderDialog, createFolder, currentParentId} = useContextFileManager();
    const [folderName, setFolderName] = useState("");

    if (!isCreateFolderDialogOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (folderName.trim()) {
            createFolder(folderName.trim());
            setFolderName("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>
                        {currentParentId === "0" ? "Tạo Folder Mới" : "Tạo Folder Con"}
                    </CardTitle>
                    <CardDescription>
                        Enter folder name
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="folderName">Tên Folder</Label>
                                <Input
                                    id="folderName"
                                    placeholder="Nhập tên folder"
                                    value={folderName}
                                    onChange={(e) => setFolderName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={closeCreateFolderDialog}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!folderName.trim()}
                        >
                            Create
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CreateFolderDialog;