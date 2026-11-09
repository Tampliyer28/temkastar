import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const GameContext = createContext(null);
const STORAGE_KEY = 'temkastar_save_v2';

// admin123
const ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

const makeNewUser = ({ login, telegram, passwordHash, is_admin = false }) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  login,
  telegram: telegram || '',
  passwordHash,
  is_admin,
  registered_at: new Date().toLocaleDateString('ru-RU'),
  // ---- Данные игрока ----
  balance: { coins: 0, rubles: 0 }, // стартовый баланс 0
  inventory: [],
  xp: 0,
  level: 1,
  stats: { cases: 0, upgrades: 0, withdrawals_sum: 0 },
});

const INITIAL_STATE = {
  // ---- Глобальные данные ----
  promocodes: [
    { id: 1, code: 'TEMKA2026', bonus_percent: 20, is_active: 1 },
    { id: 2, code: 'TOPDROP11', bonus_percent: 11, is_active: 1 },
  ],
  revenue: 0,   // все донаты
  payouts: 0,   // все выплаты
  // ---- Пользователи ----
  users: [
    {
      id: 1,
      login: 'Tampliyer28',
      telegram: '@tampliyer',
      passwordHash: ADMIN_HASH,
      is_admin: true,
      registered_at: '01.01.2024',
      balance: { coins: 1000, rubles: 5000 },
      inventory: [],
      xp: 0,
      level: 1,
      stats: { cases: 0, upgrades: 0, withdrawals_sum: 0 },
    },
  ],
  currentUserId: null,
};

const LEVEL_THRESHOLDS = [
  { lvl: 1, xp: 0 }, { lvl: 2, xp: 2500 }, { lvl: 3, xp: 7500 },
  { lvl: 4, xp: 18000 }, { lvl: 5, xp: 40000 }, { lvl: 6, xp: 75000 },
  { lvl: 7, xp: 130000 }, { lvl: 8, xp: 220000 }, { lvl: 9, xp: 350000 },
  { lvl: 10, xp: 550000 }, { lvl: 15, xp: 1200000 }, { lvl: 20, xp: 2500000 },
  { lvl: 25, xp: 5000000 }, { lvl: 30, xp: 10000000 },
  { lvl: 40, xp: 25000000 }, { lvl: 50, xp: 60000000 },
];

const calcLevel = (xp) => {
  let lvl = 1;
  for (const t of LEVEL_THRESHOLDS) if (xp >= t.xp) lvl = t.lvl;
  return lvl;
};

async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Хелпер: обновить текущего пользователя в массиве
const updateCurrentUser = (prev, updater) => {
  if (!prev.currentUserId) return prev;
  return {
    ...prev,
    users: prev.users.map(u => (u.id === prev.currentUserId ? updater(u) : u)),
  };
};

