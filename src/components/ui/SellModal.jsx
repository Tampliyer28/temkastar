import { useState, useEffect } from 'react';

const fmt = (n) => Number(n || 0).toLocaleString('ru-RU');

export function SellModal({ open, gift, onClose, onSell }) {
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setCount(1);
        setLoading(false);
    }, [open, gift?.id]);

    if (!open || !gift) return null;

    const totalPrice = gift.price * count;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (count < 1 || count > gift.count) return alert('Неверное количество');

        setLoading(true);
        // Имитация запроса
        setTimeout(() => {
            if (onSell) onSell(gift.id, count);
            setLoading(false);
            onClose();
        }, 300);
    };

    return (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-box df" style={{ maxWidth: '400px' }}>
                <h2>Продажа подарка</h2>
                
                <div className="df" style={{ alignItems: 'center', gap: '15px', marginBottom: '15px', width: '100%', justifyContent: 'center' }}>
                    <img src={gift.img} alt="" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    <div style={{ textAlign: 'left' }}>
                        <p className="name-gift" style={{ fontSize: '18px' }}>{gift.name}</p>
                        <p className="price-inv">{fmt(gift.price)} ₽ / шт</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label className="df" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="title-lk" style={{ marginBottom: '5px' }}>Количество (макс. {gift.count})</span>
                        <input
                            className="inp-form"
                            type="number"
                            min="1"
                            max={gift.count}
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </label>

                    <div className="df" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(50, 146, 255, 0.1)', borderRadius: '10px', border: '1px solid var(--color-4)' }}>
                        <span className="title-lk" style={{ color: 'var(--color-2)' }}>Вы получите:</span>
                        <span className="price-inv" style={{ fontSize: '20px', fontWeight: 'bold' }}>{fmt(totalPrice)} ₽</span>
                    </div>

                    <div className="df" style={{ gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="sell-btn" style={{ flex: 1, borderRadius: '10px', padding: '12px' }} disabled={loading}>
                            {loading ? 'Продажа...' : 'Продать'}
                        </button>
                        <button type="button" className="export-btn" style={{ flex: 1, borderRadius: '10px', padding: '12px', background: 'var(--color-9)' }} onClick={onClose} disabled={loading}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}