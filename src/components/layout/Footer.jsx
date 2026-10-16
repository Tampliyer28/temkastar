export default function Footer() {
  return (
    <footer className="df">
      <div className="footer-col footer-col--about">
        <a href="#" className="footer-logo">
          <img src="/images/ui/logo.png" alt="TemkaStar" className="footer-logo__img" />
          <span className="footer-logo__text">TemkaStar</span>
        </a>
        <p className="footer-text">
          ООО «ТемкаСтар», ИНН 1234567890,<br />
          ОГРН 1234567890123 Юридический<br />
          адрес: 656067, г. Барнаул, ул.<br />
          Балтийская, д. 1, офис 1
        </p>
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
        <a href="mailto:temkastore@mail.ru" className="footer-link">
          Email: temkastore@mail.ru
        </a>
      </div>

      <div className="footer-col footer-col--mascot">
        <img src="/images/cases/talisman_cat.png" alt="" className="footer-mascot" />
      </div>
    </footer>
  );
}