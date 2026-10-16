// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import CaseSection from '../components/ui/CaseSection';
import { fetchCasesMock } from '../mocks/casesMock';

export default function HomePage() {
  const [cases, setCases] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    fetchCasesMock()
      .then((data) => {
        if (!isActive) return;
        setCases(data);
      })
      .catch(() => {
        if (!isActive) return;
        setError('Не удалось загрузить кейсы');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []); 
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        {isLoading && <p className="loading">Загрузка кейсов...</p>}
        {error && <p className="error">{error}</p>}
        {!isLoading && !error && cases && (
          <>
            <CaseSection title="Бонусные кейсы" cases={cases.bonusCases} />
            <CaseSection title="Звёздные поводы" cases={cases.starCases} />
            <CaseSection title="Праздничный дроп" cases={cases.holidayDrop} />
            <CaseSection title="Звёздные поводы" cases={cases.starOccasions} />
            <CaseSection title="TemkaStar Exclusive" cases={cases.exclusiveCases} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}