const OFF_BASE = 'https://world.openfoodfacts.org';

const COMMON_PRODUCTS = {
  milk: [
    {
      id: 'local_milk_1',
      barcode: '',
      name: 'Fresh Milk',
      brand: 'Almarai',
      size: '1 L',
      category: 'DAIRY',
      badge: 'Dairy product',
      image: 'https://via.placeholder.com/120x120/e8f5e9/2e7d32?text=Milk',
    },
    {
      id: 'local_milk_2',
      barcode: '',
      name: 'Low Fat Milk',
      brand: 'Nadec',
      size: '1 L',
      category: 'DAIRY',
      badge: 'Low fat milk',
      image: 'https://via.placeholder.com/120x120/e8f5e9/2e7d32?text=Milk',
    },
    {
      id: 'local_milk_3',
      barcode: '',
      name: 'Whole Milk',
      brand: 'Nada',
      size: '1 L',
      category: 'DAIRY',
      badge: 'Whole milk',
      image: 'https://via.placeholder.com/120x120/e8f5e9/2e7d32?text=Milk',
    },
  ],

  egg: [
    {
      id: 'local_egg_1',
      barcode: '',
      name: 'Fresh Eggs',
      brand: 'Al Watania',
      size: '12 pcs',
      category: 'EGGS',
      badge: 'Fresh eggs',
      image: 'https://via.placeholder.com/120x120/fff3e0/f57c00?text=Eggs',
    },
    {
      id: 'local_egg_2',
      barcode: '',
      name: 'Large White Eggs',
      brand: 'Farm Fresh',
      size: '15 pcs',
      category: 'EGGS',
      badge: 'Large eggs',
      image: 'https://via.placeholder.com/120x120/fff3e0/f57c00?text=Eggs',
    },
    {
      id: 'local_egg_3',
      barcode: '',
      name: 'Organic Eggs',
      brand: 'Organic Farm',
      size: '6 pcs',
      category: 'EGGS',
      badge: 'Organic eggs',
      image: 'https://via.placeholder.com/120x120/fff3e0/f57c00?text=Eggs',
    },
  ],

  chicken: [
    {
      id: 'local_chicken_1',
      barcode: '',
      name: 'Chicken Breast',
      brand: 'Fresh Foods',
      size: '800 g',
      category: 'MEAT',
      badge: 'High protein',
      image: 'https://via.placeholder.com/120x120/e8f5e9/2e7d32?text=Chicken',
    },
  ],

  tomato: [
    {
      id: 'local_tomato_1',
      barcode: '',
      name: 'Tomatoes',
      brand: 'Fresh Produce',
      size: '1 kg',
      category: 'VEGETABLES',
      badge: 'Fresh produce',
      image: 'https://via.placeholder.com/120x120/e8f5e9/2e7d32?text=Tomato',
    },
  ],
};

function normalizeText(value) {
  return String(value || '').toLowerCase().trim();
}

function getLocalProducts(query) {
  const q = normalizeText(query);

  if (q.includes('milk') || q.includes('حليب')) return COMMON_PRODUCTS.milk;
  if (q.includes('egg') || q.includes('eggs') || q.includes('بيض')) return COMMON_PRODUCTS.egg;
  if (q.includes('chicken') || q.includes('دجاج')) return COMMON_PRODUCTS.chicken;
  if (q.includes('tomato') || q.includes('tomatoes') || q.includes('طماطم')) return COMMON_PRODUCTS.tomato;

  return [];
}

function getCategory(product) {
  const text = normalizeText(
    `${product.product_name || ''} ${product.product_name_en || ''} ${product.generic_name || ''} ${product.categories || ''} ${(product.categories_tags || []).join(' ')}`
  );

  if (text.includes('egg')) return 'EGGS';

  if (
    text.includes('milk') ||
    text.includes('dairy') ||
    text.includes('yogurt') ||
    text.includes('cheese')
  ) {
    return 'DAIRY';
  }

  if (
    text.includes('meat') ||
    text.includes('chicken') ||
    text.includes('beef') ||
    text.includes('poultry')
  ) {
    return 'MEAT';
  }

  if (
    text.includes('vegetable') ||
    text.includes('tomato') ||
    text.includes('fruit') ||
    text.includes('produce')
  ) {
    return 'VEGETABLES';
  }

  return 'GROCERY';
}

