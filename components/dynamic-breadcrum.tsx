"use client";

import {usePathname} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";


const toTitleCase = (str: string) =>
    str
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());


const DynamicBreadcrumb = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                    const href = "/" + pathSegments.slice(0, index + 1).join("/"); // Tạo đường dẫn cho segment
                    const isLast = index === pathSegments.length - 1;
                    const formattedSegment = toTitleCase(decodeURIComponent(segment)); // Định dạng chữ viết hoa

                    return (
                        <BreadcrumbItem key={href}>
                            {isLast ? (
                                <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink href={href}>{formattedSegment}</BreadcrumbLink>
                                    <BreadcrumbSeparator/>
                                </>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DynamicBreadcrumb;
