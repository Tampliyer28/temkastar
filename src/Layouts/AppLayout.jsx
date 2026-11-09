import { Link, Outlet, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';

export default function AppLayout() {
  const location = useLocation();
  const url = location.pathname;
  const { user, balance } = useGame();

  const isActive = (path) => url === path ? 'active-link link df' : 'link df';
  const fmt = (n) => Number(n || 0).toLocaleString('ru-RU');

  return (
    <div className='app-wrapper df'>
      <header className="df">
        <div className="logo df">
          <img src="/images/ui/logo.png" alt="Logo" />
          <Link to="/" className='logo-text'>Temka<span className="blue">Star</span></Link>
        </div>

        <nav className="nav-header df">
          <Link to="/" className={isActive('/')}><img src="/images/ui/Layer_1.svg" alt="" />кейсы</Link>
          <Link to="/upgrade" className={isActive('/upgrade')}><img src="/images/ui/bust.svg" alt="" />АПГРЕЙД</Link>
          <Link to="/leaders" className={isActive('/leaders')}><img src="/images/ui/record.svg" alt="" />ЛИДЕРЫ</Link>
          <Link to="/about" className={isActive('/about')}><img src="/images/ui/fqa.png" alt="" />FAQ</Link>
          {user?.is_admin && (
            <Link to="/admin" className={isActive('/admin')}>
              <img src="/images/ui/record.svg" alt="" />АДМИНКА
            </Link>
          )}
        </nav>

        {user ? (
          <div className="inf-lk-cont df">
            <div className="many-cont df">
              <div className="df">
                <p className="many">{fmt(balance.coins)}</p>
                <img className="coin-img" src="/images/ui/coin.png" alt="COIN" />
              </div>
              <div className="df">
                <p className="many">{fmt(balance.rubles)}</p>
                <span className="rub">₽</span>
              </div>
              <Link to="/deposit" className="link-donate">+</Link>
            </div>
            <Link to="/cabinet" className="lk-link df">
              <img src="/images/ui/input.png" alt="" />{user.login}
            </Link>
          </div>
        ) : (
          <Link to="/login" className="lk-link df">
            <img src="/images/ui/input.png" alt="" />Авторизация
          </Link>
        )}
      </header>

      <main className="app-main"><Outlet /></main>

      <footer className="df">
        <div className="footer-col footer-col--about">
          <a href="#" className="footer-logo">
            <img src="/images/ui/logo.png" alt="TemkaStar" className="footer-logo__img" />
            <span className="footer-logo__text">TemkaStar</span>
          </a>
          <p className="footer-text">ООО «ТемкаСтар», ИНН 1234567890,<br />ОГРН 1234567890123<br />адрес: 656067, г. Барнаул, ул. Балтийская, д. 1</p>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Документы</h4>
          <ul className="footer-list">
            <li><a href="#" className="footer-link">Пользовательское соглашение</a></li>
            <li><a href="#" className="footer-link">Политика конфиденциальности</a></li>
            <li><a href="#" className="footer-link">Правила кейсов</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Контакты</h4>
          <a href="mailto:temkastore@mail.ru" className="footer-link">Email: temkastore@mail.ru</a>
        </div>
        <div className="footer-col footer-col--mascot">
          <img src="/images/cases/talisman_cat.png" alt="" className="footer-mascot" />
        </div>
      </footer>
    </div>
  );
}