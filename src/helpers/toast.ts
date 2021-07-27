import { toast, Slide } from "react-toastify";

export enum Type {
    "error",
    "success"
}

export function showNotification(message: string, type?: Type, closingTime = 2000) {
    switch (type) {
        case Type.success:
            toast.success(message, {
                position: "bottom-center",
                autoClose: closingTime,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide,
            });
            break;
        case Type.error:
            toast.error(message, {
                position: "bottom-center",
                autoClose: closingTime,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide,
            });
            break;
        default:
            toast.success(message, {
                position: "bottom-center",
                autoClose: closingTime,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Slide,
            });
    }
};