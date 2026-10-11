import React, { useState, useEffect } from 'react';
import { Article, Language } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GrowthMoment } from './components/GrowthMoment';
import { SymptomsSection } from './components/SymptomsSection';
import { Philosophy } from './components/Philosophy';
import { TransformationJourney } from './components/TransformationJourney';
import { Methodology } from './components/Methodology';
import { Services } from './components/Services';
import { Industries } from './components/Industries';
import { CaseStudy } from './components/CaseStudy';
import { InsightsSection } from './components/Insights/InsightsSection';
import { DiagnosticTool } from './components/DiagnosticTool';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { ArticleModal } from './components/Insights/ArticleModal';
import { AuthorModal } from './components/Insights/AuthorModal';
import { AdminCmsModal } from './components/Insights/AdminCmsModal';
import { AdminPortal } from './components/Admin/AdminPortal';
import { ArticleDetailPage } from './components/Insights/ArticleDetailPage';
import { InsightsListingPage } from './components/Insights/InsightsListingPage';
import { AuthorArchivePage } from './components/Insights/AuthorArchivePage';

export default function App() {
  const [lang, setLang] = useState<Language>('id');
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smooth scroll to anchor if present in URL
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [currentPath]);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      // Support anchor navigation e.g. /#insights
      if (path.startsWith('/#')) {
        const hash = path.substring(1);
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
        const id = hash.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo(0, 0);
          }
        }, 50);
        return;
      }

      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Modals state
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);

  const handleOpenConsultation = () => {
    setIsConsultModalOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultModalOpen(false);
  };

  const handleSelectArticle = (article: Article) => {
    if (currentPath === '/admin') {
      // CMS admin preview in modal
      setSelectedArticle(article);
    } else {
      // Dedicated Article Detail Page per Requirement #3
      navigateTo(`/insights/${article.slug}`);
    }
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  const handleSelectAuthor = (authorId: string) => {
    navigateTo(`/authors/${authorId}`);
  };

  const handleCloseAuthor = () => {
    setSelectedAuthorId(null);
  };

  const handleOpenCms = () => {
    navigateTo('/admin');
  };

  const handleCloseCms = () => {
    setIsCmsModalOpen(false);
    if (currentPath === '/admin' || currentPath === '/admin/') {
      navigateTo('/');
    }
  };

  // Route 1: /admin -> render secure Admin Portal
  if (currentPath === '/admin' || currentPath === '/admin/') {
    return (
      <>
        <AdminPortal
          onBackToWebsite={() => navigateTo('/')}
          onPreviewArticle={handleSelectArticle}
        />
        {/* Editorial Article Reader Modal for previewing draft/published articles from CMS */}
        <ArticleModal
          article={selectedArticle}
          isOpen={Boolean(selectedArticle)}
          onClose={handleCloseArticle}
          lang={lang}
          onOpenConsultation={handleOpenConsultation}
          onSelectArticle={handleSelectArticle}
          onSelectAuthor={handleSelectAuthor}
        />
      </>
    );
  }

  // Route 2: /insights -> Dedicated Insights Listing Page per Requirement #3
  if (currentPath === '/insights' || currentPath === '/insights/') {
    return (
      <InsightsListingPage
        lang={lang}
        onLanguageChange={setLang}
        onNavigate={navigateTo}
        onOpenCms={handleOpenCms}
      />
    );
  }

  // Route 3: /insights/:slug -> dedicated full Article Detail Page per Requirement #4
  const insightsMatch = currentPath.match(/^\/insights\/([a-zA-Z0-9_-]+)\/?$/);
  const articleSlug = insightsMatch ? insightsMatch[1] : null;

  if (articleSlug && articleSlug !== 'insights') {
    return (
      <ArticleDetailPage
        slug={articleSlug}
        lang={lang}
        onLanguageChange={setLang}
        onNavigate={navigateTo}
        onOpenCms={handleOpenCms}
      />
    );
  }

  // Route 4: /authors/:slug -> dedicated Author Archive Page per Requirement #5
  const authorMatch = currentPath.match(/^\/authors\/([a-zA-Z0-9_-]+)\/?$/);
  const authorSlug = authorMatch ? authorMatch[1] : null;

  if (authorSlug) {
    return (
      <AuthorArchivePage
        slug={authorSlug}
        lang={lang}
        onLanguageChange={setLang}
        onNavigate={navigateTo}
        onOpenCms={handleOpenCms}
      />
    );
  }

  // Route 5: Homepage
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0B1F33]">
      {/* Top Bar with Official ARUNA Logo */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        onOpenConsultation={handleOpenConsultation}
        onOpenCms={handleOpenCms}
        onNavigate={navigateTo}
      />

      {/* Main Narrative Sequence */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <Hero lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 2: The Growth Moment (1 Outlet -> 2 Outlets -> Multi-Outlet) */}
        <GrowthMoment lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 3: Recognition / Symptoms */}
        <SymptomsSection lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 4: The ARUNA Point of View */}
        <Philosophy lang={lang} />

        {/* Section 5: The Four ARUNA Principles */}
        <TransformationJourney lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 6: How ARUNA Works */}
        <Methodology lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 7: Services */}
        <Services lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 8: Industries */}
        <Industries lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 9: Case Studies / Proof */}
        <CaseStudy lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 10: Insights (Refined with dedicated article detail routing) */}
        <InsightsSection
          lang={lang}
          onSelectArticle={handleSelectArticle}
          onSelectAuthor={handleSelectAuthor}
          onOpenConsultation={handleOpenConsultation}
          onOpenCms={handleOpenCms}
        />

        {/* Section 11: Self-Diagnostic */}
        <DiagnosticTool lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 12: Final CTA */}
        <CtaSection lang={lang} onOpenConsultation={handleOpenConsultation} />
      </main>

      {/* Footer with Official Contact Info & Instagram */}
      <Footer
        lang={lang}
        onOpenConsultation={handleOpenConsultation}
        onOpenCms={handleOpenCms}
      />

      {/* Consultation Booking & Inquiry Modal */}
      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={handleCloseConsultation}
        lang={lang}
      />

      {/* Author Profile Modal */}
      <AuthorModal
        authorId={selectedAuthorId}
        isOpen={Boolean(selectedAuthorId)}
        onClose={handleCloseAuthor}
        onSelectArticle={handleSelectArticle}
      />

      {/* Editorial Content Management System (CMS) Modal */}
      <AdminCmsModal
        isOpen={isCmsModalOpen}
        onClose={handleCloseCms}
        onPreviewArticle={handleSelectArticle}
      />
    </div>
  );
}
