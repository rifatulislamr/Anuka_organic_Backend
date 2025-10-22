"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateFields = exports.formatDate = void 0;
const formatDate = (yyyymmdd) => {
    if (!yyyymmdd || !/^\d{8}$/.test(yyyymmdd))
        return null;
    return new Date(`${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`);
};
exports.formatDate = formatDate;
const parseDateFields = (data, dateFields) => {
    const result = Object.assign({}, data);
    for (const field of dateFields) {
        if (typeof result[field] === "string" && result[field].trim() !== "") {
            const parsedDate = new Date(result[field]);
            result[field] = isNaN(parsedDate.getTime()) ? null : parsedDate;
        }
        else if (result[field] === "") {
            result[field] = null;
        }
    }
    return result;
};
exports.parseDateFields = parseDateFields;
