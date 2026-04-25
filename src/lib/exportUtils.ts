import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (title: string, columns: string[], data: any[]) => {
  const doc = new jsPDF() as any;

  // Header Style
  doc.setFillColor(0, 0, 0); // black
  doc.rect(0, 0, 210, 40, 'F');

  // Red Accent Line
  doc.setFillColor(225, 29, 72); // rose-600
  doc.rect(0, 40, 210, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('JUSHI', 105, 22, { align: 'center', charSpace: 2 });
  
  doc.setFontSize(8);
  doc.setTextColor(225, 29, 72);
  doc.text('SYSTEM PRO OPERATIONAL REPORT', 105, 32, { align: 'center' });

  // Table
  doc.autoTable({
    startY: 50,
    head: [columns],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [225, 29, 72], fontSize: 10, fontStyle: 'bold', textColor: [255, 255, 255] },
    styles: { fontSize: 8, cellPadding: 4, font: 'helvetica' },
    alternateRowStyles: { fillColor: [250, 250, 250] }
  });

  doc.save(`${title.toLowerCase().replace(/\s/g, '_')}_${new Date().getTime()}.pdf`);
};

export const exportToExcel = (title: string, data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s/g, '_')}_${new Date().getTime()}.xlsx`);
};
