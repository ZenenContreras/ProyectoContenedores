import { useEffect } from 'react';
import { useContainerStore } from './store/useContainerStore';
import CreateServiceForm from './components/CreateServiceForm';
import ContainerList from './components/ContainerList.tsx';

function App() {
  const fetchContainers = useContainerStore((state) => state.fetchContainers);

  // Cargamos los contenedores al abrir la página por primera vez
  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard de Microservicios</h1>
        <p className="text-gray-500 mt-2">Plataforma dinámica de contenedores Docker</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateServiceForm />
        </div>
        
        <div className="lg:col-span-2">
          <ContainerList />
        </div>
      </div>
    </div>
  );
}

export default App;