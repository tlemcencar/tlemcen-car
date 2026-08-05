import React, { useState } from 'react';
import { REVIEWS_DATA } from '../data/reviewsData';
import { Review } from '../types';
import { Star, CheckCircle, Plus, Sparkles, MessageSquare } from 'lucide-react';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    clientName: '',
    city: '',
    rating: 5,
    carRented: 'Mercedes-AMG G 63 V8',
    comment: '',
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Review = {
      id: `rev-${Date.now()}`,
      clientName: newReview.clientName,
      city: newReview.city || 'Tlemcen',
      rating: newReview.rating,
      date: 'Aujourd\'hui',
      carRented: newReview.carRented,
      comment: newReview.comment,
      verified: true,
    };

    setReviews([created, ...reviews]);
    setIsModalOpen(false);
    setNewReview({
      clientName: '',
      city: '',
      rating: 5,
      carRented: 'Mercedes-AMG G 63 V8',
      comment: '',
    });
  };

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(2);

  return (
    <div className="pt-28 pb-20 bg-[#07070a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff2e4d] px-3.5 py-1 rounded-full bg-[#ff2e4d]/10 border border-[#ff2e4d]/30 inline-block">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Retours d'Expérience VIP
            </span>
            <h1 className="text-4xl font-black text-white font-serif">
              Avis & Témoignages Clients
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              La satisfaction de nos clients est notre fierté absolue. Découvrez les avis authentiques de ceux qui nous ont fait confiance à Tlemcen.
            </p>
          </div>

          {/* Rating Badge & Add Review Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-[#14141c] p-4 rounded-2xl border border-white/10 text-center flex items-center space-x-3">
              <span className="text-3xl font-black text-amber-400 font-serif">{averageRating}</span>
              <div className="text-left text-xs">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-gray-400">{reviews.length} avis vérifiés</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-4 bg-[#ff2e4d] hover:bg-[#e60026] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,46,77,0.4)] transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Laisser un Avis</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#0e0e14] p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between hover:border-[#ff2e4d]/40 transition-all shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center">
                    {rev.clientName}
                    {rev.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-1.5" />
                    )}
                  </h3>
                  <span className="text-[11px] text-[#ff2e4d] block">{rev.carRented}</span>
                </div>
                <span className="text-[10px] bg-[#181822] text-gray-300 px-2.5 py-1 rounded-full border border-white/10 font-medium">
                  {rev.city}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#0e0e14] border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white border-l-2 border-[#ff2e4d] pl-3">
                Donner votre Avis sur Tlemcen Car
              </h3>

              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Votre Nom & Prénom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sofiane Rahal"
                    value={newReview.clientName}
                    onChange={(e) => setNewReview({ ...newReview, clientName: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Ville / Pays</label>
                  <input
                    type="text"
                    placeholder="Ex: Tlemcen / Oran / France"
                    value={newReview.city}
                    onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Véhicule Loué</label>
                  <input
                    type="text"
                    placeholder="Ex: Porsche 911 / Mercedes G63"
                    value={newReview.carRented}
                    onChange={(e) => setNewReview({ ...newReview, carRented: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Note (1 à 5 étoiles)</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                  >
                    <option value={5}>5 / 5 - Excellent</option>
                    <option value={4}>4 / 5 - Très bien</option>
                    <option value={3}>3 / 5 - Moyen</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Votre Commentaire</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Partagez votre expérience avec la voiture et le service..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-[#161620] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff2e4d]"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[#181822] text-gray-300 rounded-xl font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#ff2e4d] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,46,77,0.4)]"
                  >
                    Publier l'Avis
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
