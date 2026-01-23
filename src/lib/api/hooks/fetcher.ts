import type { ApiResponse } from "@/lib/api/types";
import axios from "axios";

/**
 * Axios-based fetcher for SWR that extracts data from API response
 */
export async function fetcher<T>(url: string): Promise<T> {
  const response = await axios.get<ApiResponse<T>>(url);
  
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  
  return response.data.data;
}
