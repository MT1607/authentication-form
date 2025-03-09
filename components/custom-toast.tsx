import React from "react";
import {toast} from "@/hooks/use-toast";
import {CheckCircleIcon, Loader2, XCircleIcon} from "lucide-react";

interface typeToast {
    type: string
    message: string
}

export const CustomToast = ({type}: { type: typeToast }) => {
    switch (type.type) {
        case "success":
            console.log("toast success!");
            return (
                toast({
                    variant: "default",
                    className: "border border-green-500 bg-green-100 text-green-700",
                    description: (
                        <div>
                            <span><CheckCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                            {type.message}
                        </div>
                    )
                })
            )
            break;
        case "error":
            return (
                toast({
                    variant: "destructive",
                    description: (
                        <div>
                            <span><XCircleIcon className="h-6 w-6 mr-2 text-white-500 inline"/></span>
                            {type.message}
                        </div>
                    )
                })
            )
            break
        case "loading":
            return (
                toast({
                    variant: "default", // Giữ giao diện mặc định
                    description: (
                        <div className="flex items-center">
                            <Loader2 className="h-6 w-6 mr-2 animate-spin"/>
                            Logging...
                        </div>
                    )
                })
            )
    }
}

export default CustomToast