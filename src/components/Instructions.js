import React from 'react';

function Instructions() {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px', backgroundColor: 'white' }}>
      <h2>Instrucciones de Uso</h2>
      <p>Aquí encontrarás una guía rápida para utilizar la aplicación:</p>
      <ol>
        <li>
          <strong>Añadir Miembros:</strong> Ingresa el nombre del nuevo miembro y haz clic en "Añadir".
        </li>
        <li>
          <strong>Asignar Insumos:</strong> Haz clic en el botón correspondiente al insumo que deseas asignar.
        </li>
        <li>
          <strong>Reasignar Insumos:</strong> Haz clic en el botón "Reasignar" junto al insumo correspondiente.
        </li>
        <li>
          <strong>Eliminar Asignaciones:</strong> Haz clic en el botón "Eliminar" junto al insumo correspondiente.
        </li>
        <li>
          <strong>Finalizar y Guardar:</strong> Haz clic en el botón "Finalizar y Guardar en Historial".
        </li>
        <li>
          <strong>Consultar Historial:</strong> En la sección "Historial de Asignaciones", podrás ver un registro de todas las sesiones anteriores y generar un reporte en PDF.
        </li>
      </ol>
      
      <h2>Políticas de Asignación</h2>
      <p>Estas son las políticas que rigen la asignación de insumos:</p>
      <ul>
        <li><strong>Rotación Equitativa:</strong> El sistema asigna los insumos siguiendo un orden rotativo entre todos los miembros del grupo, priorizando a quien lleva más tiempo sin recibir una asignación.</li>
        <li><strong>Periodo de Descanso:</strong> Después de recibir una asignación, un miembro debe esperar al menos 4 turnos antes de poder recibir otra.</li>
        <li><strong>Reasignaciones:</strong> Las reasignaciones solo se realizarán en casos excepcionales y no afectarán el orden de la rotación principal.</li>
      </ul>
    </div>
  );
}

export default Instructions;