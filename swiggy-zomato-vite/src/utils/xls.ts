import * as XLSX from "xlsx";

export const saveXLS = (orderList: any, errorList: any) => {
  const orderWorksheet = XLSX.utils.json_to_sheet(orderList);
  const errorWorksheet = XLSX.utils.json_to_sheet(errorList);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, orderWorksheet, "Orders");
  XLSX.utils.book_append_sheet(
    workbook,
    errorWorksheet,
    "Cancel-Refund-Error Orders"
  );
  XLSX.writeFile(workbook, "Order Summary.xlsx");
};