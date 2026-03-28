import type { MicroserviceReq, Container } from '../types';

const API_URL = '/api/microservices';

export const api = {
  getMicroservices: async (): Promise<Container[]> => {
    const res = await fetch(API_URL);
    const json = await res.json();
    return json.data || [];
  },
  createMicroservice: async (data: MicroserviceReq) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  startMicroservice: async (id: string) => fetch(`${API_URL}/${id}/start`, { method: 'POST' }),
  stopMicroservice: async (id: string) => fetch(`${API_URL}/${id}/stop`, { method: 'POST' }),
  deleteMicroservice: async (id: string) => fetch(`${API_URL}/${id}`, { method: 'DELETE' })
};