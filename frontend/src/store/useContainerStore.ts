import { create } from 'zustand';
import { api } from '../services/api';
import type { Container, MicroserviceReq } from '../types';

interface ContainerState {
  containers: Container[];
  fetchContainers: () => Promise<void>;
  createContainer: (data: MicroserviceReq) => Promise<void>;
  handleAction: (action: 'start' | 'stop' | 'delete', id: string) => Promise<void>;
}

export const useContainerStore = create<ContainerState>((set, get) => ({
  containers: [],

  fetchContainers: async () => {
    try {
      const data = await api.getMicroservices();
      set({ containers: data });
    } catch (error) {
      console.error("Error al cargar contenedores:", error);
    }
  },

  createContainer: async (data: MicroserviceReq) => {
    try {
      await api.createMicroservice(data);
      await get().fetchContainers(); // Recarga la lista automáticamente
    } catch (error) {
      console.error('Error al crear el microservicio:', error);
      throw error;
    }
  },

  handleAction: async (action: 'start' | 'stop' | 'delete', id: string) => {
    const cleanId = id.replace('/', '');
    try {
      if (action === 'start') await api.startMicroservice(cleanId);
      if (action === 'stop') await api.stopMicroservice(cleanId);
      if (action === 'delete') await api.deleteMicroservice(cleanId);
      await get().fetchContainers(); // Recarga la lista automáticamente
    } catch (error) {
      console.error(`Error al ejecutar ${action}:`, error);
    }
  }
}));