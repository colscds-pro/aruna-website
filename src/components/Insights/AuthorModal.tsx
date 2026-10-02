import React from 'react';
import { X, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Article, Author } from '../../types';
import { InsightsService } from '../../services/insightsStorage';

interface AuthorModalProps {
  authorId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export const AuthorModal: React.FC<AuthorModalProps> = ({
  authorId,
  isOpen,
  onClose,
  onSelectArticle,
}) => {
  if (!isOpen || !authorId) return null;

  const author = InsightsService.getAuthorById(authorId);
  if (!author) return null;

  const articles = InsightsService.getAuthorArticles(authorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-[#F5F6F7] border-b border-[#E5E7EB] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#0B1F33] shrink-0 border-2 border-[#E5E7EB]">
              <img
                src={author.photoUrl}
                alt={author.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-0.5">
                Profil Penulis
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
                {author.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] font-medium">
                {author.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#0B1F33] hover:bg-[#E5E7EB] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bio */}
        <div className="p-6 sm:p-8 border-b border-[#E5E7EB] bg-white">
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            {author.bio}
          </p>
        </div>

        {/* Articles List */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#B59A5A]" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0B1F33]">
              Artikel Oleh {author.name} ({articles.length})
            </h4>
          </div>

          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  onClose();
                  onSelectArticle(art);
                }}
                className="p-4 rounded-lg bg-[#F5F6F7] border border-[#E5E7EB] hover:border-[#0B1F33]/40 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#B59A5A] font-bold uppercase tracking-wider mb-1">
                    <span>{art.category}</span>
                    <span>·</span>
                    <span>{art.publishedAt}</span>
                    <span>·</span>
                    <span>{art.readingTime} min</span>
                  </div>
                  <h5 className="text-sm font-bold text-[#0B1F33] mb-1 leading-snug">
                    {art.title}
                  </h5>
                  <p className="text-xs text-[#667085] line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-semibold text-[#0B1F33]">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B59A5A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
