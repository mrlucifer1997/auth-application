import { axiosStateInstance } from '../api/axiosInstance';
import { State, ApiResponse } from '../types';

export const createState = async (state: Omit<State, 'id'>) => {
  const response = await axiosStateInstance.post<ApiResponse<State>>('/', state);
  return response.data;
};

export const getStates = async () => {
  const response = await axiosStateInstance.get<ApiResponse<State[]>>('/');
  return response.data;
};

export const updateState = async (id: string, state: Partial<State>) => {
  const response = await axiosStateInstance.put<ApiResponse<State>>(`/${id}`, state);
  return response.data;
};

export const deleteState = async (id: string) => {
  const response = await axiosStateInstance.delete<ApiResponse<null>>(`/${id}`);
  return response.data;
};
