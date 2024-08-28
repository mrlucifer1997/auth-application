import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button, SelectChangeEvent, FormHelperText, Box, Typography } from '@mui/material';
import { State } from '../types';
import { createState, updateState } from '../services/stateService';
import axios from 'axios';

interface Country {
  id: string;
  CountryCode: string;
  Active: boolean;
  SortSeq: number;
  CountryName: string;
}

const StateForm: React.FC<{ state: State | null; onSave: () => void; }> = ({ state, onSave }) => {
  const [formState, setFormState] = useState<Omit<State, 'id' | 'SortSeq'>>({
    StateCode: '',
    StateName: '',
    CountryCode: '',
    Active: true,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortSeq, setSortSeq] = useState<number>(1); // State for SortSeq

  // Fetch countries data from API
  useEffect(() => {
    const fetchCountriesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5114/country'); // Replace with your actual API URL
        const responseData = await response.data;

        if (responseData.statusCode !== 200 || !responseData.data) {
          throw new Error(responseData.message || 'Failed to fetch countries');
        }

        setCountries(responseData.data);
      } catch (err) {
        setError('Failed to load countries');
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountriesData();
  }, []);

  // Update form state when `state` prop changes
  useEffect(() => {
    if (state) {
      setFormState({
        StateCode: state.StateCode,
        StateName: state.StateName,
        CountryCode: state.CountryCode,
        Active: state.Active,
      });
      setSortSeq(state.SortSeq); // Set SortSeq when editing an existing state
    }
  }, [state]);

  // Handle changes in text fields
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes in select dropdown
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes in checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState((prev) => ({ ...prev, [name]: checked }));
  };

// Handle changes in SortSeq
const handleSortSeqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSortSeq(Number(e.target.value));
};


   // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stateData = {
        ...formState,
        SortSeq: sortSeq, // Include SortSeq in the form data
      };

      if (state) {
        await updateState(state.id, stateData);
      } else {
        await createState(stateData);
      }
      onSave();
    } catch (error) {
      setError('Failed to save state');
      console.error('Error saving state:', error);
    }
  };

  return (
<Box sx={{ padding: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {state ? 'Update State' : 'Create State'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="State Code"
            name="StateCode"
            value={formState.StateCode}
            onChange={handleTextChange}
            required
            fullWidth
          />
          <TextField
            label="State Name"
            name="StateName"
            value={formState.StateName}
            onChange={handleTextChange}
            required
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              name="CountryCode" // Changed to CountryCode
              value={formState.CountryCode}
              onChange={handleSelectChange}
              required
              disabled={loading}
            >
              <MenuItem value="" disabled>Select Country</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.CountryCode}>
                  {country.CountryCode}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
          <TextField
            label="Sort Sequence"
            type="number"
            value={sortSeq}
            onChange={handleSortSeqChange}
            required
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                name="Active"
                checked={formState.Active}
                onChange={handleCheckboxChange}
              />
            }
            label="Active"
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {state ? 'Update' : 'Create'}
          </Button>
          {loading && <Typography>Loading countries...</Typography>}
        </Box>
      </form>
    </Box>
  );
};

export default StateForm;