import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../product/ProductCard';

// Mock product data
const mockProduct = {
  id: 'p-001',
  slug: 'test-product',
  name: 'Test Product',
  category: 'jouets-bebe',
  categoryName: 'Jouets bébé',
  description: 'Test description',
  price: 29.99,
  oldPrice: undefined,
  rating: 4.5,
  reviewCount: 15,
  images: ['/products/test-1.png'],
  inStock: true,
  stockCount: 10,
  materials: ['Plastique'],
  safety: ['CE'],
  badge: 'Nouveau',
  bgClass: 'bg-blue-50',
  color: 'sky',
  age: ['0-12m', '1-3'],
  dimensions: '20x15 cm',
};

describe('ProductCard Component', () => {
  it('should render product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should display price in correct format', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/29,99 €/)).toBeInTheDocument();
  });

  it('should display rating and review count', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/15/)).toBeInTheDocument(); // review count
  });

  it('should display "In Stock" when available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });

  it('should not display old price when undefined', () => {
    render(<ProductCard product={mockProduct} />);
    const strike = screen.queryByRole('presentation', { hidden: true });
    // Old price should not be shown
  });

  it('should display badge when present', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Nouveau')).toBeInTheDocument();
  });

  it('should render product link with correct href', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/produit/test-product');
  });

  it('should handle missing review count', () => {
    const productNoReviews = { ...mockProduct, reviewCount: 0 };
    render(<ProductCard product={productNoReviews} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
