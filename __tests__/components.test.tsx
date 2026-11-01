import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../src/components/Hero';

describe('Hero Component', () => {
  it('renders hero title and value proposition badges correctly', () => {
    render(<Hero />);

    // Check heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Otentikasi Rasa');
    expect(heading.textContent).toContain('Nusantara');

    // Check CTA buttons
    expect(screen.getByText('Beli Sekarang')).toBeInTheDocument();
    expect(screen.getByText('Konsultasi via WA')).toBeInTheDocument();

    // Check key value proposition badges
    expect(screen.getByText('100% Petani')).toBeInTheDocument();
    expect(screen.getByText('Alami & Halal')).toBeInTheDocument();
    expect(screen.getByText('Kirim Cepat')).toBeInTheDocument();
  });
});
