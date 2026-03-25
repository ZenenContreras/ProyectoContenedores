import { useEffect } from 'react';
import { useContainerStore } from './store/useContainerStore';
import CreateServiceForm from './components/CreateServiceForm';
import ContainerList from './components/ContainerList.tsx';
import { LayoutDashboard, Server } from 'lucide-react';

function App() {
  const fetchContainers = useContainerStore((state) => state.fetchContainers);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar Superior */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Proyecto Contenedores</h1>
                <p className="text-xs text-slate-500 font-medium">Panel de Microservicios Dinámicos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
              <Server className="w-4 h-4" />
              <span>Host: localhost:5500</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <CreateServiceForm />
          </div>
          <div className="lg:col-span-8">
            <ContainerList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;