// Значения по умолчанию для гостя
const GUEST_DEFAULTS = {
  balance: { coins: 0, rubles: 0 },
  inventory: [],
  xp: 0,
  level: 1,
  stats: { cases: 0, upgrades: 0, withdrawals_sum: 0 },
};

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...INITIAL_STATE,
          ...parsed,
          users: parsed.users && parsed.users.length ? parsed.users : INITIAL_STATE.users,
        };
      }
    } catch (_) {}
    return INITIAL_STATE;
  });

  const [levelUp, setLevelUp] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  // ---- Текущий пользователь ----
  const user = useMemo(
    () => state.users.find(u => u.id === state.currentUserId) || null,
    [state.users, state.currentUserId]
  );

  // Данные игрока: если гость — пустышки
  const player = user || GUEST_DEFAULTS;

  // ---------- XP / баланс / инвентарь ----------
  const addXp = useCallback((amount) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      return updateCurrentUser(prev, (u) => {
        const newXp = u.xp + amount;
        const oldLevel = u.level;
        const newLevel = calcLevel(newXp);
        if (newLevel > oldLevel) {
          setTimeout(() => setLevelUp({ old_level: oldLevel, new_level: newLevel }), 0);
          let rubles = 0, coins = 0;
          for (let l = oldLevel + 1; l <= newLevel; l++) {
            switch (l) {
              case 2: rubles += 500; break;
              case 3: coins += 100; break;
              case 4: rubles += 1500; break;
              case 5: coins += 500; break;
              case 6: rubles += 3000; break;
              case 7: coins += 1000; break;
              case 8: rubles += 5000; break;
              case 9: coins += 2000; break;
              case 10: rubles += 10000; break;
              case 15: rubles += 25000; break;
              case 20: coins += 5000; break;
              case 25: rubles += 50000; break;
              case 30: rubles += 100000; break;
              case 40: rubles += 250000; break;
              case 50: rubles += 1000000; break;
            }
          }
          return {
            ...u, xp: newXp, level: newLevel,
            balance: { rubles: u.balance.rubles + rubles, coins: u.balance.coins + coins },
          };
        }
        return { ...u, xp: newXp, level: newLevel };
      });
    });
  }, []);

  const canAfford = useCallback((currency, amount) => {
    return (player.balance[currency] || 0) >= amount;
  }, [player.balance]);

  const spendBalance = useCallback((currency, amount) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      return updateCurrentUser(prev, (u) => {
        if ((u.balance[currency] || 0) < amount) return u;
        return { ...u, balance: { ...u.balance, [currency]: u.balance[currency] - amount } };
      });
    });
  }, []);

  const addBalance = useCallback((currency, amount) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      return updateCurrentUser(prev, (u) => ({
        ...u,
        balance: { ...u.balance, [currency]: (u.balance[currency] || 0) + amount },
      }));
    });
  }, []);

  // Начисление коинов 
  const addCoins = useCallback((amount) => {
    if (!amount || amount <= 0) return;
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      return updateCurrentUser(prev, (u) => ({
        ...u,
        balance: { ...u.balance, coins: (u.balance.coins || 0) + amount },
      }));
    });
  }, []);

  const addToInventory = useCallback((gift, count = 1) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      return updateCurrentUser(prev, (u) => {
        const existing = u.inventory.find((i) => i.id === gift.id);
        const newInv = existing
          ? u.inventory.map((i) => (i.id === gift.id ? { ...i, count: i.count + count } : i))
          : [...u.inventory, { id: gift.id, name: gift.name, price: gift.price, img: gift.img, rarity: gift.rarity, count }];
        return { ...u, inventory: newInv };
      });
    });
  }, []);

  const removeFromInventory = useCallback((giftId, count = 1) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      return updateCurrentUser(prev, (u) => {
        const item = u.inventory.find((i) => i.id === giftId);
        if (!item || item.count < count) return u;
        const newInv = u.inventory
          .map((i) => (i.id === giftId ? { ...i, count: i.count - count } : i))
          .filter((i) => i.count > 0);
        return { ...u, inventory: newInv };
      });
    });
  }, []);

  const sellFromInventory = useCallback((giftId, count = 1) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      const current = prev.users.find(u => u.id === prev.currentUserId);
      const item = current?.inventory.find(i => i.id === giftId);
      if (!item || item.count < count) return prev;
      const total = item.price * count;
      return {
        ...updateCurrentUser(prev, (u) => {
          const newInv = u.inventory
            .map((i) => (i.id === giftId ? { ...i, count: i.count - count } : i))
            .filter((i) => i.count > 0);
          return {
            ...u,
            inventory: newInv,
            balance: { ...u.balance, rubles: u.balance.rubles + total },
          };
        }),
        payouts: (prev.payouts || 0) + total,
      };
    });
  }, []);

  const sellAllInventory = useCallback(() => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      const current = prev.users.find(u => u.id === prev.currentUserId);
      if (!current) return prev;
      const total = current.inventory.reduce((s, i) => s + i.price * i.count, 0);
      return {
        ...updateCurrentUser(prev, (u) => ({
          ...u,
          inventory: [],
          balance: { ...u.balance, rubles: u.balance.rubles + total },
        })),
        payouts: (prev.payouts || 0) + total,
      };
    });
  }, []);

  const withdrawFromInventory = useCallback((giftId, count = 1) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      const current = prev.users.find(u => u.id === prev.currentUserId);
      const item = current?.inventory.find(i => i.id === giftId);
      if (!item || item.count < count) return prev;
      const total = item.price * count;
      return {
        ...updateCurrentUser(prev, (u) => {
          const newInv = u.inventory
            .map((i) => (i.id === giftId ? { ...i, count: i.count - count } : i))
            .filter((i) => i.count > 0);
          return {
            ...u,
            inventory: newInv,
            stats: { ...u.stats, withdrawals_sum: u.stats.withdrawals_sum + total },
          };
        }),
        payouts: (prev.payouts || 0) + total,
      };
    });
  }, []);

  const withdrawAllInventory = useCallback(() => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      const current = prev.users.find(u => u.id === prev.currentUserId);
      if (!current) return prev;
      const total = current.inventory.reduce((s, i) => s + i.price * i.count, 0);
      return {
        ...updateCurrentUser(prev, (u) => ({
          ...u,
          inventory: [],
          stats: { ...u.stats, withdrawals_sum: u.stats.withdrawals_sum + total },
        })),
        payouts: (prev.payouts || 0) + total,
      };
    });
  }, []);

  const incStat = useCallback((key, value = 1) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev;
      return updateCurrentUser(prev, (u) => ({
        ...u,
        stats: { ...u.stats, [key]: (u.stats[key] || 0) + value },
      }));
    });
  }, []);

  const createPromocode = useCallback((code, percent) => {
    setState((prev) => ({
      ...prev,
      promocodes: [
        { id: Date.now(), code: code.trim().toUpperCase(), bonus_percent: percent, is_active: 1 },
        ...prev.promocodes,
      ],
    }));
  }, []);

  const deposit = useCallback((amount, promoCode) => {
    const normalized = (promoCode || '').trim().toUpperCase();
    let appliedBonus = 0;
    let appliedCode = null;

    setState((prev) => {
      if (!prev.currentUserId) return prev;
      const promo = normalized ? prev.promocodes.find((p) => p.code === normalized && p.is_active) : null;
      const bonus = promo ? amount * (promo.bonus_percent / 100) : 0;
      appliedBonus = bonus;
      appliedCode = promo ? promo.code : null;
      return {
        ...updateCurrentUser(prev, (u) => ({
          ...u,
          balance: { ...u.balance, rubles: u.balance.rubles + amount + bonus },
        })),
        revenue: (prev.revenue || 0) + amount,
      };
    });

    return { bonus: appliedBonus, code: appliedCode };
  }, []);

  const resetSave = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  }, []);

  // ---------- АВТОРИЗАЦИЯ ----------
  const register = useCallback(async ({ login, password, telegram }) => {
    const trimmed = (login || '').trim();
    if (!trimmed || !password) return { ok: false, error: 'Заполните логин и пароль' };
    if (trimmed.length < 3) return { ok: false, error: 'Логин минимум 3 символа' };
    if (password.length < 6) return { ok: false, error: 'Пароль минимум 6 символов' };

    const exists = state.users.some(u => u.login.toLowerCase() === trimmed.toLowerCase());
    if (exists) return { ok: false, error: 'Такой логин уже занят' };

    const passwordHash = await hashPassword(password);
    const newUser = makeNewUser({ login: trimmed, telegram, passwordHash, is_admin: false });

    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: newUser.id,
    }));

    return { ok: true };
  }, [state.users]);

  const login = useCallback(async ({ login: loginInput, password }) => {
    const trimmed = (loginInput || '').trim();
    if (!trimmed || !password) return { ok: false, error: 'Заполните логин и пароль' };

    const found = state.users.find(u => u.login.toLowerCase() === trimmed.toLowerCase());
    if (!found) return { ok: false, error: 'Пользователь не найден' };

    const passwordHash = await hashPassword(password);
    if (passwordHash !== found.passwordHash) return { ok: false, error: 'Неверный пароль' };

    setState(prev => ({ ...prev, currentUserId: found.id }));
    return { ok: true };
  }, [state.users]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, currentUserId: null }));
  }, []);

  // ---------- Админка ----------
  const adminStats = useMemo(() => {
    const revenue = state.revenue || 0;
    const payouts = state.payouts || 0;
    const totalCases = state.users.reduce((s, u) => s + (u.stats?.cases || 0), 0);
    const totalUpgrades = state.users.reduce((s, u) => s + (u.stats?.upgrades || 0), 0);
    const totalWithdrawals = state.users.reduce((s, u) => s + (u.stats?.withdrawals_sum || 0), 0);
    return {
      revenue: revenue - payouts,
      donations: revenue,
      payouts,
      cases_opened: totalCases,
      upgrades: totalUpgrades,
      users: state.users.length,
      withdrawals: totalWithdrawals,
    };
  }, [state.revenue, state.payouts, state.users]);

  // Публичное значение
  const value = {
    // глобальное
    promocodes: state.promocodes,
    revenue: state.revenue,
    payouts: state.payouts,
    users: state.users,
    currentUserId: state.currentUserId,
    // текущий пользователь
    user,
    // данные игрока (для гостя — пустышки)
    balance: player.balance,
    inventory: player.inventory,
    xp: player.xp,
    level: player.level,
    stats: player.stats,
    // админка
    adminStats,
    levelUp, setLevelUp,
    // методы
    addXp, canAfford, spendBalance, addBalance, addCoins,
    addToInventory, removeFromInventory, sellFromInventory, sellAllInventory,
    withdrawFromInventory, withdrawAllInventory,
    incStat, createPromocode, deposit, resetSave,
    register, login, logout,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}