"use client"

import {Item, Menu, useContextMenu} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import {useRef} from "react";
import {useContextFileManager} from "@/context/context-file-manager";
import "@thelicato/react-file-manager/dist/style.css";
import {useParams} from "next/navigation";
import CreateFolderDialog from "@/components/create-folder-dialog";

const MENU_ID = "context-menu";

const StorageLayout = ({children}: { children: React.ReactNode }) => {
    const {show} = useContextMenu();
    const {openCreateFolderDialog} = useContextFileManager();
    const params = useParams();
    const folderId = params.id as string || "0"; // Default to root if no ID

    const containerRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        if (containerRef.current && containerRef.current.contains(event.target as Node)) {
            event.preventDefault();
            show({event, id: MENU_ID});
        }
    };

    return (
        <div
            className="h-full m-4 overflow-auto rounded-lg p-3 bg-gray-100 shadow-md"
            onContextMenu={handleContextMenu}
            ref={containerRef}
        >
            <div className="h-full w-full grid grid-cols-12 grid-rows-12 gap-1 p-2">
                <div className="col-span-2 row-span-12 p-2 border-2">Folder tree</div>
                <div className="col-span-10 row-span-2 p-2 border-2">Storage setting</div>

                <div
                    className="col-span-10 row-span-10 grid grid-cols-8 gap-3 p-3 border-2 overflow-auto"
                >
                    {children}
                </div>
            </div>
            {}
            <CreateFolderDialog/>
            {/* Context Menu */}
            <Menu id={MENU_ID}>
                <Item onClick={() => openCreateFolderDialog(folderId)}>📂 Tạo Folder</Item>
                <Item onClick={() => console.log("Tải lên file")}>📤 Upload File</Item>
                <Item onClick={() => console.log("Đổi tên folder")}>✏️ Đổi tên Folder</Item>
                <Item onClick={() => console.log("Xóa folder")}>🗑️ Xóa Folder</Item>
                <Item onClick={() => console.log("Mở folder")}>📂 Mở Folder</Item>
                <Item onClick={() => console.log("Upload Folder")}>📂 Upload Folder</Item>
            </Menu>
        </div>
    );
}

export default StorageLayout;