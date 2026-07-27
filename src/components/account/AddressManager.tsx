/**
 * AddressManager - Manage user shipping addresses
 */

'use client';

import { useEffect, useState } from 'react';
import type { UserAddress, AddressCreateRequest } from '@/lib/types/user';

export function AddressManager() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressCreateRequest>({
    type: 'home',
    first_name: '',
    last_name: '',
    street: '',
    city: '',
    postal_code: '',
    country: 'FR',
    is_default: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/user/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/user/addresses/${editingId}` : '/api/user/addresses';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          type: 'home',
          first_name: '',
          last_name: '',
          street: '',
          city: '',
          postal_code: '',
          country: 'FR',
          is_default: false,
        });
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse?')) return;

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleEdit = (address: UserAddress) => {
    setFormData({
      type: address.type,
      first_name: address.first_name,
      last_name: address.last_name,
      street: address.street,
      city: address.city,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone,
      is_default: address.is_default,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90"
        >
          + Ajouter une adresse
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Prénom"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Nom"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <input
            type="text"
            placeholder="Rue"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Ville"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Code postal"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Pays"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <input
            type="tel"
            placeholder="Téléphone (optionnel)"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_default || false}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Adresse par défaut</span>
          </label>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90">
              {editingId ? 'Modifier' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-gray-600">Aucune adresse sauvegardée</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
              <div>
                {address.is_default && <span className="text-xs font-semibold text-green-600 mb-2 block">ADRESSE PAR DÉFAUT</span>}
                <p className="font-semibold">
                  {address.first_name} {address.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {address.street}
                  <br />
                  {address.postal_code} {address.city}
                </p>
                {address.phone && <p className="text-sm text-gray-600 mt-1">{address.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="px-3 py-1 text-sm border border-navy text-navy rounded hover:bg-navy/5"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
