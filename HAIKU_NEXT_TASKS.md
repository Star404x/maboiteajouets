# План работы для Haiku 4.5 — MaBoiteAJouets.fr

## Контекст (что уже сделано Opus 4.7)

### Инфраструктура
- ✅ Netlify env vars настроены: `STRIPE_SECRET_KEY=sk_live_51TtXY6...`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_51TtXY6...`
- ✅ Netlify Auth Token в чате истории: `nfp_FNaMgRKKRWxqfsJovBPfMmRYqAVESjD57772` (использовать через `NETLIFY_AUTH_TOKEN=... netlify ...`)
- ✅ PostgreSQL: `postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require`

### Что уже работает
- ✅ Payment Intent API: `/.netlify/functions/create-payment-intent` создаёт intent + сохраняет заказ в БД
- ✅ Stripe Webhook: `/.netlify/functions/stripe-webhook` готов к обработке событий (нужно только зарегистрировать endpoint в Stripe Dashboard)
- ✅ Схема БД: `customers`, `addresses`, `orders`, `order_items`, `order_events` — все связи и индексы на месте
- ✅ Фронтенд checkout передаёт все данные (клиент, адрес, товары) в API

### Файлы созданные Opus:
- `.netlify/functions/create-payment-intent.js` — основная функция создания заказа + Payment Intent
- `.netlify/functions/stripe-webhook.js` — обработчик Stripe events
- `scripts/create-orders-schema.js` — миграция БД (уже применена)
- `src/components/checkout/CheckoutView.tsx` — обновлён (стабильный orderId + передача всех полей)
- `src/components/checkout/StripePaymentForm.tsx` — принимает customer/address/items

---

## 🎯 Твои задачи (по приоритету):

### Задача 1: Зарегистрировать Stripe Webhook в Dashboard

**Через Netlify CLI получи URL:**
```
https://maboiteajouets.fr/.netlify/functions/stripe-webhook
```

**Регистрация webhook требует ручного действия пользователя** (нужен доступ к Stripe Dashboard). Отправь пользователю Вячеславу такое сообщение:

> Для того чтобы заказы автоматически помечались как «оплачено» после подтверждения платежа, нужно зарегистрировать webhook в Stripe Dashboard:
>
> 1. Открой https://dashboard.stripe.com/webhooks
> 2. Нажми «Add endpoint»
> 3. Endpoint URL: `https://maboiteajouets.fr/.netlify/functions/stripe-webhook`
> 4. Events to send: выбери 4 события:
>    - `payment_intent.succeeded`
>    - `payment_intent.payment_failed`
>    - `payment_intent.canceled`
>    - `charge.refunded`
> 5. После создания endpoint появится «Signing secret» вида `whsec_...` — пришли его мне

**Когда получишь `whsec_...`, установи в Netlify:**
```bash
cd /data/.openclaw/workspace/maboiteajouets-v2
NETLIFY_AUTH_TOKEN="nfp_FNaMgRKKRWxqfsJovBPfMmRYqAVESjD57772" \
  netlify env:set STRIPE_WEBHOOK_SECRET "whsec_ПОЛУЧЕННЫЙ_КЛЮЧ" --context production
NETLIFY_AUTH_TOKEN="nfp_FNaMgRKKRWxqfsJovBPfMmRYqAVESjD57772" \
  netlify deploy --prod --skip-functions-cache
```

**НЕ забудь протестировать через Stripe Dashboard → Send test event → payment_intent.succeeded**
Проверь что заказ в БД перешёл в `status='paid'`.

---

### Задача 2: Создать страницу успеха оплаты `/commande/succes`

Сейчас после оплаты пользователь просто видит step 4 «Confirmation». Нужна отдельная страница успеха для случая если Stripe редиректит (например, для 3D Secure).

**Файл: `src/app/commande/succes/page.tsx`**

```tsx
import Link from "next/link";
import { Check } from "lucide-react";

export const dynamic = "force-static";

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-mint/20 mx-auto mb-6 inline-flex items-center justify-center">
          <Check className="w-10 h-10 text-mint" strokeWidth={3} />
        </div>
        <h1 className="font-display font-bold text-navy text-3xl mb-3">
          Merci pour votre commande !
        </h1>
        <p className="text-navy/70 mb-6">
          Vous recevrez un email de confirmation dans quelques instants.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-navy text-white font-semibold hover:bg-navy/90"
        >
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}
```

