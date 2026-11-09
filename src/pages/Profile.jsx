import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { WithdrawModal } from '@/components/ui/WithdrawModal';
import { SellModal } from '@/components/ui/SellModal';
import { WithdrawAllModal } from '@/components/ui/WithdrawAllModal';

const fmt = (n) => Number(n || 0).toLocaleString('ru-RU');

export default function ProfilePage() {
  const {
    user, balance, inventory, stats, level,
    sellFromInventory, sellAllInventory,
    withdrawFromInventory, withdrawAllInventory,
    logout,
  } = useGame();
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState('');
  const [sellingAll, setSellingAll] = useState(false);
  const [withdrawGift, setWithdrawGift] = useState(null);
  const [sellGift, setSellGift] = useState(null);
  const [isWithdrawAllOpen, setIsWithdrawAllOpen] = useState(false);

  useEffect(() => { document.title = 'Личный кабинет — TemkaStar'; }, []);

  if (!user) return null; 

  const sortedInventory = [...inventory].sort((a, b) => {
    if (sortOrder === 'price_desc') return b.price - a.price;
    if (sortOrder === 'price_asc') return a.price - b.price;
    if (sortOrder === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const totalSellPrice = inventory.reduce((s, i) => s + i.price * i.count, 0);
  const totalItems = inventory.reduce((s, i) => s + i.count, 0);

  const handleSellAll = () => {
    if (!confirm(`Продать всё за ${fmt(totalSellPrice)} ₽?`)) return;
    setSellingAll(true);
    setTimeout(() => { sellAllInventory(); setSellingAll(false); }, 300);
  };

  const handleSell = (giftId, count) => { sellFromInventory(giftId, count); };
  const handleWithdraw = (giftId, count, recipient) => {
    withdrawFromInventory(giftId, count);
    alert(`Выведено ${count} шт. для ${recipient}`);
  };
  const handleWithdrawAll = (recipient) => {
    withdrawAllInventory();
    alert(`Все подарки выведены для ${recipient}`);
  };
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <main className="cont df" style={{ flexDirection: 'column', paddingTop: '40px' }}>
        <section className="lk-sats cont mt df">
          <div className="left-box-lk df">
            <div className="photo-ava df">{user.login.charAt(0).toUpperCase()}</div>
            <div className="info-lk df">
              <h1>{user.login}</h1>
              <p><span className="title-lk">Регистрация: </span>{user.registered_at}</p>
              <p><span className="title-lk">TG: </span>{user.telegram || 'Не указан'}</p>
              <span className="lvl-text">Уровень {level}</span>
            </div>
          </div>
          <div className="right-box-lk df">
            <h2>Баланс</h2>
            <div className="many-cont2 df">
              <div className="df"><p className="many">{fmt(balance.coins)}</p><img className="coin-img" src="/images/ui/coin.png" alt="COIN" /></div>
              <div className="df"><p className="many">{fmt(balance.rubles)}</p><span className="rub">₽</span></div>
            </div>
            <div className="btn-cont df">
              <Link to="/deposit" className="link-profile">Пополнить</Link>
              <Link to="/" className="link-profile">Кейсы</Link>
            </div>
            <button type="button" className="btn-logout" onClick={handleLogout}>Выйти</button>
          </div>
        </section>

        <section className="section-case cont df">
          <h2 className="gradient-underline">статистика</h2>
          <div className="all-case-cont mt df">
            <div className="box-stat df"><h2>{fmt(stats.cases)}</h2><p>Открытых кейсов</p></div>
            <div className="box-stat df"><h2>{fmt(stats.upgrades)}</h2><p>Апгрейдов</p></div>
            <div className="box-stat df"><h2>{fmt(totalItems)}</h2><p>NFT в инвентаре</p></div>
            <div className="box-stat df"><h2>{fmt(stats.withdrawals_sum)} ₽</h2><p>Сумма выводов</p></div>
          </div>
        </section>

        <section className="section-case cont df w100">
          <h2 className="gradient-underline">инвентарь</h2>
          <div className="df" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <form className="sort-inv" onSubmit={(e) => e.preventDefault()} style={{ margin: 0 }}>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ width: '100%', minWidth: '200px' }}>
                <option value="">Без сортировки</option>
                <option value="price_desc">Сначала дорогие</option>
                <option value="price_asc">Сначала дешевые</option>
                <option value="name">По названию (А-Я)</option>
              </select>
            </form>
            {inventory.length > 0 && (
              <div className="df" style={{ gap: '10px', flexWrap: 'wrap' }}>
                <button className="btn-open" onClick={handleSellAll} disabled={sellingAll} style={{ padding: '10px 20px', fontSize: '16px' }}>
                  {sellingAll ? 'Продажа...' : `Продать всё за ${fmt(totalSellPrice)} ₽`}
                </button>
                <button className="btn-open" onClick={() => setIsWithdrawAllOpen(true)} style={{ padding: '10px 20px', fontSize: '16px', background: 'var(--color-9)', borderColor: 'var(--color-9)' }}>
                  Вывести всё
                </button>
              </div>
            )}
          </div>

          <div className="all-case-cont mt df">
            {sortedInventory.length > 0 ? (
              sortedInventory.map((gift) => (
                <div key={gift.id} className="box-gift-inv df" style={{ position: 'relative' }}>
                  <p className="name-gift">{gift.name}</p>
                  <img src={gift.img} alt={gift.name} className="img-gift-inv" />
                  {gift.count > 1 && <span style={{ position: 'absolute', top: 5, right: 5, background: '#3292FF', color: '#fff', padding: '2px 8px', borderRadius: 5, fontSize: 14, fontWeight: 'bold', zIndex: 10 }}>x{gift.count}</span>}
                  <p className="price-inv">{fmt(gift.price)} <span className="rub">₽</span></p>
                  <div className="btn-cont-inv df">
                    <button className="sell-btn" onClick={() => setSellGift(gift)}>Продать</button>
                    <button className="export-btn" onClick={() => setWithdrawGift(gift)}>Вывести</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--color-6)', textAlign: 'center', width: '100%' }}>У вас пока нет подарков в инвентаре.</p>
            )}
          </div>
        </section>
      </main>

      <WithdrawModal open={!!withdrawGift} gift={withdrawGift} onClose={() => setWithdrawGift(null)} onWithdraw={handleWithdraw} />
      <SellModal open={!!sellGift} gift={sellGift} onClose={() => setSellGift(null)} onSell={handleSell} />
      <WithdrawAllModal open={isWithdrawAllOpen} onClose={() => setIsWithdrawAllOpen(false)} totalPrice={totalSellPrice} onWithdrawAll={handleWithdrawAll} />
    </>
  );
}