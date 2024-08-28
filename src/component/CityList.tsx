// src/components/CityList.tsx

import React, { useState, useEffect } from 'react';
import { City } from '../types';
import { getCities, deleteCity } from '../services/cityService';
import CityForm from './CityForm';
import CityTable from './CityTable';

const CityList: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      const response = await getCities();
      setCities(response.data);
    };
    fetchCities();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCity(id);
    setCities(prev => prev.filter(city => city.id !== id));
  };

  const handleSave = async () => {
    setEditingCity(null);
    const response = await getCities();
    setCities(response.data);
  };

  return (
    <div>
      <CityForm onSave={handleSave} city={editingCity} />
      <CityTable
        cities={cities}
        onEdit={setEditingCity}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CityList;
