export const formatDateToInput = (isoString: string) => {
    // console.log(isoString);
    if (!isoString) return "";
    return isoString.split("T")[0]; // Lấy phần "YYYY-MM-DD"
};