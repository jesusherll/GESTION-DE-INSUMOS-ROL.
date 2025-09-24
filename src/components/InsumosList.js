
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

function InsumosList({ insumos, onAssign }) {
  const [newInsumoName, setNewInsumoName] = useState('');
  const [newInsumoCost, setNewInsumoCost] = useState('');
  const [insumoToDelete, setInsumoToDelete] = useState('');

  // Efecto para actualizar el estado si la lista de insumos cambia
  useEffect(() => {
    if (insumos.length > 0 && !insumoToDelete) {
      setInsumoToDelete(insumos[0].id);
    } else if (insumos.length === 0) {
      setInsumoToDelete('');
    }
  }, [insumos, insumoToDelete]);

  const handleAddInsumo = async () => {
    if (newInsumoName.trim() !== '') {
      const newNumber = insumos.length > 0 ? Math.max(...insumos.map(i => i.number)) + 1 : 1;
      await addDoc(collection(db, 'insumos'), { 
        name: newInsumoName.trim(),
        cost_info: newInsumoCost.trim(),
        number: newNumber
      });
      setNewInsumoName('');
      setNewInsumoCost('');
    }
  };

  const handleRemoveInsumo = async () => {
    if (!insumoToDelete) {
      alert('Por favor, selecciona un insumo para eliminar.');
      return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar el insumo seleccionado?`)) {
        await deleteDoc(doc(db, 'insumos', insumoToDelete));
        // El useEffect se encargará de resetear el estado del select
    }
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px'
  };

  const buttonStyle = {
    backgroundColor: 'royalblue',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    minHeight: '80px',
    fontSize: '16px',
    whiteSpace: 'normal',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };

  return (
    <div>
      <h2>Insumos</h2>
      <p>Haz clic en un insumo para asignarlo:</p>
      <div style={gridContainerStyle}>
        {insumos.map(insumo => (
            <button key={insumo.id} onClick={() => onAssign(insumo.id)} style={buttonStyle}>
              {insumo.number}. {insumo.name} ({insumo.cost_info})
            </button>
        ))}
      </div>
      <hr style={{ marginTop: '20px' }}/>
      <div>
        <h4>Gestionar Insumos</h4>
        <div style={{ marginBottom: '15px' }}>
          <h5>Añadir Insumo</h5>
          <input
            type="text"
            value={newInsumoName}
            onChange={(e) => setNewInsumoName(e.target.value)}
            placeholder="Nuevo insumo"
            style={{ padding: '8px', marginRight: '5px' }}
          />
          <input
            type="text"
            value={newInsumoCost}
            onChange={(e) => setNewInsumoCost(e.target.value)}
            placeholder="Costo (informativo)"
            style={{ padding: '8px', marginRight: '5px' }}
          />
          <button onClick={handleAddInsumo} style={{ padding: '8px 12px' }}>Añadir</button>
        </div>
        <div>
          <h5>Eliminar Insumo</h5>
          <select 
            value={insumoToDelete}
            onChange={(e) => setInsumoToDelete(e.target.value)}
            style={{ padding: '8px', marginRight: '5px' }}
          >
            {insumos.map(insumo => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.name}
              </option>
            ))}
          </select>
          <button onClick={handleRemoveInsumo} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
            Eliminar Insumo Seleccionado
          </button>
        </div>
      </div>
    </div>
  );
}

export default InsumosList;
