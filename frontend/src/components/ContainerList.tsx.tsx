import { useContainerStore } from '../store/useContainerStore';

export default function ContainerList() {
  // Extraemos el estado y las funciones de Zustand
  const containers = useContainerStore((state) => state.containers);
  const fetchContainers = useContainerStore((state) => state.fetchContainers);
  const handleAction = useContainerStore((state) => state.handleAction);
  
  const getEndpoint = (ports: string) => {
    const match = ports.match(/0\.0\.0\.0:(\d+)->/);
    return match ? `http://localhost:${match[1]}` : '#';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold">Contenedores Activos</h2>
        <button onClick={fetchContainers} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-colors">
          🔄 Actualizar
        </button>
      </div>

      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-4 font-medium text-sm text-gray-600">Nombre / ID</th>
            <th className="py-3 px-4 font-medium text-sm text-gray-600">Estado</th>
            <th className="py-3 px-4 font-medium text-sm text-gray-600">Endpoint</th>
            <th className="py-3 px-4 font-medium text-sm text-gray-600 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {containers.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-500">No hay microservicios creados.</td>
            </tr>
          ) : (
            containers.map((c) => {
              const isRunning = c.state === 'running';
              const endpoint = getEndpoint(c.ports);
              
              return (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800">{c.name.replace('/', '')}</div>
                    <div className="text-xs text-gray-400 font-mono">{c.id.substring(0, 12)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isRunning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isRunning ? '🟢 En línea' : '🔴 Detenido'}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{c.status}</div>
                  </td>
                  <td className="py-3 px-4">
                    {isRunning && endpoint !== '#' ? (
                      <a href={endpoint} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-mono">
                        🔗 {endpoint.replace('http://localhost:', ':')}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      {!isRunning ? (
                        <button onClick={() => handleAction('start', c.name)} title="Iniciar" className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
                          ▶️
                        </button>
                      ) : (
                        <button onClick={() => handleAction('stop', c.name)} title="Detener" className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">
                          ⏸️
                        </button>
                      )}
                      <button onClick={() => handleAction('delete', c.name)} title="Eliminar" className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}