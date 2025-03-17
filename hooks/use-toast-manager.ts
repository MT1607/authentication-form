import {toast} from "@/hooks/use-toast";

type ToastType = "success" | "error" | "loading" | "default";

export const useToastManager = () => {
    const showToast = (type: ToastType, message: string) => {
        switch (type) {
            case "success":
                toast({
                    variant: "default",
                    className: "border border-green-500 bg-green-100 text-green-700",
                    description: message,
                });
                break;
            case "error":
                toast({
                    variant: "destructive",
                    description: message,
                });
                break;
            case "loading":
                toast({
                    variant: "default",
                    className: "border border-yellow-500 bg-yellow-100 text-yellow-700",
                    description: message,
                });
                break;
            default:
                toast({
                    variant: "default",
                    description: message,
                });
                break;
        }
    };

    return {showToast};
};
