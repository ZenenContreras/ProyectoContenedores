import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContainerStore } from '../store/useContainerStore';
import { Box, Code2, Terminal, Loader2, Rocket, FileText } from 'lucide-react';

export default function CreateServiceForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // <-- NUEVO ESTADO
  const [language, setLanguage] = useState('nodejs');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const createContainer = useContainerStore((state) => state.createContainer);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code) return alert('Por favor, completa todos los campos requeridos.');
    
    setLoading(true);
    try {
      // <-- AÑADIMOS LA DESCRIPCIÓN AL ENVIAR
      await createContainer({ name, description, language, code });
      setName('');
      setDescription(''); // <-- LIMPIAMOS EL CAMPO
      setCode('');
    } catch (error) {
      alert('Hubo un error al desplegar el microservicio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
        <Rocket className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">Desplegar Servicio</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Box className="w-4 h-4 text-slate-400" />
            Nombre del contenedor
          </label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400" 
            placeholder="ej. api-calculadora" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="w-4 h-4 text-slate-400" />
            Descripción
          </label>
          <input 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400" 
            placeholder="ej. Este microservicio suma dos números..." 
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Terminal className="w-4 h-4 text-slate-400" />
            Entorno de ejecución
          </label>
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)} 
            className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all bg-white"
          >
            <option value="nodejs">Node.js (JavaScript)</option>
            <option value="python">Python (Flask)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-400" />
              Código Fuente
            </span>
          </label>
          <textarea 
            value={code} 
            onChange={e => setCode(e.target.value)} 
            rows={8}
            className="w-full border border-slate-300 p-4 rounded-lg font-mono text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
            placeholder="// Escribe o pega tu código aquí..." 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Construyendo Imagen...</span>
            </>
          ) : (
            <span>Crear e Iniciar</span>
          )}
        </button>
      </form>
    </div>
  );
}