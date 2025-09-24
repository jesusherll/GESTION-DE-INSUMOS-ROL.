
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

function MiembrosList({ members }) {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = async () => {
    if (newMemberName.trim() !== '') {
      const newNumber = members.length > 0 ? Math.max(...members.map(m => m.number)) + 1 : 1;
      await addDoc(collection(db, 'members'), { 
        name: newMemberName.trim(),
        number: newNumber 
      });
      setNewMemberName('');
    }
  };

  const handleRemoveMember = async (idToRemove) => {
    await deleteDoc(doc(db, 'members', idToRemove));
  };

  return (
    <div>
      <h2>Miembros</h2>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {members.map(member => (
          <li key={member.id} style={{ fontSize: '18px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{member.number}. {member.name}</span>
            <button 
              onClick={() => handleRemoveMember(member.id)}
              style={{ 
                backgroundColor: 'transparent', 
                color: '#dc3545', 
                border: '1px solid #dc3545', 
                borderRadius: '5px', 
                padding: '2px 6px', 
                cursor: 'pointer' 
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <div>
        <h4>Añadir Miembro</h4>
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="Nuevo miembro"
          style={{ padding: '8px', marginRight: '5px' }}
        />
        <button onClick={handleAddMember} style={{ padding: '8px 12px' }}>Añadir</button>
      </div>
    </div>
  );
}

export default MiembrosList;
