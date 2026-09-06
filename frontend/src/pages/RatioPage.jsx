import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { GRADE_CONFIG, GRADES, RATIO_LEVELS } from '../constants/grades';
import api from '../services/api';
import { toast } from '../store/toastStore';
import {
  SlidersHorizontal,
  Layers,
  Calculator,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RatioPage() {
  const {
    items,
    appliedRatios,
    ratioLevel,
    openRatioModal,
    setRatioLevel,
    applyRatioRules
  } = useCartStore();

  const [savedRatios, setSavedRatios] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Live Calculator State
  const [calcBrick, setCalcBrick] = useState('Shirts');
  const [calcGrade, setCalcGrade] = useState('A');
  const [calcSets, setCalcSets] = useState(10);
  const [sampleSizes, setSampleSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']);

  // Fetch saved ratio configurations from backend
  useEffect(() => {
    const fetchSaved = async () => {
      setLoadingSaved(true);
      try {
        const res = await api.get('/ratios');
        setSavedRatios(res.data || []);
      } catch (err) {
        console.warn('Could not fetch saved ratios from backend:', err.message);
      } finally {
        setLoadingSaved(false);
      }
    };
    fetchSaved();
  }, []);

  // Calculate live numbers
  const activeRatioForCalc = appliedRatios[calcBrick]?.[calcGrade] || {
    S: 1, M: 2, L: 2, XL: 1, XXL: 1
  };
  const sumRatioPcs = Object.values(activeRatioForCalc).reduce((a, b) => a + Number(b || 0), 0);
  const totalPieces = calcSets * (sumRatioPcs > 0 ? sumRatioPcs : 1);

  const handleDeleteSaved = async (id) => {
    try {
      await api.delete(`/ratios/${id}`);
      setSavedRatios((prev) => prev.filter((r) => r._id !== id));
      toast.info('Ratio configuration removed');
    } catch (err) {
      toast.error('Failed to delete ratio');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-20 pt-2">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Grade-Wise Ratio Planning Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Define and simulate size curves per Grade across Brick, Category, or Neck & Sleeve combinations.
          </p>
        </div>

        <button
          onClick={openRatioModal}
          className="btn-accent text-xs sm:text-sm py-2 px-4 shadow-sm flex items-center gap-2 self-start"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Configure Ratio Matrix
        </button>
      </div>

      {/* 2. Interactive Calculator & Simulation Card */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-brand-primary">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Live Wholesale Ratio Simulator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulate how many units of each size are manufactured for a given set count.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
            Active Level: {ratioLevel}
          </span>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Brick Group
            </label>
            <select
              value={calcBrick}
              onChange={(e) => setCalcBrick(e.target.value)}
              className="form-input text-xs font-semibold"
            >
              <option value="Shirts">Shirts</option>
              <option value="Trousers">Trousers</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Dresses">Dresses</option>
              <option value="Jeans and Jeggings">Jeans and Jeggings</option>
              <option value="Sweatshirts">Sweatshirts</option>
              <option value="Trackpants">Trackpants</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Grade
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setCalcGrade(g)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    calcGrade === g
                      ? `${GRADE_CONFIG[g].badgeBg} ring-2 ring-brand-primary shadow-2xs`
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Wholesale Sets Count
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={calcSets}
              onChange={(e) => setCalcSets(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="form-input text-xs font-bold"
            />
          </div>
        </div>

        {/* Live Size Output Matrix */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Size-Wise Output Breakdown:</span>
            <span>Ratio Sum: {sumRatioPcs} pcs / set</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(activeRatioForCalc).map(([sz, ratio]) => {
              const pcsForSize = calcSets * Number(ratio);

              return (
                <div
                  key={sz}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1 shadow-2xs"
                >
                  <span className="text-xs font-bold text-slate-400 block">{sz}</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block">
                    {pcsForSize}
                  </span>
                  <span className="text-[10px] text-brand-primary dark:text-indigo-300 block font-medium">
                    ({ratio} × {calcSets} sets)
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            <span>Total Units Allocated:</span>
            <span className="text-brand-accent text-base sm:text-lg">
              {totalPieces} Pieces
            </span>
          </div>
        </div>
      </section>

      {/* 3. Applied Cart Configurations or Cart Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cart Items With Active Ratios ({items.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review current line items and their applied grade size curves.
            </p>
          </div>
          {items.length > 0 && (
            <Link
              to="/cart"
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
            >
              View Full Cart <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No products currently in cart. Add products with Grade A, B, or C from the catalogue to set and apply ratios.
            </p>
            <Link to="/catalogue" className="btn-primary text-xs py-2 px-4 inline-flex">
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              const rSum = Object.values(item.sizeRatios || {}).reduce((s, v) => s + Number(v || 0), 0);
              const cfg = GRADE_CONFIG[item.grade] || GRADE_CONFIG.A;

              return (
                <div
                  key={item.itemKey}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.badgeBg}`}>
                      Grade {item.grade}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.sets} Sets ({item.sets * rSum} units)
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {item.brick} • {item.category}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.entries(item.sizeRatios || {}).map(([sz, r]) => (
                      <span
                        key={sz}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {sz}: {r}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Saved Ratio Configurations on MongoDB */}
      {savedRatios.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Saved Ratio Configurations on Database ({savedRatios.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRatios.map((sr) => (
              <div
                key={sr._id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {sr.name}
                  </h4>
                  <button
                    onClick={() => handleDeleteSaved(sr._id)}
                    className="text-slate-400 hover:text-brand-accent p-0.5"
                    aria-label="Delete saved ratio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary">
                  Level: {sr.ratioLevel}
                </span>
                <p className="text-[11px] text-slate-400">
                  Groups: {(sr.groupValues || []).join(', ') || 'Default'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
