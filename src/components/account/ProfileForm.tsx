/**
 * ProfileForm - Edit user profile
 */

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import type { User } from '@/lib/types/user';

export function ProfileForm() {
  const { user, loading } = useUser();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    birth_date: '',
    gender: '',
    bio: '',
    newsletter: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        gender: user.gender || '',
        bio: user.bio || '',
        newsletter: user.newsletter ?? true,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-navy mb-2">Nom complet</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">Téléphone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">Date de naissance</label>
        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">Genre</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
        >
          <option value="">Sélectionner...</option>
          <option value="M">Homme</option>
          <option value="F">Femme</option>
          <option value="O">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          placeholder="Dites-nous un peu sur vous..."
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="newsletter"
          checked={formData.newsletter}
          onChange={handleChange}
          className="w-4 h-4 text-navy rounded"
        />
        <span className="text-sm text-navy">Je souhaite recevoir les offres spéciales par email</span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 disabled:opacity-50"
      >
        {submitting ? 'Mise à jour...' : 'Enregistrer les modifications'}
      </button>
    </form>
  );
}
