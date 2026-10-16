export default function CaseCard({ name, cost, img }) {
  return (
    <a href="" className="case-box df">
      <img className="img-case" src={img} alt={name} />
      <span className="name-case">{name}</span>
      <span className="cost-case df">
        {cost}
        <img className="count-img" src="/images/ui/coin.png" alt="" />
      </span>
    </a>
  );
}