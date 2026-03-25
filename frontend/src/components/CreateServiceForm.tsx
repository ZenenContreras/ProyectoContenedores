import { useState } from 'react';
import type { FormEvent } from 'react';
import { useContainerStore } from '../store/useContainerStore';

export default function CreateServiceForm() {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('nodejs');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Extraemos la función de Zustand
  const createContainer = useContainerStore((state) => state.createContainer);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code) return alert('Completa todos los campos');
    
    setLoading(true);
    try {
      await createContainer({ name, language, code });
      setName('');
      setCode('');
    } catch (error) {
      alert('Error al crear el microservicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Crear Nuevo Servicio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} 
                 className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                 placeholder="ej: calculadora" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Lenguaje</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="nodejs">Node.js (JavaScript)</option>
            <option value="python">Python (Flask)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Código Fuente</label>
          <textarea value={code} onChange={e => setCode(e.target.value)} rows={8}
                    className="w-full border p-2 rounded font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="// Pega aquí tu código..." />
        </div>

        <button type="submit" disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400">
          {loading ? 'Construyendo Docker...' : 'Desplegar Microservicio'}
        </button>
      </form>
    </div>
  );
}