import React, { useState, useEffect } from "react";
import { City } from "../types";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
  SelectChangeEvent,
  Box,
  CircularProgress,
} from "@mui/material";
import { createCity, updateCity } from "../services/cityService";
import axios from "axios";

interface State {
  id: string;
  StateCode: string;
  StateName: string;
  CountryCode: string; // Changed from CountryId to CountryCode
  Active: boolean;
  SortSeq: number; // Added SortSeq
}

interface Country {
  id: string;
  CountryCode: string;
  Active: boolean;
  SortSeq: number;
  CountryName: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface CityFormProps {
  city: City | null;
  onSave: () => void;
}

const CityForm: React.FC<CityFormProps> = ({ city, onSave }) => {
  const [formState, setFormState] = useState<Omit<City, 'id' | 'SortSeq'>>({
    Active: true,
    CityName: "",
    StateCode: "",
    CountryCode: "",
  });

  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortSeq, setSortSeq] = useState<number>(1); // State for SortSeq

  useEffect(() => {
    const fetchCountriesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiResponse<Country[]>>(
          "http://localhost:5114/country"
        );
        const responseData = response.data;

        if (responseData.statusCode !== 200 || !responseData.data) {
          throw new Error(responseData.message || "Failed to fetch countries");
        }

        setCountries(responseData.data);
      } catch (err) {
        setError("Failed to load countries");
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountriesData();
  }, []);

  useEffect(() => {
    const fetchStatesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiResponse<State[]>>(
          `http://localhost:5114/state`
        );
        const responseData = response.data;

        if (responseData.statusCode !== 200 || !responseData.data) {
          throw new Error(responseData.message || "Failed to fetch states");
        }

        setStates(responseData.data);
      } catch (err) {
        setError("Failed to load states");
        console.error("Error fetching states:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatesData();
  }, []);

  useEffect(() => {
    if (city) {
      setFormState({
        Active: city.Active,
        CityName: city.CityName,
        StateCode: city.StateCode || "",
        CountryCode: city.CountryCode || "",
      });
      setSortSeq(city.SortSeq); 
    }
  }, [city]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState((prev) => ({ ...prev, [name]: checked }));
  };

// Handle changes in SortSeq
const handleSortSeqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSortSeq(Number(e.target.value));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

// Ensure formState includes SortSeq
const stateData: Omit<City, "id"> & { SortSeq: number } = {
  ...formState,
  SortSeq: sortSeq, // Ensure SortSeq is included
};
    try {
      if (city) {
      // When updating, ensure to include SortSeq in the update data
      const updatedCity = await updateCity(city.id, stateData);
      console.log("City updated successfully:", updatedCity);
    } else {
      // When creating, ensure to include SortSeq in the new city data
      const newCity = await createCity(stateData);
      console.log("City created successfully:", newCity);
    }
    onSave();
  } catch (error) {
    setError("Failed to save city");
    console.error("Error saving city:", error);
  }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 500,
        mx: "auto",
        p: 2,
      }}
    >
      <TextField
        label="City Name"
        name="CityName"
        value={formState.CityName}
        onChange={handleTextChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
            label="Sort Sequence"
            type="number"
            value={sortSeq}
            onChange={handleSortSeqChange}
            required
            fullWidth
          />
      <FormControl fullWidth margin="normal">
        <InputLabel>Country</InputLabel>
        <Select
          name="CountryCode"
          value={formState.CountryCode || ""}
          onChange={handleSelectChange}
          required
          disabled={loading}
        >
          <MenuItem value="" disabled>
            Select Country
          </MenuItem>
          {countries.map((country) => (
            <MenuItem key={country.CountryCode} value={country.CountryCode}>
              {country.CountryCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>State</InputLabel>
        <Select
          name="StateCode"
          value={formState.StateCode || ""}
          onChange={handleSelectChange}
          required
          disabled={loading}
        >
          <MenuItem value="" disabled>
            Select State
          </MenuItem>
          {states.map((state) => (
            <MenuItem key={state.StateCode} value={state.StateCode}>
              {state.StateCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {city ? "Update" : "Create"}
      </Button>
      {loading && <CircularProgress />}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default CityForm;
