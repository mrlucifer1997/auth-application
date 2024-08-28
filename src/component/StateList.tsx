// src/components/StateList.tsx

import React, { useState, useEffect } from 'react';
import { State } from '../types';
import { getStates, deleteState } from '../services/stateService';
import StateForm from './StateForm';
import StateTable from './StateTable';

const StateList: React.FC = () => {
  const [states, setStates] = useState<State[]>([]);
  const [editingState, setEditingState] = useState<State | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      const response = await getStates();
      setStates(response.data);
    };
    fetchStates();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteState(id);
    setStates(prev => prev.filter(state => state.id !== id));
  };

  const handleSave = async () => {
    setEditingState(null);
    const response = await getStates();
    setStates(response.data);
  };

  return (
    <div>
      <StateForm onSave={handleSave} state={editingState} />
      <StateTable
        states={states}
        onEdit={setEditingState}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default StateList;
