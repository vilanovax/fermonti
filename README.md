# فرمنوتی — اتاق فرمان رستوران

داشبورد مدیریتی موبایل‌فرندلی برای رستوران (دموی نمایشی با داده نمونه).

## اجرا

```bash
npm install
npm run dev
```

سپس در مرورگر موبایل یا DevTools با عرض موبایل باز کنید: `http://localhost:5173`

## ساختار

- **۳ لایه:** مالک | عملیات | مالی
- **۱۱ بخش:** Overview، فروش، Food Cost، انبار، مالی، HR، مشتری، **صندوق پستی**، هشدار، تایم‌لاین، AI
- **فیلتر بازه:** امروز | این هفته | این ماه (`src/data/periodData.ts`)
- **API آماده:** `src/services/dashboardApi.ts` (فعلاً دمو با تأخیر شبیه‌سازی)
- **شخصی‌سازی KPI:** ذخیره در `localStorage` کلید `fermenuti-pinned-kpis`

## بیلد

```bash
npm run build
npm run preview
```

## نصب روی موبایل (PWA)

بعد از `npm run build` و `npm run preview` (یا deploy روی HTTPS):

- **اندروید / Chrome:** بنر «نصب اپ فرمنوتی» یا منوی مرورگر → «Add to Home screen»
- **آیفون:** دکمه اشتراک → «Add to Home Screen»

لوگو و manifest به‌صورت خودکار در بیلد تولید می‌شوند.
