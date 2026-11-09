import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';

const fmt = (n) => Number(n || 0).toLocaleString('ru-RU');

const MOCK_LEADERS = {
  cases: [
    { id: 1, login: 'CaseMaster', value: 1250, extra: 'Уровень 10' },
    { id: 2, login: 'LuckyStar', value: 980, extra: 'Уровень 8' },
    { id: 3, login: 'PepeKing', value: 850, extra: 'Уровень 7' },
    { id: 4, login: 'NeoN', value: 600, extra: 'Уровень 5' },
    { id: 5, login: 'Drake', value: 450, extra: 'Уровень 4' },
  ],
  upgrades: [
    { id: 1, login: 'UpgradeGod', value: 540, extra: 'Уровень 15' },
    { id: 2, login: 'LuckyStar', value: 320, extra: 'Уровень 8' },
    { id: 3, login: 'NeoN', value: 210, extra: 'Уровень 5' },
    { id: 4, login: 'Drake', value: 150, extra: 'Уровень 4' },
    { id: 5, login: 'CaseMaster', value: 120, extra: 'Уровень 10' },
  ],
  inventory: [
    { id: 1, login: 'NFTKing', value: 1250, extra: 'Уровень 20' },
    { id: 2, login: 'LuckyStar', value: 890, extra: 'Уровень 8' },
    { id: 3, login: 'PepeKing', value: 640, extra: 'Уровень 7' },
    { id: 4, login: 'CaseMaster', value: 500, extra: 'Уровень 10' },
    { id: 5, login: 'Drake', value: 300, extra: 'Уровень 4' },
  ],
  inventoryValue: [
    { id: 1, login: 'NFTKing', value: 2500000, extra: 'Уровень 20' },
    { id: 2, login: 'LuckyStar', value: 1250000, extra: 'Уровень 8' },
    { id: 3, login: 'PepeKing', value: 850000, extra: 'Уровень 7' },
    { id: 4, login: 'CaseMaster', value: 450000, extra: 'Уровень 10' },
    { id: 5, login: 'Drake', value: 200000, extra: 'Уровень 4' },
  ],
  withdrawals: [
    { id: 1, login: 'BigWinner', value: 5000000, extra: 'Уровень 25' },
    { id: 2, login: 'LuckyStar', value: 2500000, extra: 'Уровень 8' },
    { id: 3, login: 'PepeKing', value: 1200000, extra: 'Уровень 7' },
    { id: 4, login: 'CaseMaster', value: 800000, extra: 'Уровень 10' },
    { id: 5, login: 'Drake', value: 500000, extra: 'Уровень 4' },
  ],
};

const TABS = [
  { key: 'cases', label: 'Открыто кейсов', icon: '🎁', suffix: ' шт' },
  { key: 'upgrades', label: 'Апгрейдов', icon: '🚀', suffix: ' шт' },
  { key: 'inventory', label: 'NFT в инвентаре', icon: '💎', suffix: ' шт' },
  { key: 'inventoryValue', label: 'Ценность инвентаря', icon: '💰', suffix: ' ₽' },
  { key: 'withdrawals', label: 'Сумма выводов', icon: '💳', suffix: ' ₽' },
];

export default function LeadersPage() {
  const { user, level, stats, inventory } = useGame();
  const [activeTab, setActiveTab] = useState('cases');
  useEffect(() => { document.title = 'Лидеры — TemkaStar'; }, []);

  const activeTabConfig = TABS.find(t => t.key === activeTab);

  // Формируем «меня» из реальных данных
  const myValue = {
    cases: stats.cases,
    upgrades: stats.upgrades,
    inventory: inventory.reduce((s, i) => s + i.count, 0),
    inventoryValue: inventory.reduce((s, i) => s + i.price * i.count, 0),
    withdrawals: stats.withdrawals_sum,
  }[activeTab] || 0;

  const myEntry = { id: 'me', login: user.login, value: myValue, extra: `Уровень ${level}` };
  const base = MOCK_LEADERS[activeTab] || [];
  const currentData = [...base, myEntry].sort((a, b) => b.value - a.value);
  const myIndex = currentData.findIndex(u => u.id === 'me');
  const isUserInTop = myIndex < 10;

  return (
    <main className="cont df leaders-page">
      <h1 className="gradient-underline leaders-title">Зал Славы</h1>

      <div className="leaders-tabs df">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`leaders-tab-btn ${activeTab === tab.key ? 'active' : ''}`}>
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <div className="podium-container df">
        {[1, 0, 2].map((index) => {
          const u = currentData[index];
          if (!u) return null;
          const place = index + 1;
          const isMe = u.id === 'me';
          return (
            <div key={u.id} className={`podium-item df place-${place} ${isMe ? 'is-me' : ''}`}>
              <div className={`photo-ava df podium-avatar place-${place} ${isMe ? 'is-me' : ''}`}>{u.login.charAt(0).toUpperCase()}</div>
              <span className="podium-name">{u.login}</span>
              <span className={`podium-value place-${place}`}>{fmt(u.value)}{activeTabConfig.suffix}</span>
              <div className={`podium-pedestal place-${place}`}>{place}</div>
            </div>
          );
        })}
      </div>

      <div className="leaders-table-wrapper">
        <div className="df leaders-table-header">
          <div style={{ width: '80px', textAlign: 'center' }}>Место</div>
          <div style={{ flex: 1, paddingLeft: '20px' }}>Игрок</div>
          <div style={{ width: '200px', textAlign: 'right' }}>Результат</div>
          <div style={{ width: '200px', textAlign: 'right' }}>Доп. инфо</div>
        </div>
        {currentData.slice(3).map((u, idx) => {
          const isMe = u.id === 'me';
          return (
            <div key={u.id} className={`df leaders-row ${isMe ? 'is-me' : ''}`}>
              <div className="leaders-col-place">#{idx + 4}</div>
              <div className="leaders-col-user">
                <div className="leaders-avatar">{u.login.charAt(0).toUpperCase()}</div>
                <span className="leaders-name">{u.login}{isMe && <span className="leaders-me-badge">(Вы)</span>}</span>
              </div>
              <div className="leaders-col-val">{fmt(u.value)}{activeTabConfig.suffix}</div>
              <div className="leaders-col-extra">{u.extra}</div>
            </div>
          );
        })}
      </div>

      {!isUserInTop && (
        <div className="my-rank-wrapper">
          <div className="my-rank-title">Ваше место в этом рейтинге</div>
          <div className="leaders-table-wrapper my-rank-box">
            <div className="df">
              <div className="my-rank-place">#{myIndex + 1}</div>
              <div className="leaders-col-user">
                <div className="my-rank-avatar">{user.login.charAt(0).toUpperCase()}</div>
                <span className="my-rank-name">{user.login} <span style={{ color: 'var(--color-4)', fontSize: 14, marginLeft: 10 }}>(Вы)</span></span>
              </div>
              <div className="my-rank-val">{fmt(myValue)}{activeTabConfig.suffix}</div>
              <div className="my-rank-extra">{myEntry.extra}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}