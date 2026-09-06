import React, { useState, useEffect, useMemo } from 'react';
import { useCartStore } from '../../store/cartStore';
import { GRADES, GRADE_CONFIG, RATIO_LEVELS } from '../../constants/grades';
import api from '../../services/api';
import { toast } from '../../store/toastStore';
import {
  X,
  SlidersHorizontal,
  Layers,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Save
} from 'lucide-react';

export default function InputRatioModal() {
  const {
    items,
    isRatioModalOpen,
    closeRatioModal,
    ratioLevel,
    setRatioLevel,
    appliedRatios,
    applyRatioRules
  } = useCartStore();

  const [selectedLevel, setSelectedLevel] = useState(ratioLevel || 'Brick');
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [ratioMatrix, setRatioMatrix] = useState({});
  const [savingToBackend, setSavingToBackend] = useState(false);

  // Group products by the selected Ratio Level
  const groups = useMemo(() => {
    const groupMap = new Map();

    // Group items from cart (or sample items if cart is empty)
    const sourceItems = items.length > 0 ? items : [
      { brick: 'Shirts', category: 'Top_Wear', neck: 'Collar', sleeve: 'Full Sleeve', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { brick: 'Trousers', category: 'Bottom_Wear', neck: '', sleeve: '', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
      { brick: 'Dresses', category: "Women's Apparel", neck: 'Round Neck', sleeve: 'Short Sleeve', sizes: ['4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'] },
    ];

    sourceItems.forEach((item) => {
      let key = item.brick;
      if (selectedLevel === 'Category') key = item.category || 'Apparel';
      if (selectedLevel === 'Brick_Neck') key = `${item.brick} + ${item.neck || 'Standard'}`;
      if (selectedLevel === 'Brick_Sleeve') key = `${item.brick} + ${item.sleeve || 'Standard'}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          title: key,
          level: selectedLevel,
          attribute_data: [{ key: selectedLevel, value: key }],
          sizesSet: new Set(item.sizes || ['S', 'M', 'L', 'XL']),
          itemCount: 0
        });
      }

      const grp = groupMap.get(key);
      (item.sizes || []).forEach((sz) => grp.sizesSet.add(sz));
      grp.itemCount++;
    });

    return Array.from(groupMap.values()).map((g) => ({
      ...g,
      sizes: Array.from(g.sizesSet)
    }));
  }, [items, selectedLevel]);

  // Initialize or re-map ratio matrix whenever groups or selectedLevel change
  useEffect(() => {
    const initial = {};

    groups.forEach((g) => {
      initial[g.title] = {};
      GRADES.forEach((grade) => {
        initial[g.title][grade] = {};
        g.sizes.forEach((sz, sIdx) => {
          // Check existing applied ratio or generate sensible defaults
          const existing = appliedRatios[g.title]?.[grade]?.[sz];
          if (existing !== undefined) {
            initial[g.title][grade][sz] = existing;
          } else {
            // Default: Bell curve distribution (e.g. S:1, M:2, L:2, XL:1)
            const mid = Math.floor(g.sizes.length / 2);
            if (sIdx === mid || sIdx === mid - 1) {
              initial[g.title][grade][sz] = grade === 'A' ? 2 : grade === 'B' ? 2 : 1;
            } else {
              initial[g.title][grade][sz] = 1;
            }
          }
        });
      });
    });

    setRatioMatrix(initial);
  }, [groups, selectedLevel, appliedRatios]);

  if (!isRatioModalOpen) return null;

  const handleRatioChange = (groupTitle, grade, size, value) => {
    const numeric = Math.max(0, parseInt(value, 10) || 0);
    setRatioMatrix((prev) => ({
      ...prev,
      [groupTitle]: {
        ...prev[groupTitle],
        [grade]: {
          ...prev[groupTitle]?.[grade],
          [size]: numeric
        }
      }
    }));
  };

  const applyPreset = (groupTitle, grade, presetPattern) => {
    const g = groups.find((grp) => grp.title === groupTitle);
    if (!g) return;

    const newRow = {};
    g.sizes.forEach((sz, idx) => {
      newRow[sz] = presetPattern[idx % presetPattern.length];
    });

    setRatioMatrix((prev) => ({
      ...prev,
      [groupTitle]: {
        ...prev[groupTitle],
        [grade]: newRow
      }
    }));
  };

  const handleReset = () => {
    const reset = {};
    groups.forEach((g) => {
      reset[g.title] = {};
      GRADES.forEach((grade) => {
        reset[g.title][grade] = {};
        g.sizes.forEach((sz) => {
          reset[g.title][grade][sz] = 1;
        });
      });
    });
    setRatioMatrix(reset);
    toast.info('Ratios reset to 1:1 baseline');
  };

  const handleSaveAndApply = async () => {
    setSavingToBackend(true);
    try {
      // Build assignment format ratioData array
      const ratioDataArray = [];
      groups.forEach((g) => {
        GRADES.forEach((grade) => {
          const sizeList = g.sizes.map((sz) => ({
            size: sz,
            value: ratioMatrix[g.title]?.[grade]?.[sz] || 0
          }));

          ratioDataArray.push({
            title: g.title,
            attribute_data: g.attribute_data,
            size: sizeList,
            grade
          });
        });
      });

      // Apply locally to cart store
      applyRatioRules(selectedLevel, ratioMatrix);
      setRatioLevel(selectedLevel);

      // Save to backend ratio endpoint
      await api.post('/ratios', {
        name: `${selectedLevel} Ratio Rule (${new Date().toLocaleDateString()})`,
        ratioLevel: selectedLevel,
        groupKey: selectedLevel,
        groupValues: groups.map((g) => g.title),
        gradeRatios: ratioMatrix,
        ratioData: ratioDataArray
      }).catch((err) => {
        console.warn('Backend ratio sync note:', err.message);
      });

      closeRatioModal();
    } catch (err) {
      console.error('Save ratio error:', err);
    } finally {
      setSavingToBackend(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeRatioModal}
      />

      {/* Liquid Glass Modal Container */}
      <div className="relative z-10 w-full max-w-4xl my-6 liquid-glass-modal p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 border border-white/50 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-brand-primary">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Input Ratio Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set separate size-wise distribution ratios for Grade A, B, C and D products.
            </p>
          </div>

          <button
            onClick={closeRatioModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Ratio Level Selector */}
        <div className="py-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ratio Level:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {RATIO_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedLevel === lvl.id
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400">
              {groups.length} {selectedLevel} {groups.length === 1 ? 'group' : 'groups'} detected
            </span>
          </div>
        </div>

        {/* Modal Body: Accordion Group Sections */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {groups.map((grp, gIdx) => {
            const isAccordionOpen = activeGroupIndex === gIdx;

            return (
              <div
                key={grp.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden shadow-2xs"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setActiveGroupIndex(isAccordionOpen ? -1 : gIdx)}
                  className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-primary" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {grp.title}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({grp.sizes.length} sizes: {grp.sizes.join(', ')})
                    </span>
                  </div>
                  {isAccordionOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Accordion Content Grid */}
                {isAccordionOpen && (
                  <div className="p-4 space-y-4">
                    {/* Ratio Table per Grade */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                            <th className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300 w-28">
                              Grade
                            </th>
                            {grp.sizes.map((sz) => (
                              <th
                                key={sz}
                                className="py-2.5 px-2 text-center font-bold text-slate-900 dark:text-slate-100 min-w-[3.5rem]"
                              >
                                {sz}
                              </th>
                            ))}
                            <th className="py-2.5 px-3 text-right font-bold text-brand-primary dark:text-indigo-300 w-24">
                              Set Sum
                            </th>
                            <th className="py-2.5 px-3 font-normal text-slate-400 w-36 text-center">
                              Quick Preset
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {GRADES.map((grade) => {
                            const cfg = GRADE_CONFIG[grade];
                            const rowRatios = ratioMatrix[grp.title]?.[grade] || {};
                            const rowSum = Object.values(rowRatios).reduce(
                              (sum, val) => sum + (Number(val) || 0),
                              0
                            );

                            return (
                              <tr
                                key={grade}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                              >
                                {/* Grade Label */}
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${cfg.badgeBg}`}
                                  >
                                    Grade {grade}
                                  </span>
                                </td>

                                {/* Per-Size Inputs */}
                                {grp.sizes.map((sz) => {
                                  const val = rowRatios[sz] !== undefined ? rowRatios[sz] : 1;

                                  return (
                                    <td key={sz} className="py-2 px-1 text-center">
                                      <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={val}
                                        onChange={(e) =>
                                          handleRatioChange(grp.title, grade, sz, e.target.value)
                                        }
                                        className="w-12 py-1 text-center font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-brand-primary"
                                      />
                                    </td>
                                  );
                                })}

                                {/* Set Sum Counter */}
                                <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {rowSum} pcs
                                  </span>
                                </td>

                                {/* Quick Presets */}
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => applyPreset(grp.title, grade, [1, 2, 2, 1])}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                      title="Set 1:2:2:1"
                                    >
                                      1:2:2:1
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => applyPreset(grp.title, grade, [1, 1, 1, 1])}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                      title="Set 1:1:1:1"
                                    >
                                      1:1:1:1
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleReset}
            type="button"
            className="btn-secondary text-xs py-2.5 px-3 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Baseline
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={closeRatioModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              disabled={savingToBackend}
              className="btn-accent text-xs py-2.5 px-5 flex items-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4" />
              Set Ratio & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
