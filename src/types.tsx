// src/types.ts

export interface Country {
  id: string;
  CountryCode: string;
  Active: boolean;
  SortSeq: number;
  CountryName: string;
}

export interface City {
  id: string;// Optional as it's not in the response
  Active: boolean;
  CityName: string;
  StateCode?: string; // Optional, corresponds to StateCode in the response
  CountryCode?: string; // Optional, corresponds to CountryCode in the response
  SortSeq: number; // Optional, corresponds to SortSeq in the response
}

export interface State {
  id: string;
  StateCode: string;
  StateName: string;
  CountryCode: string; // Changed from CountryId to CountryCode
  Active: boolean;
  SortSeq: number; // Added SortSeq
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
