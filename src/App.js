import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, addDoc, deleteDoc, getDocs, writeBatch, updateDoc } from 'firebase/firestore';

import InsumosList from './components/InsumosList';
import MiembrosList from './components/MiembrosList';
import AsignacionTemporal from './components/AsignacionTemporal';
import Historial from './components/Historial';
import Instructions from './components/Instructions';
import './App.css';

// Initial data
const initialMembers = [
  { number: 1, name: 'Laura V.' }, { number: 2, name: 'Leticia M.' }, { number: 3, name: 'Brenda F.' }, 
  { number: 4, name: 'Angélica R.' }, { number: 5, name: 'Verónica H.' }, { number: 6, name: 'Valentina R.' },
  { number: 7, name: 'Esthela V.' }, { number: 8, name: 'Mireya A.' }, { number: 9, name: 'Irene R.' },
  { number: 10, name: 'Macrina R.' }, { number: 11, name: 'Paula A.' }, { number: 12, name: 'Lucy F.' },
  { number: 13, name: 'Karla M.' }, { number: 14, name: 'Altagracia L.' }, { number: 15, name: 'Miriam H.' },
  { number: 16, name: 'Paula S.' }, { number: 17, name: 'Itzel' }, { number: 18, name: 'Maricela' },
  { number: 19, name: 'Esthela B.' }, { number: 20, name: 'Sandra' }, { number: 21, name: 'Leonor C.' },
  { number: 22, name: 'Tere M.' }, { number: 23, name: 'Gaby H.' },
];

const initialInsumos = [
  { number: 110, name: 'Bolsa negra para basura grande', cost_info: '$22 - $40 MXN' },
  { number: 220, name: 'Bolsa chica para basura tipo camiseta', cost_info: '$13 - $20 MXN' },
  { number: 3, name: 'Kleenex caja', cost_info: '$30 - $50 MXN' },
  { number: 4, name: 'Papel higiénico 4 rollos', cost_info: '$20 - $40 MXN' },
  { number: 5, name: 'Pinol o fabuloso 1 litro', cost_info: '$20 - $40 MXN' },
  { number: 6, name: 'Sanitas', cost_info: '$150 - $400 MXN' },
  { number: 7, name: 'Toalla sanitarias 10 piezas', cost_info: '$20 - $45 MXN' },
  { number: 8, name: 'Jabón de manos', cost_info: '$30 - $70 MXN' },
  { number: 9, name: 'Jabón de trastes', cost_info: '$30 - $50 MXN' },
  { number: 10, name: 'Cloro 1 litro', cost_info: '$15 - $25 MXN' },
  { number: 11, name: 'Sacudidor o franela', cost_info: '$20 - $60 MXN' },
  { number: 12, name: 'Escoba', cost_info: '$40 - $150 MXN' },
  { number: 13, name: 'Trapeador', cost_info: '$50 - $150 MXN' },
  { number: 14, name: 'Recogedor', cost_info: '$50 - $100 MXN' },
  { number: 15, name: 'Cepillo para sanitario', cost_info: '$40 - $200 MXN' },
  { number: 16, name: 'Limpiador de madera', cost_info: '$60 - $150 MXN' },
  { number: 17, name: 'Lija de agua', cost_info: '$50 - $100 MXN' },
];

