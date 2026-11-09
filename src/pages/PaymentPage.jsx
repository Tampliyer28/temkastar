import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';

export default function PaymentPage() {
  const { deposit } = useGame();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promo, setPromo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { document.title = 'Пополнение — TemkaStar'; }, []);

  const submit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (num < 50) return alert('Минимальная сумма — 50 ₽');
    if (num > 100000000) return alert('Максимальная сумма — 100 000 000 ₽');

    setLoading(true);
    setTimeout(() => {
      const result = deposit(num, promo);

      if (promo.trim() && result.bonus > 0) {
        setSuccess(
          `Баланс пополнен на ${num} ₽ + бонус ${Math.round(result.bonus)} ₽ (промокод ${result.code}).`
        );
      } else if (promo.trim() && result.bonus === 0) {
        setSuccess(
          `Баланс пополнен на ${num} ₽. Промокод «${promo.trim()}» не найден или неактивен.`
        );
      } else {
        setSuccess(`Баланс пополнен на ${num} ₽.`);
      }

      setAmount('');
      setPromo('');
      setLoading(false);
      setTimeout(() => setSuccess(''), 5000);
    }, 500);
  };

  const isBonus = success.includes('бонус');

  return (
    <div className="cont df" style={{ justifyContent: 'center', paddingTop: '50px' }}>
      <form className="form df" onSubmit={submit}>
        <h2>Пополнение баланса</h2>

        {success && (
          <div
            style={{
              fontFamily: 'Montserrat',
              padding: '15px',
              background: isBonus ? '#1e4620' : '#46201e',
              color: isBonus ? '#4caf50' : '#ff8a80',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {success}
          </div>
        )}

        <label className="df">
          Выберите способ оплаты
          <select className="inp-form" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="card">Банковская карта РФ</option>
          </select>
        </label>

        <label className="df">
          Сумма (₽)
          <input className="inp-form" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="мин. 50" min="50" max="100000000" />
        </label>

        <label className="df">
          Промокод
          <input className="inp-form" type="text" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Введите промокод (если есть)" />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Обработка...' : 'Пополнить счет'}
        </button>
      </form>
    </div>
  );
}