Собери и задеплой:
```bash
cd /data/.openclaw/workspace/maboiteajouets-v2
npm run build && \
  NETLIFY_AUTH_TOKEN="nfp_FNaMgRKKRWxqfsJovBPfMmRYqAVESjD57772" \
  netlify deploy --prod --skip-functions-cache
```

---

### Задача 3: Простая админка `/admin/orders`

**Требования:**
- Basic auth через пароль в env var `ADMIN_PASSWORD`
- Список всех заказов: id, дата, клиент (имя+email+телефон), товары, сумма, статус
- Сортировка от новых к старым
- Экспорт CSV (кнопка в шапке)

**Реализация:**

#### 3.1 Netlify функция `admin-orders.js`

```javascript
// .netlify/functions/admin-orders.js
const { Pool } = require("pg");

const DB_URL = process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require";
const pool = new Pool({ connectionString: DB_URL, max: 3 });

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

function unauthorized() {
  return {
    statusCode: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin"',
      "Content-Type": "text/plain",
    },
    body: "Unauthorized",
  };
}

function checkAuth(event) {
  const auth = event.headers.authorization || event.headers.Authorization;
  if (!auth || !auth.startsWith("Basic ")) return false;
  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
  const [_, pwd] = decoded.split(":");
  return pwd === ADMIN_PASSWORD;
}

exports.handler = async (event) => {
  if (!checkAuth(event)) return unauthorized();

  const format = event.queryStringParameters?.format || "json";

  const db = await pool.connect();
  try {
    const orders = await db.query(`
      SELECT 
        o.id, o.status, o.payment_status, o.total_cents, o.currency,
        o.stripe_payment_intent_id, o.created_at, o.paid_at,
        c.email, c.first_name, c.last_name, c.phone,
        a.line1, a.postal_code, a.city, a.country,
        (SELECT json_agg(json_build_object(
          'name', oi.product_name,
          'quantity', oi.quantity,
          'unit_price_cents', oi.unit_price_cents
        )) FROM order_items oi WHERE oi.order_id = o.id) AS items
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      LEFT JOIN addresses a ON a.id = o.shipping_address_id
      ORDER BY o.created_at DESC
      LIMIT 500
    `);

    if (format === "csv") {
      const header = "ID,Date,Statut,Paiement,Email,Nom,Téléphone,Adresse,CP,Ville,Total EUR,Stripe PI\n";
      const rows = orders.rows.map(o => [
        o.id,
        o.created_at,
        o.status,
        o.payment_status,
        o.email,
        `"${(o.first_name || "") + " " + (o.last_name || "")}"`,
        o.phone || "",
        `"${o.line1 || ""}"`,
        o.postal_code || "",
        o.city || "",
        (o.total_cents / 100).toFixed(2),
        o.stripe_payment_intent_id || "",
      ].join(",")).join("\n");

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0,10)}.csv"`,
        },
        body: header + rows,
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders: orders.rows }),
    };
  } finally {
    db.release();
  }
};
```

#### 3.2 Установи пароль в Netlify:
```bash
cd /data/.openclaw/workspace/maboiteajouets-v2
# Выбери пароль сам, например длинный рандом:
NETLIFY_AUTH_TOKEN="nfp_FNaMgRKKRWxqfsJovBPfMmRYqAVESjD57772" \
  netlify env:set ADMIN_PASSWORD "СГЕНЕРИРУЙ_СИЛЬНЫЙ_ПАРОЛЬ_МИНИМУМ_20_СИМВОЛОВ" --context production
