import { useContainerStore } from '../store/useContainerStore';
import { Activity, RefreshCw, Play, Square, Trash2, ExternalLink, ServerCrash } from 'lucide-react';

export default function ContainerList() {
  const containers = useContainerStore((state) => state.containers);
  const fetchContainers = useContainerStore((state) => state.fetchContainers);
  const handleAction = useContainerStore((state) => state.handleAction);
  
  const getEndpoint = (ports: string) => {
    const match = ports.match(/0\.0\.0\.0:(\d+)->/);
    return match ? `http://localhost:${match[1]}` : '#';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">Servicios Activos</h2>
        </div>
        <button 
          onClick={fetchContainers} 
          className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors font-medium shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-200">
              <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-slate-500">Contenedor</th>
              <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-slate-500">Descripción</th>
              <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-slate-500">Estado</th>
              <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-slate-500">Endpoint URL</th>
              <th className="py-3 px-6 font-medium text-xs uppercase tracking-wider text-slate-500 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {containers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ServerCrash className="w-12 h-12 mb-3 stroke-1" />
                    <p className="text-sm font-medium text-slate-500">No hay contenedores en ejecución.</p>
                    <p className="text-xs">Crea tu primer servicio en el panel lateral.</p>
                  </div>
                </td>
              </tr>
            ) : (
              containers.map((c) => {
                const isRunning = c.state === 'running';
                const endpoint = getEndpoint(c.ports);
                const cleanName = c.name.replace('/', '');
                
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{cleanName}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{c.id.substring(0, 12)}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                        {c.description || <span className="text-slate-400 italic">Sin descripción</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          isRunning 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {isRunning ? 'En ejecución' : 'Detenido'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{c.status}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {isRunning && endpoint !== '#' ? (
                        <a 
                          href={endpoint} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1.5 text-sm font-mono text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
                        >
                          {endpoint.replace('http://localhost:', ':')}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-300 text-sm font-mono">-</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {!isRunning ? (
                          <button 
                            onClick={() => handleAction('start', c.name)} 
                            title="Iniciar Contenedor" 
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Play className="w-5 h-5 fill-emerald-600/20" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction('stop', c.name)} 
                            title="Detener Contenedor" 
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors hover:cursor-pointer"
                          >
                            <Square className="w-5 h-5 fill-amber-600/20" />
                          </button>
                        )}
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button 
                          onClick={() => handleAction('delete', c.name)} 
                          title="Eliminar Permanente" 
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors hover:cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
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
    </div>
  );
}