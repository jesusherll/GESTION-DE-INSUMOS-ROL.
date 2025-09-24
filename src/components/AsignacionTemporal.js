import React from 'react';

function AsignacionTemporal({ assignments, onRemove, onSave, onReassign }) {

  const primaryButtonStyle = {
    backgroundColor: 'royalblue',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const secondaryButtonStyle = {
    padding: '5px 10px',
    border: '1px solid #6c757d',
    backgroundColor: 'transparent',
    color: '#6c757d',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const dangerButtonStyle = {
    ...secondaryButtonStyle,
    color: '#dc3545',
    borderColor: '#dc3545'
  };

  if (assignments.length === 0) {
    return (
      <div>
        <h2>Asignaciones de la Sesión</h2>
        <p>Aún no hay asignaciones. Haz clic en un insumo para empezar.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Asignaciones de la Sesión</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Insumo</th>
            <th>Miembro Asignado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(assignment => (
            <tr key={assignment.id}>
              <td>{assignment.insumo.name}</td>
              <td>{assignment.member.name}</td>
              <td>
                <button onClick={() => onReassign(assignment.id)} style={secondaryButtonStyle}>Reasignar</button>
                <button onClick={() => onRemove(assignment.id)} style={dangerButtonStyle}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onSave} style={primaryButtonStyle}>Finalizar y Guardar en Historial</button>
    </div>
  );
}

export default AsignacionTemporal;