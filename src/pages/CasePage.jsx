import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Roulette } from '@/components/ui/Roulette';
import { PrizeBox } from '@/components/ui/PrizeBox';
import { WinModal } from '@/components/ui/WinModal';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { useRoulette } from '@/hooks/useRoulette';
import { useGame } from '@/context/GameContext';
import { MOCK_GIFTS } from '@/mocks/giftsMock';
import { MOCK_CASE_REWARDS } from '@/mocks/caseRewardsMock';
import { bonusCases, starCases, holidayDrop, starOccasions, exclusiveCases } from '@/data/cases';

const ALL_CASES = [...bonusCases, ...starCases, ...holidayDrop, ...starOccasions, ...exclusiveCases];

export default function CasePage() {
  const { id } = useParams();
  const { levelUp, setLevelUp, sellFromInventory } = useGame();

  const caseData = useMemo(() => {
    const found = ALL_CASES.find(c => c.id === Number(id));
    return found
      ? { ...found, price: found.cost, currency_img: found.currency_id === 1 ? '/images/ui/rub.png' : '/images/ui/coin.png' }
      : { id: 1, name: 'Кейс', price: 100, currency_img: '/images/ui/coin.png' };
  }, [id]);

  const prizes = useMemo(() => {
    const rewards = MOCK_CASE_REWARDS[caseData.id] || [];
    return rewards
      .map(r => {
        const gift = MOCK_GIFTS.find(g => g.id === r.gift_id);
        return gift ? { ...gift, chance: r.chance } : null;
      })
      .filter(Boolean);
  }, [caseData.id]);

  useEffect(() => { document.title = `${caseData.name} — TemkaStar`; }, [caseData.name]);

  const {
    rouletteRefs, stripRefs, strips, count, setCount, spinning,
    winPrizes, modalOpen, openCase, closeModal, WIN_INDEX,
  } = useRoulette(caseData, prizes);

  const sorted = useMemo(() => [...prizes].sort((a, b) => a.chance - b.chance), [prizes]);

  if (prizes.length === 0) {
    return (
      <main className="cont case-page df">
        <section className="case-head df">
          <Link to="/" className="back-link">← Все кейсы</Link>
          <h1 className="case-title gradient-underline">{caseData.name}</h1>
        </section>
        <p style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Для этого кейса пока нет призов.</p>
      </main>
    );
  }

  return (
    <>
      <main className="cont case-page df">
        <section className="case-head df">
          <Link to="/" className="back-link">← Все кейсы</Link>
          <h1 className="case-title gradient-underline">{caseData.name}</h1>
        </section>

        <Roulette
          rouletteRefs={rouletteRefs}
          stripRefs={stripRefs}
          strips={strips}
          spinning={spinning}
          winIndex={WIN_INDEX}
          isWinIndexRevealed={modalOpen}
          price={caseData.price}
          count={count}
          onCountChange={setCount}
          onOpen={openCase}
          coinImg={caseData.currency_img}
        />

        <section className="section-case df">
          <h2 className="gradient-underline">Что внутри кейса</h2>
          <div className="all-case-cont df">
            {sorted.map((p) => <PrizeBox key={p.id} prize={p} />)}
          </div>
        </section>
      </main>

      <WinModal
        open={modalOpen}
        prizes={winPrizes}
        onClose={closeModal}
        onSellWon={(prizes) => {
          prizes.forEach((p) => sellFromInventory(p.id, 1));
          closeModal();
        }}
      />
      <LevelUpModal open={!!levelUp} level={levelUp?.new_level} onClose={() => setLevelUp(null)} />
    </>
  );
}