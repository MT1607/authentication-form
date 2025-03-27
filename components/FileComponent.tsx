import Image from "next/image";

export const FileComponent = ({
                                  nameFile,
                                  isDir,
                                  imagePath // Add a new prop for the full image path
                              }: {
    nameFile: string,
    isDir: boolean,
    imagePath?: string
}) => {
    // Function to truncate file name
    const truncateFileName = (filename: string, maxLength: number = 10) => {
        const extensionIndex = filename.lastIndexOf('.');
        if (extensionIndex === -1) return filename;

        const name = filename.substring(0, extensionIndex);
        const extension = filename.substring(extensionIndex);

        if (name.length <= maxLength) return filename;

        return `${name.substring(0, maxLength)}...${extension}`;
    };

    const splitName = nameFile.split(".").pop()?.toLowerCase();
    const truncatedFileName = truncateFileName(nameFile);

    // Common image rendering logic
    const renderImageFile = (src: string, alt: string) => (
        <div className={"flex flex-col items-center justify-center"}>
            <div className="w-20 h-20 relative">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    style={{objectFit: 'contain'}}
                    onError={(e) => {
                        // Fallback to default icon if image fails to load
                        (e.target as HTMLImageElement).src = '/default-file-icon.svg';
                    }}
                />
            </div>
            <span className="text-sm text-center overflow-hidden text-ellipsis max-w-full">{truncatedFileName}</span>
        </div>
    );

    if (isDir) {
        return renderImageFile("/folder-icon.svg", "folder icon");
    }

    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
    if (imageExtensions.includes(splitName || '')) {
        // Use the provided imagePath, or fallback to a default icon if not provided
        return renderImageFile(imagePath || "/image-icon.svg", "image file");
    }

    if (splitName === "pdf") {
        return renderImageFile("/pdf-document.svg", "pdf icon");
    }

    if (splitName === "docx" || splitName === "doc") {
        return renderImageFile("/word-document.svg", "word icon");
    }

    if (splitName === "xlsx" || splitName === "xls") {
        return renderImageFile("/excel-document.svg", "excel icon");
    }

    // Default fallback for unknown file types
    return renderImageFile("/default-file-icon.svg", "file icon");
}