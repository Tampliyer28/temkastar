import { Link } from 'react-router-dom';

export default function CaseCard({ id, name, cost, currency_id, img }) {
  const currencyImg = currency_id === 1 
    ? '/images/ui/rub.png'  // Рубли
    : '/images/ui/coin.png'; // Лапки 

  return (
    <Link to={`/case/${id}`} className="case-box df">
      <img className="img-case" src={img} alt={name} />
      <span className="name-case">{name}</span>
      <span className="cost-case df">
        {cost}
        <img className="count-img" src={currencyImg} alt="" />
      </span>
    </Link>
  );
}