import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import api from '../services/api';

const RatioPage = () => {
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Ratio Configuration State
  const [configName, setConfigName] = useState('New Configuration');
  const [ratioLevel, setRatioLevel] = useState(['Brick']); 
  
  // gradeRatios[grade][size] = ratioValue
  const [gradeRatios, setGradeRatios] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];
  const products = items.map(item => item.productId).filter(Boolean);

  // Group products dynamically based on selected ratioLevel (e.g. 'Brick')
  const groupedData = useMemo(() => {
    const group = {
      grades: new Set(),
      sizesByGrade: {},
      groupValue: 'All Selected'
    };

    if (products.length === 0) return group;

    // For simplicity, we just use the first 'ratioLevel' selected to derive a group key.
    // If 'Brick' is selected, we group by it. We'll just show what the user selected in the cart.
    const levelKey = ratioLevel[0]?.toLowerCase() || 'brick';
    
    // Determine the primary group value from the first product
    group.groupValue = products[0][levelKey] || 'Mixed';

    products.forEach(p => {
      if (p.grade) {
        group.grades.add(p.grade);
        if (!group.sizesByGrade[p.grade]) {
          group.sizesByGrade[p.grade] = new Set();
        }
        if (p.sizes) {
          p.sizes.forEach(s => group.sizesByGrade[p.grade].add(s));
        }
      }
    });

    return {
      grades: Array.from(group.grades).sort(),
      sizesByGrade: Object.fromEntries(
        Object.entries(group.sizesByGrade).map(([g, sSet]) => [g, Array.from(sSet).sort()])
      ),
      groupValue: group.groupValue
    };
  }, [products, ratioLevel]);

  // Initialize input state when grouping changes
  useEffect(() => {
    if (groupedData.grades.length > 0) {
      const initialRatios = {};
      groupedData.grades.forEach(g => {
        initialRatios[g] = {};
        (groupedData.sizesByGrade[g] || []).forEach(s => {
          // Initialize with existing state if present, else 0
          initialRatios[g][s] = gradeRatios[g]?.[s] || 0;
        });
      });
      setGradeRatios(initialRatios);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedData]);

  const handleRatioChange = (grade, size, value) => {
    const intVal = parseInt(value, 10);
    if (isNaN(intVal) || intVal < 0) return;
    
    setGradeRatios(prev => ({
      ...prev,
      [grade]: {
        ...(prev[grade] || {}),
        [size]: intVal
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/ratios', {
        name: configName,
        ratioLevel: ratioLevel,
        groupKey: ratioLevel[0],
        groupValues: [groupedData.groupValue],
        gradeRatios
      });
      setMessage({ type: 'success', text: 'Ratio configuration saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save ratio' });
    } finally {
      setSaving(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] glass-panel text-center p-8">
        <span className="material-symbols-rounded text-6xl text-muted/30 mb-4">tune</span>
        <h2 className="text-2xl font-bold mb-2">No products to configure</h2>
        <p className="text-muted mb-8 max-w-md">
          You need to add products to your cart before you can configure ratios.
        </p>
        <button onClick={() => navigate('/catalogue')} className="btn-primary">
          Browse Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Ratio Configuration</h1>
          <p className="text-muted">Define size ratios across different grades dynamically.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              // Reset all to 0
              const reset = {};
              Object.keys(gradeRatios).forEach(g => {
                reset[g] = {};
                Object.keys(gradeRatios[g]).forEach(s => reset[g][s] = 0);
              });
              setGradeRatios(reset);
            }}
            className="btn-secondary"
          >
            Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? <span className="material-symbols-rounded animate-spin text-sm">progress_activity</span> : <span className="material-symbols-rounded text-sm">save</span>}
            Save Ratio
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md border flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          <span className="material-symbols-rounded text-xl">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="font-bold mb-4">Configuration Settings</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Config Name</label>
              <input 
                type="text" 
                value={configName}
                onChange={e => setConfigName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Ratio Level</label>
              <select 
                value={ratioLevel[0]}
                onChange={e => setRatioLevel([e.target.value])}
                className="input-field"
              >
                <option value="Brick">Brick</option>
                <option value="Category">Category</option>
                <option value="Brick + Neck">Brick + Neck</option>
              </select>
            </div>
            
            <div className="p-3 bg-surface border border-border rounded-lg text-sm">
              <span className="text-muted block mb-1">Selected Group:</span>
              <strong className="text-primary">{groupedData.groupValue}</strong>
            </div>
          </div>
        </div>

        {/* Ratio Editor */}
        <div className="lg:col-span-3">
          <div className="glass-panel overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-surface/50">
              <h3 className="text-xl font-bold">{ratioLevel[0]}: {groupedData.groupValue}</h3>
            </div>
            
            <div className="p-6 space-y-8 bg-surface-glass">
              {groupedData.grades.map(grade => {
                const sizes = groupedData.sizesByGrade[grade] || [];
                return (
                  <div key={grade} className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-border bg-muted/5 flex items-center justify-between">
                      <span className="font-bold text-primary flex items-center gap-2">
                        Grade {grade}
                      </span>
                    </div>
                    
                    <div className="p-4 overflow-x-auto">
                      <div className="flex gap-4 min-w-max">
                        {sizes.length === 0 ? (
                          <span className="text-sm text-muted">No sizes available for this grade.</span>
                        ) : (
                          sizes.map(size => (
                            <div key={size} className="flex flex-col items-center w-20">
                              <label className="text-sm font-medium text-muted mb-2">{size}</label>
                              <input
                                type="number"
                                min="0"
                                value={gradeRatios[grade]?.[size] || ''}
                                onChange={e => handleRatioChange(grade, size, e.target.value)}
                                className="w-full text-center input-field !text-lg !py-3 rounded-lg focus:ring-primary shadow-inner bg-background"
                                placeholder="0"
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioPage;
