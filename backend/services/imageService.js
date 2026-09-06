/**
 * Curated Image Resolution Service
 * Maps each Brick category to a pool of real, license-free fashion photography from Unsplash.
 * Uses deterministic hashing based on style_code so each style receives a consistent, high-quality gallery.
 */

const CATEGORY_IMAGE_POOLS = {
  'Trousers': [
    {
      primary: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&q=85&auto=format&fit=crop'
      ]
    },
    {
      primary: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85&auto=format&fit=crop'
      ]
    },
    {
      primary: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Shirts': [
    {
      primary: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4d09?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=85&auto=format&fit=crop'
      ]
    },
    {
      primary: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4b4d09?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=900&q=85&auto=format&fit=crop'
      ]
    },
    {
      primary: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594938298603-c8148c4b4d09?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'T-Shirts': [
    {
      primary: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&q=85&auto=format&fit=crop'
      ]
    },
    {
      primary: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=85&auto=format&fit=crop'
      ]
    },
    {
      primary: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Dresses': [
    {
      primary: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85&auto=format&fit=crop'
      ]
    },
    {
      primary: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Jeans and Jeggings': [
    {
      primary: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Jackets': [
    {
      primary: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Shorts': [
    {
      primary: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1591195856574-d4b68074d284?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Skirts': [
    {
      primary: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Sweatshirts': [
    {
      primary: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Tops': [
    {
      primary: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Trackpants': [
    {
      primary: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ],
  'Jumpsuits & Playsuits': [
    {
      primary: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85&auto=format&fit=crop'
      ]
    }
  ]
};

// Default fallback pool for any unspecified category
const DEFAULT_POOL = [
  {
    primary: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=85&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=85&auto=format&fit=crop'
    ]
  },
  {
    primary: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=85&auto=format&fit=crop'
    ]
  }
];

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Resolves a curated, license-free image set for a given product
 * @param {string} brick - The product's brick category
 * @param {string} styleCode - The product's style code
 * @returns {{ image: string, gallery: string[] }}
 */
function resolveProductImages(brick, styleCode) {
  const pool = CATEGORY_IMAGE_POOLS[brick] || DEFAULT_POOL;
  const index = simpleHash(String(styleCode || brick)) % pool.length;
  const selected = pool[index];
  return {
    image: selected.primary,
    gallery: [selected.primary, ...(selected.gallery || [])]
  };
}

module.exports = {
  resolveProductImages,
  CATEGORY_IMAGE_POOLS
};
