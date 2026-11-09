import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import '../admin.css';

const fmt = (n) => Number(n || 0).toLocaleString('ru-RU');

export default function AdminPage() {
  const { adminStats, promocodes, createPromocode } = useGame();
  const [name, setName] = useState('');
  const [bonus, setBonus] = useState('');
  const [flash, setFlash] = useState('');

  useEffect(() => { document.title = 'Админ-панель — TemkaStar'; }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!name || !bonus) return;
    createPromocode(name, Number(bonus));
    setName('');
    setBonus('');
    setFlash('Промокод успешно создан!');
    setTimeout(() => setFlash(''), 3000);
  };

  return (
    <div className="admin-page cont df">
      <section className="admin-section">
        <h1 className="admin-section-title">Ключевые показатели</h1>
        <div className="admin-stats-grid">
          <div className={`stat-card${adminStats.revenue < 0 ? ' stat-card--negative' : ''}`}>
            <h2>{fmt(adminStats.revenue)} ₽</h2>
            <p>Общая выручка</p>
            <p style={{ fontSize: '12px', color: 'var(--color-6)', marginTop: '-8px' }}>
              {fmt(adminStats.donations)} ₽ − {fmt(adminStats.payouts)} ₽
            </p>
          </div>
          <div className="stat-card"><h2>{fmt(adminStats.cases_opened)} шт</h2><p>Открыто кейсов</p></div>
          <div className="stat-card"><h2>{fmt(adminStats.upgrades)} шт</h2><p>Кол-во апгрейдов</p></div>
          <div className="stat-card"><h2>{fmt(adminStats.users)} чел.</h2><p>Пользователей</p></div>
          <div className="stat-card"><h2>{fmt(adminStats.withdrawals)}</h2><p>Выводов</p></div>
        </div>
      </section>

      <section className="admin-section">
        <h1 className="admin-section-title">Промокоды</h1>
        {flash && <div className="admin-flash">{flash}</div>}

        <div className="admin-promo-layout">
          <div className="promo-table-wrapper">
            <table className="promo-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th>Название</th>
                  <th className="col-bonus">Размер бонуса</th>
                </tr>
              </thead>
              <tbody>
                {promocodes.length > 0 ? promocodes.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.code}</td>
                    <td>{p.bonus_percent}%</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>Промокодов пока нет</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="promo-form-wrapper">
            <h3>Создать промокод</h3>
            <form onSubmit={submit} className="promo-form">
              <label>
                Название
                <input type="text" className="promo-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: TEMKA2026" />
              </label>
              <label>
                Размер бонуса
                <input type="number" className="promo-input" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="Например: 20" min="1" max="100" />
              </label>
              <button type="submit" className="btn-add-promo">Добавить</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}