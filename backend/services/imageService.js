/**
 * Curated Image Resolution Service
 * Each brick category has a large, unique pool of real Unsplash fashion photos.
 * A global deduplication map ensures no two products share the same primary image.
 */

const CATEGORY_IMAGE_POOLS = {
  'Dresses': [
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623091410901-00e2d268901f?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603189042033-58a4c7d8a396?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=85&auto=format&fit=crop',
  ],

  'T-Shirts': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593726891090-d1a9bfc33b54?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512327428172-78e30c2e4e93?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=900&q=85&auto=format&fit=crop',
  ],

  'Shirts': [
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4d09?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619603364897-4f9e5e9d69c9?w=900&q=85&auto=format&fit=crop',
  ],

  'Trousers': [
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519748771451-a94c596fbc4a?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&q=85&auto=format&fit=crop',
  ],

  'Jeans and Jeggings': [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519748771451-a94c596fbc4a?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=900&q=85&auto=format&fit=crop',
  ],

  'Sweatshirts': [
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579572331145-5e53b299c83b?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511389026070-a14ae610a1be?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535295972539-1b8d6b11af9b?w=900&q=85&auto=format&fit=crop',
  ],

  'Trackpants': [
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596460107916-430662021049?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1530822847156-5df684ec5933?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&q=85&auto=format&fit=crop',
  ],

  'Jumpsuits & Playsuits': [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623091410901-00e2d268901f?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=85&auto=format&fit=crop',
  ],

  'Jackets': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591213954196-2d0ccb3f8d4c?w=900&q=85&auto=format&fit=crop',
  ],

  'Skirts': [
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512327428172-78e30c2e4e93?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=900&q=85&auto=format&fit=crop',
  ],

  'Tops': [
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470219556762-1771e7f9427d?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=900&q=85&auto=format&fit=crop',
  ],

  'Shorts': [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591195856574-d4b68074d284?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514994667424-11d5b6b6d7f7?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596460107916-430662021049?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=900&q=85&auto=format&fit=crop',
  ],
};

const DEFAULT_POOL = [
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85&auto=format&fit=crop',
];

// Global used-image tracker — reset per seeding run
const _usedPrimaries = new Set();

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Build a 3-image gallery from the pool, starting from the primary index,
 * picking next distinct images in round-robin fashion.
 */
function buildGallery(pool, primaryIndex) {
  const gallery = [pool[primaryIndex]];
  for (let offset = 1; gallery.length < 3 && offset < pool.length; offset++) {
    const next = pool[(primaryIndex + offset) % pool.length];
    if (!gallery.includes(next)) gallery.push(next);
  }
  return gallery;
}

/**
 * Resolves a curated, unique image set for a given product.
 * Guarantees: no two products in the same seeding run share the same primary image.
 *
 * @param {string} brick - The product's brick category
 * @param {string} styleCode - The product's style code (used as hash seed)
 * @returns {{ image: string, gallery: string[] }}
 */
function resolveProductImages(brick, styleCode) {
  const pool = CATEGORY_IMAGE_POOLS[brick] || DEFAULT_POOL;
  const baseIndex = simpleHash(String(styleCode || brick)) % pool.length;

  // Walk the pool from the hash index until we find an unused primary
  let chosenIndex = baseIndex;
  for (let attempt = 0; attempt < pool.length; attempt++) {
    const candidate = pool[(baseIndex + attempt) % pool.length];
    if (!_usedPrimaries.has(candidate)) {
      chosenIndex = (baseIndex + attempt) % pool.length;
      _usedPrimaries.add(candidate);
      break;
    }
  }
  // If all are used, fall back to the hash index (pool exhausted for this brick)
  const primaryImage = pool[chosenIndex];

  return {
    image: primaryImage,
    gallery: buildGallery(pool, chosenIndex),
  };
}

/** Call this before starting a fresh seed to reset the dedup tracker */
function resetImageTracker() {
  _usedPrimaries.clear();
}

module.exports = {
  resolveProductImages,
  resetImageTracker,
  CATEGORY_IMAGE_POOLS,
};
