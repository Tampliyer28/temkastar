export default function HeroSection() {
  return (
    <section className="cont banners-cont df mt">
      <div className="left-banner df">
        <div className="text-banner df">
          <h1>TemkaStar — твой звездный час.</h1>
          <p className="big-banner">
            Честные шансы, моментальный вывод, никакого скама. Крути спокойно.
          </p>
        </div>
        <a href="" className="link-banner df">
          Кртутить<img src="/images/ui/rulet.png" alt="" />
        </a>
      </div>

      <div className="right-banners df">
        <div className="small-banner df">
          <div className="text-btn-small df">
            <div className="text-small df">
              <h3>Бонус к пополнению</h3>
              <p>Промокод на 11% при пополнении баланса</p>
            </div>
            <a href="" className="link-ban2">TOPDROP11</a>
          </div>
          <img className="img-banner2" src="/images/ui/banner2.png" alt="" />
        </div>

        <div className="small-banner df">
          <div className="text-btn-small df">
            <div className="text-small df">
              <h3>Заходи и забирай!</h3>
              <p>Ежедневные промокоды уже ждут тебя в наших соц. сетях</p>
            </div>
            <a href="" className="link-banner df">
              Забрать<img src="/images/ui/link.png" alt="" />
            </a>
          </div>
          <img className="img-banner3" src="/images/ui/banner3.png" alt="" />
        </div>
      </div>
    </section>
  );
}