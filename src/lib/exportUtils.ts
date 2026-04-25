import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (title: string, columns: string[], data: any[]) => {
  const doc = new jsPDF() as any;

  // Header Style
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RESTAURANT PRO', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(title.toUpperCase(), 105, 30, { align: 'center' });

  // Table
  doc.autoTable({
    startY: 50,
    head: [columns],
    body: data,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229], fontSize: 10, fontStyle: 'bold' }, // indigo-600
    styles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`${title.toLowerCase().replace(/\s/g, '_')}_${new Date().getTime()}.pdf`);
};

export const exportToExcel = (title: string, data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s/g, '_')}_${new Date().getTime()}.xlsx`);
};