function mapProduct(product, index = 0) {
  return {
    id: product.code || `api_${Date.now()}_${index}`,
    barcode: product.code || '',
    name:
      product.product_name_en ||
      product.product_name ||
      product.generic_name ||
      'Unknown Product',
    brand: product.brands || 'Unknown Brand',
    size: product.quantity || '1 unit',
    category: getCategory(product),
    badge: product.nutriscore_grade
      ? `Nutri-Score ${String(product.nutriscore_grade).toUpperCase()}`
      : 'Product found',
    image:
      product.image_front_small_url ||
      product.image_front_url ||
      product.image_url ||
      'https://via.placeholder.com/120x120/e8f5e9/2e7d32?text=Item',
  };
}

function productNameMatches(product, query) {
  const q = normalizeText(query);

  const name = normalizeText(
    `${product.product_name_en || ''} ${product.product_name || ''} ${product.generic_name || ''}`
  );

  const category = normalizeText(
    `${product.categories || ''} ${(product.categories_tags || []).join(' ')}`
  );

  if (!q) return false;

  if (q.includes('egg') || q.includes('eggs')) {
    return name.includes('egg') || category.includes('egg');
  }

  if (q.includes('milk')) {
    return name.includes('milk') || category.includes('milk') || category.includes('dairy');
  }

  if (q.includes('chicken')) {
    return name.includes('chicken') || category.includes('chicken');
  }

  if (q.includes('tomato')) {
    return name.includes('tomato') || category.includes('tomato');
  }

  return name.includes(q);
}

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SmartGroceryListApp/1.0',
      },
    });

    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJsonWithRetry(url, retries = 2) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
  }

  throw lastError;
}

function buildSearchUrl(query) {
  const cleanQuery = encodeURIComponent(query.trim());

  return (
    `${OFF_BASE}/api/v2/search?` +
    `search_terms=${cleanQuery}` +
    `&page_size=40` +
    `&sort_by=unique_scans_n` +
    `&fields=code,product_name,product_name_en,generic_name,brands,quantity,categories,categories_tags,image_front_small_url,image_front_url,image_url,nutriscore_grade`
  );
}

export async function searchProducts(query) {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    throw new Error('Please enter a product name.');
  }

  const localProducts = getLocalProducts(cleanQuery);

  try {
    const url = buildSearchUrl(cleanQuery);
    const data = await fetchJsonWithRetry(url, 2);

    const apiProducts = (data.products || [])
      .filter((product) => product.product_name || product.product_name_en)
      .filter((product) => productNameMatches(product, cleanQuery))
      .map(mapProduct)
      .slice(0, 8);

    if (apiProducts.length > 0) {
      const localIds = new Set(localProducts.map((item) => item.id));
      const merged = [
        ...localProducts,
        ...apiProducts.filter((item) => !localIds.has(item.id)),
      ];

      return merged.slice(0, 12);
    }

    if (localProducts.length > 0) {
      return localProducts;
    }

    throw new Error('No matching products found.');
  } catch (error) {
    if (localProducts.length > 0) {
      return localProducts;
    }

    throw new Error('Could not connect to product API. Please try again.');
  }
}

export async function lookupProductByBarcode(barcode) {
  const cleanBarcode = String(barcode || '').trim();

  if (!cleanBarcode) {
    throw new Error('No barcode detected.');
  }

  const url =
    `${OFF_BASE}/api/v2/product/${encodeURIComponent(cleanBarcode)}.json?` +
    `fields=code,product_name,product_name_en,generic_name,brands,quantity,categories,categories_tags,image_front_small_url,image_front_url,image_url,nutriscore_grade`;

  try {
    const data = await fetchJsonWithRetry(url, 2);

    if (data.status !== 1 || !data.product) {
      throw new Error('Product not found.');
    }

    return mapProduct(data.product, 0);
  } catch (error) {
    throw new Error(
      'This barcode was scanned successfully, but the product was not found in the database. Try searching by product name.'
    );
  }
}