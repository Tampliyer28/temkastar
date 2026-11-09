import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: doLogin, user } = useGame();

  useEffect(() => {
    document.title = 'Авторизация — TemkaStar';
  }, []);

  useEffect(() => {
    if (user) navigate('/cabinet', { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await doLogin({ login, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/cabinet', { replace: true });
  };

  return (
    <div className="cont df" style={{ justifyContent: 'center', paddingTop: '50px' }}>
      <form className="form df" onSubmit={submit}>
        <h2>Авторизация</h2>

        {error && (
          <div style={{ background: '#46201e', color: '#ff8a80', padding: '10px', borderRadius: '10px', textAlign: 'center', fontFamily: 'Montserrat' }}>
            {error}
          </div>
        )}

        <label className="df">
          Логин
          <input className="inp-form" type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="user" autoFocus />
        </label>

        <label className="df">
          Пароль
          <input className="inp-form" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Вход...' : 'Войти'}</button>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>
          <span style={{ color: 'var(--color-6)' }}>Нет аккаунта? </span>
          <Link to="/register" style={{ color: 'var(--color-4)', textDecoration: 'none' }}>Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
}