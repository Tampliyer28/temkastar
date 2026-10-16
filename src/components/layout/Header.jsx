import { navLinks } from '../../data/cases';

export default function Header() {
  return (
    <header className="df">
      <div className="logo df">
        <img src="/images/ui/logo.png" alt="Logo" />
        <p className="logo-text">
          Temka<span className="blue">Star</span>
        </p>
      </div>

      <nav className="nav-header df">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href=""
            className={`df ${link.active ? 'active-link' : ''}`}
          >
            <img src={link.icon} alt="" />
            {link.label}
          </a>
        ))}
      </nav>

      <a href="" className="lk-link df">
        <img src="/images/ui/input.png" alt="" />
        Авторизация
      </a>
    </header>
  );
}