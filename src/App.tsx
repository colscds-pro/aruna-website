import React, { useState } from 'react';
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

export default function App() {
  const [lang, setLang] = useState<Language>('id');

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
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  const handleSelectAuthor = (authorId: string) => {
    setSelectedAuthorId(authorId);
  };

  const handleCloseAuthor = () => {
    setSelectedAuthorId(null);
  };

  const handleOpenCms = () => {
    setIsCmsModalOpen(true);
  };

  const handleCloseCms = () => {
    setIsCmsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0B1F33]">
      {/* Top Bar with Official ARUNA Logo */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        onOpenConsultation={handleOpenConsultation}
        onOpenCms={handleOpenCms}
      />

      {/* Main Narrative Sequence per Prompt #4 */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <Hero lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 2: The Growth Moment (1 Outlet -> 2 Outlets -> Multi-Outlet) */}
        <GrowthMoment lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 3: Recognition / Symptoms (Apakah bisnis Anda mulai terasa sulit dikontrol?) */}
        <SymptomsSection lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 4: The ARUNA Point of View (We start with the business. Not the software.) */}
        <Philosophy lang={lang} />

        {/* Section 5: The Four ARUNA Principles (Clarity -> Structure -> Control -> Growth) */}
        <TransformationJourney lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 6: How ARUNA Works (Operational Flow: Discover -> Go Live) */}
        <Methodology lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 7: Services (ERP Implementation, Odoo Migration, Business Process Advisory) */}
        <Services lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 8: Industries (Retail, F&B, Hospitality) */}
        <Industries lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 9: Case Studies / Proof (Real unhyped ongoing retail case) */}
        <CaseStudy lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 10: Insights (Highlighted editorial thought leadership) */}
        <InsightsSection
          lang={lang}
          onSelectArticle={handleSelectArticle}
          onSelectAuthor={handleSelectAuthor}
          onOpenConsultation={handleOpenConsultation}
          onOpenCms={handleOpenCms}
        />

        {/* Section 11: Self-Diagnostic (Apakah bisnis Anda sudah siap untuk berkembang?) */}
        <DiagnosticTool lang={lang} onOpenConsultation={handleOpenConsultation} />

        {/* Section 12: Final CTA (Siap memahami bisnis Anda lebih jelas?) */}
        <CtaSection lang={lang} onOpenConsultation={handleOpenConsultation} />
      </main>

      {/* Footer with Official ARUNA Logo */}
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

      {/* Editorial Article Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={Boolean(selectedArticle)}
        onClose={handleCloseArticle}
        lang={lang}
        onOpenConsultation={handleOpenConsultation}
        onSelectArticle={handleSelectArticle}
        onSelectAuthor={handleSelectAuthor}
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