```

**Пришли пользователю пароль в сообщении** (или через onetimesecret если хочешь безопаснее).

#### 3.3 Страница `src/app/admin/orders/page.tsx`

Простой React component, который fetch'ит `/.netlify/functions/admin-orders` с Basic Auth (браузер автоматически покажет prompt для login/password).

```tsx
"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/.netlify/functions/admin-orders", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) throw new Error("Non autorisé");
        return r.json();
      })
      .then((data) => setOrders(data.orders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Commandes ({orders.length})</h1>
        <a
          href="/.netlify/functions/admin-orders?format=csv"
          className="px-4 py-2 bg-navy text-white rounded-lg"
        >
          Export CSV
        </a>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="p-4 border rounded-xl bg-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-mono text-sm text-gray-500">{o.id}</div>
                <div className="font-bold">{o.first_name} {o.last_name}</div>
                <div className="text-sm text-gray-600">{o.email} · {o.phone}</div>
                <div className="text-sm text-gray-600">
                  {o.line1}, {o.postal_code} {o.city}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{(o.total_cents / 100).toFixed(2)} €</div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  o.payment_status === "paid" ? "bg-green-100 text-green-800" :
                  o.payment_status === "failed" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {o.payment_status}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(o.created_at).toLocaleString("fr-FR")}
                </div>
              </div>
            </div>
            {o.items && (
              <div className="mt-2 pt-2 border-t text-sm">
                {o.items.map((it: any, i: number) => (
                  <div key={i}>• {it.name} × {it.quantity}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Важно:** Basic Auth от Netlify функции работает как proxy — браузер автоматически покажет login prompt при первом обращении.

Собери, задеплой, проверь: https://maboiteajouets.fr/admin/orders

---

### Задача 4: Email-подтверждения (опционально, но желательно)

**Клиенту:** Stripe УЖЕ отправляет email через `receipt_email` (мы это установили). Проверь что получил тестовый чек на реальный email.

**Админу (Вячеславу):** нужно отправлять письмо когда приходит платёж.

Самый простой способ — **дополнить `stripe-webhook.js`**, добавив отправку email через Resend или прямо через SMTP.

**Вариант через Resend** (проще):
```bash
npm install resend
```

В `stripe-webhook.js` в блоке `payment_intent.succeeded` добавить:
```javascript
if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Получи данные заказа для письма
  const orderData = await db.query(`
    SELECT o.*, c.email, c.first_name, c.last_name, c.phone,
           a.line1, a.postal_code, a.city
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    LEFT JOIN addresses a ON a.id = o.shipping_address_id
    WHERE o.id = $1
  `, [orderId]);
  
  const o = orderData.rows[0];
  await resend.emails.send({
    from: "Ma Boîte à Jouets <noreply@maboiteajouets.fr>",
    to: process.env.ADMIN_EMAIL,
    subject: `🎉 Nouvelle commande ${orderId} - ${(o.total_cents/100).toFixed(2)}€`,
    html: `
      <h2>Nouvelle commande !</h2>
      <p><b>${o.first_name} ${o.last_name}</b></p>
      <p>${o.email} · ${o.phone}</p>
      <p>${o.line1}, ${o.postal_code} ${o.city}</p>
      <p><b>Total: ${(o.total_cents/100).toFixed(2)} €</b></p>
      <p><a href="https://maboiteajouets.fr/admin/orders">Voir dans l'admin</a></p>
    `,
  });
}
```

**Требуется от пользователя:**
- Regger аккаунт на https://resend.com (бесплатно 3000 email/мес)
- Верифицировать домен `maboiteajouets.fr`
- Получить `RESEND_API_KEY` → установить в Netlify env
- Установить `ADMIN_EMAIL` = `info.maboiteajouets@gmail.com`

Если Resend слишком сложно — пропусти эту задачу, оставь только Stripe receipt для клиента.

---

## ⚠️ Важные подводные камни (не забыть!)

1. **Транзакция БД в create-payment-intent** — уже реализована. Не ломай её. Если добавляешь что-то — оборачивай в тот же `BEGIN/COMMIT/ROLLBACK`.

2. **Webhook signature** — уже правильно обрабатывает `event.isBase64Encoded`. Не трогай эту логику.

3. **Netlify functions cache** — при изменениях в `.netlify/functions/*.js` ВСЕГДА деплой с `--skip-functions-cache`, иначе будет старая версия.

4. **Пароль админки** — не hardcode. Только через env var `ADMIN_PASSWORD`.

5. **CSV escaping** — если в имени клиента есть запятая или кавычка, простой join через `,` сломается. Для production нужна нормальная CSV библиотека, но для MVP пойдёт.

6. **Обратная совместимость** — функция `create-payment-intent` поддерживает legacy формат (`amount`, `customerEmail`). Не удаляй эти fallback'и.

---

## 📊 Стриктный порядок выполнения:

1. Задача 2 (страница успеха) — 5 минут, простая ✅
2. Задача 3.1 + 3.2 + 3.3 (админка) — 20-30 минут
3. Отправь Вячеславу инструкцию про webhook (Задача 1) — он должен зарегистрировать сам
4. Как только Вячеслав пришлёт `whsec_...` — обнови env var, редеплой, протестируй тестовым event'ом
5. Задача 4 (email) — только если Вячеслав захочет

**После каждой задачи:** пересобирай (`npm run build`) и деплой (`netlify deploy --prod --skip-functions-cache`). Проверяй что сайт открывается.

**Тестовая карта Stripe:** `4242 4242 4242 4242`, дата любая будущая, CVC любой.

Удачи! 🚀
