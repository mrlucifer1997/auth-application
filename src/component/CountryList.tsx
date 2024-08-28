// src/components/CountryList.tsx

import React, { useState, useEffect } from 'react';
import { Country } from '../types';
import { getCountries, deleteCountry } from '../services/countryService';
import CountryForm from './CountryForm';
import CountryTable from './CountryTable';

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await getCountries();
      setCountries(response.data);
    };
    fetchCountries();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteCountry(id);
    setCountries(prev => prev.filter(country => country.id !== id));
  };

  const handleSave = async () => {
    setEditingCountry(null);
    const response = await getCountries();
    setCountries(response.data);
  };

  return (
    <div>
      <CountryForm onSave={handleSave} country={editingCountry} />
      <CountryTable
        countries={countries}
        onEdit={setEditingCountry}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CountryList;
