import { filterProducts } from '../src/lib/utils';
import { Product } from '../src/types';

describe('filterProducts Utility', () => {
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Kopi Arabika Gayo',
      slug: 'kopi-arabika-gayo',
      description: 'Biji kopi dari Aceh Takengon',
      price: 85000,
      stock: 10,
      categoryId: 'cat-kopi',
      category: { id: 'cat-kopi', name: 'Kopi', slug: 'kopi', createdAt: new Date() },
      imageUrl: '/gayo.jpg',
      weight: '250g',
      rating: 4.9,
      isFeatured: true,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Keripik Pisang Cokelat',
      slug: 'keripik-pisang-cokelat',
      description: 'Camilan renyah lumur cokelat',
      price: 38000,
      stock: 20,
      categoryId: 'cat-camilan',
      category: { id: 'cat-camilan', name: 'Camilan', slug: 'camilan', createdAt: new Date() },
      imageUrl: '/pisang.jpg',
      weight: '200g',
      rating: 4.7,
      isFeatured: false,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Sambal Cakalang Pedas',
      slug: 'sambal-cakalang-pedas',
      description: 'Sambal ikan khas Manado',
      price: 48000,
      stock: 15,
      categoryId: 'cat-sambal',
      category: { id: 'cat-sambal', name: 'Sambal', slug: 'sambal', createdAt: new Date() },
      imageUrl: '/sambal.jpg',
      weight: '200g',
      rating: 5.0,
      isFeatured: false,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('should return all products when query is empty and category is all', () => {
    const res = filterProducts(sampleProducts, '', 'all', 'featured');
    expect(res.length).toBe(3);
  });

  it('should filter products by search keyword case-insensitively', () => {
    const res = filterProducts(sampleProducts, 'gayo', 'all', 'featured');
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Kopi Arabika Gayo');
  });

  it('should filter products by category slug', () => {
    const res = filterProducts(sampleProducts, '', 'camilan', 'featured');
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('Keripik Pisang Cokelat');
  });

  it('should sort products by price ascending (price-low)', () => {
    const res = filterProducts(sampleProducts, '', 'all', 'price-low');
    expect(res[0].price).toBe(38000); // Keripik pisang
    expect(res[1].price).toBe(48000); // Sambal
    expect(res[2].price).toBe(85000); // Kopi Gayo
  });

  it('should sort products by price descending (price-high)', () => {
    const res = filterProducts(sampleProducts, '', 'all', 'price-high');
    expect(res[0].price).toBe(85000); // Kopi Gayo
    expect(res[1].price).toBe(48000); // Sambal
    expect(res[2].price).toBe(38000); // Keripik Pisang
  });

  it('should sort products by rating descending', () => {
    const res = filterProducts(sampleProducts, '', 'all', 'rating');
    expect(res[0].rating).toBe(5.0); // Sambal Cakalang
    expect(res[1].rating).toBe(4.9); // Kopi Gayo
    expect(res[2].rating).toBe(4.7); // Keripik Pisang
  });
});
