"use client";

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

const SessionExpiredCard = () => {
    const router = useRouter();

    const handleOK = () => {
        router.push("/login");
    };

    return (
        <Dialog open>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-red-600">Phiên đăng nhập hết hạn</DialogTitle>
                </DialogHeader>
                <p className="text-gray-700 text-center">Vui lòng đăng nhập lại để tiếp tục sử dụng.</p>
                <DialogFooter>
                    <Button onClick={handleOK} className="bg-blue-500 hover:bg-blue-600">
                        OK
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SessionExpiredCard;
