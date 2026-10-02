import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Article, Author } from '../../types';
import { AuthorsService } from '../../services/supabase/authorsService';
import { ArticlesService } from '../../services/supabase/articlesService';
import { BUNDLED_IMAGES } from '../../assets/bundledImages';

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
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!isOpen || !authorId) {
      setAuthor(null);
      setArticles([]);
      return;
    }

    AuthorsService.getAuthorById(authorId).then((res) => {
      setAuthor(res);
    });

    ArticlesService.getAuthorArticles(authorId).then((list) => {
      setArticles(list);
    });
  }, [isOpen, authorId]);

  if (!isOpen || !authorId || !author) return null;

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
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = BUNDLED_IMAGES.authorNurcholish;
                }}
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

        {/* Bio & Details */}
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#667085] mb-2">
              Tentang Penulis
            </h4>
            <p className="text-sm text-[#0B1F33] leading-relaxed">
              {author.bio}
            </p>
          </div>

          {/* Written Articles */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[#B59A5A]" />
              <h4 className="text-sm font-bold text-[#0B1F33]">
                Artikel Ditulis ({articles.length})
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
                  className="p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0B1F33]/40 bg-white hover:bg-[#F5F6F7]/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="pr-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
                      {art.category}
                    </span>
                    <h5 className="text-sm font-bold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors leading-snug">
                      {art.title}
                    </h5>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#0B1F33] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
