
import React from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import logo from './logo.png'; // ¡Importante! Añade tu logo aquí.

function Historial({ history, members, insumos }) {

  const handleToggleStatus = async (sessionId, assignmentIndex) => {
    const sessionToUpdate = history.find(h => h.id === sessionId);
    if (!sessionToUpdate) return;

    const updatedAssignments = JSON.parse(JSON.stringify(sessionToUpdate.assignments));
    const assignmentToToggle = updatedAssignments[assignmentIndex];
    if (!assignmentToToggle) return;

    assignmentToToggle.status = assignmentToToggle.status === 'cumplido' ? 'incumplido' : 'cumplido';

    const sessionRef = doc(db, 'history', sessionId);
    try {
      await updateDoc(sessionRef, { assignments: updatedAssignments });
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Hubo un error al actualizar el estado.");
    }
  };

  const generateReport = () => {
    const doc = new jsPDF('landscape');
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;

    const drawHeader = () => {
      const now = new Date();
      const timestamp = `Generado el ${now.toLocaleDateString()} a las ${now.toLocaleTimeString()}`;

      doc.addImage(logo, 'PNG', margin, 10, 20, 20);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text("Grupo AL-ANON Lomas de la Soledad", margin + 25, 18);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text("Reporte de Asignación de Insumos", margin + 25, 25);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(timestamp, margin + 25, 30);
    };

    const drawFooter = (pageNumber, totalPages) => {
      doc.setFontSize(10);
      doc.setTextColor(100);
      const footerText = `Página ${pageNumber} de ${totalPages}`;
      doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
    };

    // --- PÁGINA 1: REGISTRO CRONOLÓGICO ---
    doc.setPage(1);
    drawHeader();
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Registro Cronológico de Sesiones", margin, 50);

    let y = 60;
    let x = margin;
    const columnGap = 15;
    const columnWidth = (pageWidth - 2 * margin - columnGap) / 2;
    let currentColumn = 1;

    for (const session of history) {
      const sessionLines = session.assignments.map(item => 
        ` · ${item.insumo.name} -> ${item.member.name} [${item.status.toUpperCase()}]`
      );
      const sessionBlockHeight = 7 + (sessionLines.length * 5);

      if (y + sessionBlockHeight > pageHeight - 20) {
        if (currentColumn === 1) {
          currentColumn = 2;
          x = margin + columnWidth + columnGap;
          y = 60;
        } else {
          break;
        }
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`Sesión del ${session.date.toLocaleDateString()}:`, x, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      sessionLines.forEach(line => {
        doc.text(line, x, y, { maxWidth: columnWidth - 5 });
        y += 5;
      });
      y += 5;
    }

    // --- PÁGINA 2: MATRIZ DE CUMPLIMIENTO (TRUNCATED) ---
    doc.addPage(null, 'l');
    drawHeader();
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Tabla de insumos", margin, 50);

    const completedAssignments = new Set();
    history.forEach(session => {
        session.assignments.forEach(assignment => {
            if (assignment.status === 'cumplido') {
                completedAssignments.add(`${assignment.member.id}-${assignment.insumo.id}`);
            }
        });
    });

    const sortedInsumos = [...insumos].sort((a, b) => a.number - b.number);
    const sortedMembers = [...members].sort((a, b) => a.number - b.number);
    const startX = margin;
    const startY = 60;
    const insumoColWidth = 50;
    const cellWidth = (pageWidth - (2 * margin) - insumoColWidth) / sortedMembers.length;
    const cellHeight = 6; // Altura de celda delgada y fija

    // Encabezados de Miembros (números)
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    sortedMembers.forEach((member, index) => {
        doc.text(String(member.number), startX + insumoColWidth + (index * cellWidth) + (cellWidth / 2), startY - 2, { align: 'center' });
    });
    doc.setFont(undefined, 'normal');

    // Filas de Insumos y Celdas de Estado
    sortedInsumos.forEach((insumo, rowIndex) => {
        const rowY = startY + (rowIndex * cellHeight);
        doc.setFontSize(7); // Tamaño de fuente reducido para insumos
        
        // Lógica de truncamiento
        let insumoName = insumo.name;
        const maxInsumoNameLength = 35; // Límite de caracteres para el nombre del insumo
        if (insumoName.length > maxInsumoNameLength) {
            insumoName = insumoName.substring(0, maxInsumoNameLength - 3) + "...";
        }
        doc.text(insumoName, startX + 1, rowY + (cellHeight / 2) + 1.5);

        sortedMembers.forEach((member, colIndex) => {
            const cellX = startX + insumoColWidth + (colIndex * cellWidth);
            const key = `${member.id}-${insumo.id}`;
            if (completedAssignments.has(key)) {
                doc.setFontSize(8);
                doc.setFont(undefined, 'bold');
                doc.text('SÍ', cellX + (cellWidth / 2), rowY + (cellHeight / 2) + 2, { align: 'center' });
                doc.setFont(undefined, 'normal');
            }
        });
    });

    const tableWidth = insumoColWidth + (sortedMembers.length * cellWidth);
    const tableHeight = sortedInsumos.length * cellHeight;
    doc.setLineWidth(0.1);
    doc.rect(startX, startY - cellHeight, tableWidth, tableHeight + cellHeight);
    doc.line(startX + insumoColWidth, startY - cellHeight, startX + insumoColWidth, startY + tableHeight);
    for (let i = 0; i < sortedInsumos.length; i++) {
        const y_line = startY + (i * cellHeight);
        doc.line(startX, y_line, startX + tableWidth, y_line);
    }
    for (let i = 0; i < sortedMembers.length; i++) {
        const x_line = startX + insumoColWidth + (i * cellWidth);
        doc.line(x_line, startY - cellHeight, x_line, startY + tableHeight);
    }

    // Leyendas
    let legendY = startY + tableHeight + 7; // Espacio reducido
    doc.setFontSize(9);
    doc.text("Leyenda: SÍ = Insumo cumplido.", margin, legendY);
    legendY += 5;

    doc.setFont(undefined, 'bold');
    doc.text("Miembros:", margin, legendY);
    doc.setFont(undefined, 'normal');
    const memberLegendText = sortedMembers.map(m => `${m.number}. ${m.name}`).join(', ');
    const legendTextLines = doc.splitTextToSize(memberLegendText, pageWidth - (2 * margin) - 15);
    doc.text(legendTextLines, margin + 15, legendY);

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawFooter(i, totalPages);
    }

    doc.save("Reporte_Gestion_de_Insumos.pdf");
  };

  return (
    <div>
      <h2>Historial de Asignaciones</h2>
      {history.length > 0 &&(
        <button onClick={generateReport} className="primary-button">Generar Reporte en PDF</button>
      )}
      {history.length === 0 ? (
        <p>El historial está vacío.</p>
      ) : (
        <div>
          {history.map(session => (
            <div key={session.id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0'}}>
              <h4>Sesión del: {session.date.toLocaleDateString()}</h4>
              <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Insumo</th>
                    <th>Miembro</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {session.assignments.map((item, index) => (
                    <tr key={index} style={{ backgroundColor: item.status === 'incumplido' ? '#ffdddd' : 'transparent' }}>
                      <td>{item.insumo.name}</td>
                      <td>{item.member.name}</td>
                      <td 
                        onClick={() => handleToggleStatus(session.id, index)}
                        style={{ cursor: 'pointer', textDecoration: 'underline', color: item.status === 'incumplido' ? 'red' : 'green' }}
                      >
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Historial;
