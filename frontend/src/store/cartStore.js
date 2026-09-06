import { create } from 'zustand';
import { toast } from './toastStore';

const CART_STORAGE_KEY = 'threadly_active_cart';
const RATIOS_STORAGE_KEY = 'threadly_applied_ratios';

// Helper to get initial ratios for a set of sizes
export function createDefaultSizeRatios(sizes = [], grade = 'A') {
  const ratios = {};
  sizes.forEach((s) => {
    // Standard default distribution
    ratios[s] = grade === 'A' ? 2 : grade === 'B' ? 2 : 1;
  });
  return ratios;
}

export const useCartStore = create((set, get) => ({
  items: (() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),

  // Ratio configurations saved or applied in cart
  appliedRatios: (() => {
    try {
      const saved = localStorage.getItem(RATIOS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })(),

  ratioLevel: 'Brick', // 'Brick' | 'Category' | 'Brick_Neck' | 'Brick_Sleeve'

  // Modals & Drawers Visibility (Liquid Glass surfaces)
  isCartDrawerOpen: false,
  isRatioModalOpen: false,
  isOrderSummaryOpen: false,
  quickViewProduct: null,

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),

  openRatioModal: () => set({ isRatioModalOpen: true }),
  closeRatioModal: () => set({ isRatioModalOpen: false }),

  openOrderSummary: () => set({ isOrderSummaryOpen: true }),
  closeOrderSummary: () => set({ isOrderSummaryOpen: false }),

  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  setRatioLevel: (level) => set({ ratioLevel: level }),

  // Persist cart helper
  _persist: (newItems, newRatios) => {
    try {
      if (newItems) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      if (newRatios) localStorage.setItem(RATIOS_STORAGE_KEY, JSON.stringify(newRatios));
    } catch {}
  },

  /**
   * Add a product to the cart with Grade and Sets
   */
  addToCart: (product, { grade = 'A', sets = 1, customRatios = null } = {}) => {
    const { items, appliedRatios, ratioLevel } = get();
    const productId = product._id || product.style_code;
    const itemKey = `${productId}_${grade}`;

    const existingIndex = items.findIndex((i) => i.itemKey === itemKey);

    const sizes = Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : ['S', 'M', 'L', 'XL'];

    // Check if an existing ratio rule applies to this product's group
    let initialRatios = customRatios;
    if (!initialRatios) {
      const groupKey = ratioLevel === 'Category' ? product.category : product.brick;
      if (appliedRatios[groupKey]?.[grade]) {
        initialRatios = { ...appliedRatios[groupKey][grade] };
      } else {
        initialRatios = createDefaultSizeRatios(sizes, grade);
      }
    }

    let updatedItems;
    if (existingIndex >= 0) {
      updatedItems = [...items];
      updatedItems[existingIndex].sets += sets;
    } else {
      const newItem = {
        itemKey,
        productId,
        style_code: product.style_code,
        title: product.title,
        brand: product.brand || 'Threadly',
        brick: product.brick,
        category: product.category,
        sleeve: product.sleeve || '',
        neck: product.neck || '',
        color: product.color || 'Standard',
        color_code: product.color_code || '#1E293B',
        mrp: product.mrp || product.price || 1999,
        image: product.image,
        grade,
        sets,
        sizes,
        sizeRatios: initialRatios,
      };
      updatedItems = [...items, newItem];
    }

    set({ items: updatedItems, isCartDrawerOpen: true });
    get()._persist(updatedItems);
    toast.success(`Added ${product.title} (Grade ${grade}) to Cart!`);
  },

  /**
   * Update the Grade of a line item
   */
  updateItemGrade: (itemKey, newGrade) => {
    const { items, appliedRatios, ratioLevel } = get();
    const updated = items.map((item) => {
      if (item.itemKey === itemKey) {
        const groupKey = ratioLevel === 'Category' ? item.category : item.brick;
        const matchedRatio = appliedRatios[groupKey]?.[newGrade];
        const newRatios = matchedRatio || createDefaultSizeRatios(item.sizes, newGrade);
        return {
          ...item,
          grade: newGrade,
          itemKey: `${item.productId}_${newGrade}`,
          sizeRatios: newRatios
        };
      }
      return item;
    });

    set({ items: updated });
    get()._persist(updated);
  },

  /**
   * Update sets quantity for an item
   */
  updateItemSets: (itemKey, sets) => {
    const validSets = Math.max(1, parseInt(sets, 10) || 1);
    const updated = get().items.map((i) =>
      i.itemKey === itemKey ? { ...i, sets: validSets } : i
    );
    set({ items: updated });
    get()._persist(updated);
  },

  /**
   * Update ratio for a specific size in a line item
   */
  updateItemSizeRatio: (itemKey, size, val) => {
    const numericVal = Math.max(0, parseInt(val, 10) || 0);
    const updated = get().items.map((i) => {
      if (i.itemKey === itemKey) {
        return {
          ...i,
          sizeRatios: {
            ...i.sizeRatios,
            [size]: numericVal
          }
        };
      }
      return i;
    });
    set({ items: updated });
    get()._persist(updated);
  },

  /**
   * Remove item from cart
   */
  removeItem: (itemKey) => {
    const updated = get().items.filter((i) => i.itemKey !== itemKey);
    set({ items: updated });
    get()._persist(updated);
    toast.info('Item removed from cart');
  },

  /**
   * Apply global ratio rules (e.g. from the Input Ratio Modal)
   * rules: { [groupValue]: { [grade]: { [size]: ratioValue } } }
   */
  applyRatioRules: (newRatioLevel, rules) => {
    const { items } = get();
    const updatedItems = items.map((item) => {
      let groupValue = item.brick;
      if (newRatioLevel === 'Category') groupValue = item.category;
      if (newRatioLevel === 'Brick_Neck') groupValue = `${item.brick} + ${item.neck || 'Standard'}`;
      if (newRatioLevel === 'Brick_Sleeve') groupValue = `${item.brick} + ${item.sleeve || 'Standard'}`;

      const groupRule = rules[groupValue];
      if (groupRule && groupRule[item.grade]) {
        return {
          ...item,
          sizeRatios: { ...groupRule[item.grade] }
        };
      }
      return item;
    });

    set({
      items: updatedItems,
      appliedRatios: rules,
      ratioLevel: newRatioLevel,
      isRatioModalOpen: false
    });
    get()._persist(updatedItems, rules);
    toast.success(`Ratios applied across all ${newRatioLevel} groups!`);
  },

  clearCart: () => {
    set({ items: [] });
    get()._persist([]);
    toast.info('Cart cleared');
  },

  // Computed Cart Totals
  getTotals: () => {
    const { items } = get();
    let totalSets = 0;
    let totalUnits = 0;
    let totalMRP = 0;

    items.forEach((item) => {
      totalSets += item.sets;
      const ratiosSum = Object.values(item.sizeRatios || {}).reduce((sum, val) => sum + (Number(val) || 0), 0);
      const unitsForThisItem = item.sets * (ratiosSum > 0 ? ratiosSum : 1);
      totalUnits += unitsForThisItem;
      totalMRP += unitsForThisItem * item.mrp;
    });

    return {
      totalSets,
      totalUnits,
      totalMRP,
      itemCount: items.length,
    };
  }
}));
