import React, { useState, useEffect } from "react";
import { Country } from "../types";
import { createCountry, updateCountry } from "../services/countryService";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";

interface CountryFormProps {
  country: Country | null;
  onSave: () => void;
}

const CountryForm: React.FC<CountryFormProps> = ({ country, onSave }) => {
  const [formState, setFormState] = useState<Omit<Country, "id">>({
    CountryCode: "",
    Active: true,
    SortSeq: 0,
    CountryName: "",
  });

  useEffect(() => {
    if (country) {
      setFormState({
        CountryCode: country.CountryCode,
        Active: country.Active,
        SortSeq: country.SortSeq,
        CountryName: country.CountryName,
      });
    }
  }, [country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newValue = name === 'SortSeq' ? Number(value) : value;

    setFormState((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (country) {
      await updateCountry(country.id, formState);
    } else {
      await createCountry(formState);
    }
    onSave();
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
        label="Country Code"
        name="CountryCode"
        value={formState.CountryCode}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Country Name"
        name="CountryName"
        value={formState.CountryName}
        onChange={handleChange}
        required
        fullWidth
      />
       <TextField
        label="Sort Sequence"
        name="SortSeq"
        type="number"
        value={formState.SortSeq}
        onChange={handleChange}
        required
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            name="Active"
            checked={formState.Active}
            onChange={() =>
              setFormState((prev) => ({ ...prev, Active: !prev.Active }))
            }
          />
        }
        label="Active"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }} 
      >
        {country ? "Update" : "Create"}
      </Button>
    </Box>
  );
};

export default CountryForm;
