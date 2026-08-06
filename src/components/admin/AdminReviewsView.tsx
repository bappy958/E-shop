import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, ShieldCheck } from 'lucide-react';
import { Review } from '../../types';

interface AdminReviewsViewProps {
  reviews: Review[];
  showToast: (titleBn: string, titleEn: string) => void;
  onRefreshReviews: () => void;
}

export const AdminReviewsView: React.FC<AdminReviewsViewProps> = ({
  reviews,
  showToast,
  onRefreshReviews,
}) => {
  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          status === 'approved' ? 'রিভিউটি অনুমোদন দেওয়া হয়েছে!' : 'রিভিউটি রিজেক্ট করা হয়েছে!',
          status === 'approved' ? 'Review approved!' : 'Review rejected!'
        );
        onRefreshReviews();
      }
    } catch (err) {
      alert('মডারেশন করা সম্ভব হয়নি।');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('আপনি কি এই রিভিউটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('রিভিউ মুছে ফেলা হয়েছে!', 'Review deleted!');
        onRefreshReviews();
      }
    } catch (err) {
      alert('রিভিউ ডিলেট করা যায়নি।');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="text-[#D4AF37]" size={22} />
          <span>রিভিউ মডারেশন (Customer Reviews Moderation)</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">কাস্টমারদের দেওয়া রেটিং ও ফিডব্যাক প্যানেল</p>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">{rev.userName}</span>
                {rev.verifiedPurchase && (
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Verified Purchase</span>
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}
                  />
                ))}
              </div>

              <p className="text-xs text-zinc-300 italic">"{rev.commentBn || rev.commentEn}"</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2.5 py-1 rounded text-[10px] font-bold capitalize ${
                  rev.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : rev.status === 'rejected'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {rev.status || 'Approved'}
              </span>

              <button
                onClick={() => handleModerate(rev.id, 'approved')}
                title="Approve Review"
                className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs"
              >
                <CheckCircle size={16} />
              </button>

              <button
                onClick={() => handleModerate(rev.id, 'rejected')}
                title="Reject Review"
                className="p-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-xs"
              >
                <XCircle size={16} />
              </button>

              <button
                onClick={() => handleDelete(rev.id)}
                title="Delete Review"
                className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
