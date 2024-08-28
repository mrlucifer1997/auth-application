import { axiosCountryInstance } from '../api/axiosInstance';
import { Country, ApiResponse } from '../types';

export const createCountry = async (country: Omit<Country, 'id'>) => {
  const response = await axiosCountryInstance.post<ApiResponse<Country>>('/', country);
  return response.data;
};

export const getCountries = async () => {
  const response = await axiosCountryInstance.get<ApiResponse<Country[]>>('/');
  return response.data;
};

export const updateCountry = async (id: string, country: Partial<Country>) => {
  const response = await axiosCountryInstance.put<ApiResponse<Country>>(`/${id}`, country);
  return response.data;
};

export const deleteCountry = async (id: string) => {
  const response = await axiosCountryInstance.delete<ApiResponse<null>>(`/${id}`);
  return response.data;
};
