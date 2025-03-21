"use client"
import {useParams} from "next/navigation";

const FolderPage = () => {
    const params = useParams();
    const folderId = params.id;

    return (
        <h1>{folderId}</h1>
    )
}

export default FolderPage;