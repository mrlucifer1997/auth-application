import { axiosCityInstance } from '../api/axiosInstance';
import { City, ApiResponse, State, Country } from '../types';

export const createCity = async (city: Omit<City, 'id'>) => {
  const response = await axiosCityInstance.post<ApiResponse<City>>('/', city);
  return response.data;
};

export const getCities = async () => {
  const response = await axiosCityInstance.get<ApiResponse<City[]>>('/');
  return response.data;
};

export const updateCity = async (id: string, city: Partial<City>) => {
  const response = await axiosCityInstance.put<ApiResponse<City>>(`/${id}`, city);
  return response.data;
};

export const deleteCity = async (id: string) => {
  const response = await axiosCityInstance.delete<ApiResponse<null>>(`/${id}`);
  return response.data;
};


export const getStates = async () => {
  const response = await axiosCityInstance.get<ApiResponse<State[]>>('/');
  return response.data;
};

export const getCountries = async () => {
  const response = await axiosCityInstance.get<ApiResponse<Country[]>>('/');
    return response.data;
};