function App() {
  const [members, setMembers] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [temporalAssignments, setTemporalAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.number - b.number);
      setMembers(membersData);
      setLoading(false);
    });

    const unsubInsumos = onSnapshot(collection(db, 'insumos'), (snapshot) => {
      const insumosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.number - b.number);
      setInsumos(insumosData);
    });

    const unsubHistory = onSnapshot(collection(db, 'history'), (snapshot) => {
      const historyData = snapshot.docs.map(doc => {
        const data = doc.data();
        // FIX: Es crucial convertir las fechas de las asignaciones internas, que vienen como Timestamps de Firestore.
        const assignmentsWithDates = data.assignments.map(a => ({
          ...a,
          // Si a.date existe y es un Timestamp, lo convierte a Date. Si no, lo deja como está.
          date: a.date && typeof a.date.toDate === 'function' ? a.date.toDate() : a.date
        }));
        return { id: doc.id, ...data, date: data.date.toDate(), assignments: assignmentsWithDates };
      });
      // Ordenar las sesiones por fecha, de más reciente a más antigua.
      setHistory(historyData.sort((a, b) => b.date - a.date));
    });

    const seedDatabase = async () => {
        const membersQuery = await getDocs(collection(db, "members"));
        if (membersQuery.empty) {
            const batch = writeBatch(db);
            initialMembers.forEach(member => {
                const docRef = doc(collection(db, "members"));
                batch.set(docRef, member);
            });
            initialInsumos.forEach(insumo => {
                const docRef = doc(collection(db, "insumos"));
                batch.set(docRef, insumo);
            });
            await batch.commit();
        }
    };
    seedDatabase();

    return () => {
      unsubMembers();
      unsubInsumos();
      unsubHistory();
    };
  }, []);

  // Un miembro debe esperar este número de turnos antes de poder recibir otra asignación.
  const GENERAL_COOLDOWN_TURNS = 4;

  const [excludedMembers, setExcludedMembers] = useState([]);
  const getNextAssignee = (insumoId, assignedInSession, membersToExclude = []) => {
    // 1. Construir un mapa de la última fecha de asignación para cada miembro desde el historial.
    const lastAssignmentDateMap = new Map();
    members.forEach(m => lastAssignmentDateMap.set(m.id, 0)); // Por defecto, para los nunca asignados

    history.forEach(session => {
        session.assignments.forEach(assignment => {
            // FIX: Add a guard to ensure that the assignment has the necessary data (member and date).
            // Esto previene errores si hay datos antiguos o malformados en el historial.
            if (assignment.member && assignment.date) {
                const memberId = assignment.member.id;
 const assignmentDate = assignment.date.getTime();
                if (assignmentDate > (lastAssignmentDateMap.get(memberId) || 0)) {
                    lastAssignmentDateMap.set(memberId, assignmentDate);
                }
            }
        });
    });

    // 2. Crear una lista de todos los miembros, ordenada por quién está "más pendiente".
    // Aquel con la fecha de asignación más antigua (o nunca) va primero.
    const sortedCandidates = [...members].sort((a, b) => {
        const dateA = lastAssignmentDateMap.get(a.id);
        const dateB = lastAssignmentDateMap.get(b.id);
        if (dateA !== dateB) {
            return dateA - dateB; // Ordenar por fecha ascendente
        }
        return a.number - b.number; // Si las fechas son iguales, mantener el orden original
    });

    // 3. Definir todas las razones por las que un miembro podría ser excluido ahora mismo.
    const allAssignments = history
        .flatMap(h => h.assignments)
        .concat(assignedInSession)
        // FIX: Se filtran las asignaciones que no tengan fecha para evitar errores al ordenar.
        .filter(a => a.date)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    const recentAssignments = allAssignments.slice(0, GENERAL_COOLDOWN_TURNS);
    const membersOnCooldown = new Set(
        recentAssignments.map(a => a.member.id)
    );

    const excludedIds = new Set([
      ...assignedInSession.map(a => a.member.id), // Ya asignados en esta sesión
      ...membersToExclude, // Excluidos para esta reasignación específica
      ...excludedMembers, // Excluidos por reasignaciones previas en esta sesión
      ...membersOnCooldown // Excluidos por la regla de cooldown general
    ]);
    
    // 4. Encontrar al primer candidato "más pendiente" que no esté actualmente excluido.
    return sortedCandidates.find(candidate => !excludedIds.has(candidate.id)) || null;
  };

  const handleAssignInsumo = (insumoId) => {
    
    const insumoToAssign = insumos.find(i => i.id === insumoId);
    if (!insumoToAssign) return;
    if (temporalAssignments.some(a => a.insumo.id === insumoId)) {
      alert('Este insumo ya ha sido asignado en esta sesión.');
      return;
    }

    const nextAssignee = getNextAssignee(insumoId, temporalAssignments);
    if (!nextAssignee) {
      // FIX: Mensaje mejorado para cuando no se encuentra a nadie disponible.
      alert('No hay miembros disponibles para asignar. Puede que todos estén en periodo de descanso o ya tengan una asignación en esta sesión.');
      return;
    }

    const newAssignment = {
      id: Date.now(),
      member: nextAssignee,
      insumo: insumoToAssign,
      status: 'cumplido',
      date: new Date(),
    };
    setTemporalAssignments([...temporalAssignments, newAssignment]);
    alert(`${insumoToAssign.name} asignado a ${nextAssignee.name}`);
  };

  const handleRemoveFromTemporal = (assignmentId) => {
    setTemporalAssignments(temporalAssignments.filter(a => a.id !== assignmentId));
  };

  const handleReassign = (assignmentId) => {
    const assignmentToReassign = temporalAssignments.find(a => a.id === assignmentId);
    if (!assignmentToReassign) return;

    // Lógica de reasignación normal
    // Se busca al siguiente miembro disponible, excluyendo al que se está reasignando.
    const nextAssignee = getNextAssignee(assignmentToReassign.insumo.id, temporalAssignments, [assignmentToReassign.member.id]);

    if (!nextAssignee) {
      // Esto pasará si todos los demás miembros ya tienen una asignación.
      alert('No hay otros miembros disponibles para reasignar.');
      return;
    }

    const updatedAssignments = temporalAssignments.map(a => 
      a.id === assignmentId ? { ...a, member: nextAssignee } : a
    );
    setTemporalAssignments(updatedAssignments);
    setExcludedMembers(prevExcluded => {
      return [...new Set([...prevExcluded, assignmentToReassign.member.id])];

    });
    alert(`${assignmentToReassign.insumo.name} reasignado a ${nextAssignee.name}`);
 // No se actualiza el "último asignado" en una reasignación, para que la secuencia principal no se vea afectada.
  };

  const handleSaveToHistory = async () => {
    const newHistoryEntry = {
        date: new Date(),
        assignments: temporalAssignments.map(({id, ...rest}) => rest) // Quitar ID temporal
    };
    await addDoc(collection(db, "history"), newHistoryEntry);
    setTemporalAssignments([]);
    setExcludedMembers([]);
    alert('Asignaciones guardadas en el historial.');
  };

  if (loading) {
    return <div>Cargando datos de Firebase...</div>;
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header-section">
          <div>
            <h1 style={{ fontSize: '1.5em', margin: 0 }}>AL-ANON GRUPO LOMAS DE LA SOLEDAD</h1>
            <h2 style={{ marginTop: '5px' }}>Gestion de Insumos</h2>
          </div>
          <button
            className="primary-button"
            onClick={() => window.open('URL_TO_YOUR_README', '_blank')}
          >
            Instrucciones
          </button>
        </div>
        <Instructions />
        <div className="main-layout">
          <div className="members-column">
            <MiembrosList members={members} />
          </div>
          <div className="insumos-column">
            <InsumosList insumos={insumos} onAssign={handleAssignInsumo} />
          </div>
        </div>
        <hr />
        <AsignacionTemporal 
          assignments={temporalAssignments} 
          onRemove={handleRemoveFromTemporal}
          onSave={handleSaveToHistory}
          onReassign={handleReassign}
        />
        <hr />
        <Historial history={history} members={members} insumos={insumos} />
      </div>
    </div>
  );
}

export default App;