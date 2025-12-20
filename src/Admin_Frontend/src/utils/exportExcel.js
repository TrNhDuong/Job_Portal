// src/utils/exportExcel.js
import * as XLSX from 'xlsx';

/**
 * Hàm xuất dữ liệu ra file Excel
 * @param {Array} data - Mảng dữ liệu JSON cần xuất (Ví dụ: danh sách User)
 * @param {String} fileName - Tên file muốn lưu (không cần đuôi .xlsx)
 * @param {String} sheetName - Tên của Sheet trong Excel
 */
export const exportToExcel = (data, fileName = 'report', sheetName = 'Sheet1') => {
  try {
    // 1. Tạo Worksheet từ dữ liệu JSON
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Tạo Workbook (file Excel ảo)
    const workbook = XLSX.utils.book_new();

    // 3. Gắn Worksheet vào Workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Xuất file và tải xuống
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error("Lỗi xuất Excel:", error);
    return false;
  }
};