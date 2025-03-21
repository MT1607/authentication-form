"use client"

import {Item, Menu, useContextMenu} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import {useRef} from "react";
import {useContextFileManager} from "@/context/context-file-manager";
import "@thelicato/react-file-manager/dist/style.css";

const MENU_ID = "context-menu";


const StorageLayout = ({children}: { children: React.ReactNode }) => {


    const {show} = useContextMenu();
    const {openCreateFolderDialog} = useContextFileManager();

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
            {children}

            {/* Context Menu */}
            <Menu id={MENU_ID}>
                <Item onClick={openCreateFolderDialog}>📂 Tạo Folder</Item>
                <Item onClick={() => console.log("Tải lên file")}>📤 Upload File</Item>
                <Item onClick={() => console.log("Đổi tên folder")}>✏️ Đổi tên Folder</Item>
                <Item onClick={() => console.log("Xóa folder")}>🗑️ Xóa Folder</Item>
                <Item onClick={() => console.log("Mở folder")}>📂 Mở Folder</Item>
                <Item onClick={() => console.log("Upload Folder")}>📂 Upload Folder</Item>
            </Menu>
        </div>
    )
}

export default StorageLayout;