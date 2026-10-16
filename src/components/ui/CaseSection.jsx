import CaseCard from './CaseCard';
import SectionTitle from './SectionTitle';

export default function CaseSection({ title, cases }) {
  return (
    <section className="section-case cont df">
      <SectionTitle>{title}</SectionTitle>
      <div className="all-case-cont mt df">
        {cases.map((item) => (
          <CaseCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}