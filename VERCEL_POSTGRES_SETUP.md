# הגדרת PostgreSQL ב-Vercel

## שלב 1: יצירת מסד נתונים ב-Vercel

1. היכנס ל-[Vercel Dashboard](https://vercel.com/dashboard)
2. בחר את הפרויקט שלך
3. לך ל-**Storage** → **Create Database**
4. בחר **Postgres**
5. בחר את התוכנית החינמית (Hobby)
6. לחץ **Create**

## שלב 2: הגדרת Environment Variables

Vercel יוצר אוטומטית את ה-`DATABASE_URL` ב-Environment Variables. בדוק:

1. לך ל-**Settings** → **Environment Variables**
2. ודא שיש `DATABASE_URL` עם הערך מה-Postgres database

## שלב 3: הרצת Migrations

אחרי שה-build מסתיים, הרץ את הפקודות הבאות:

### אופציה 1: דרך Vercel CLI (מומלץ)

```bash
# התקן Vercel CLI אם עדיין לא
npm i -g vercel

# התחבר
vercel login

# קשר לפרויקט
vercel link

# הרץ migration
vercel env pull .env.local
npx prisma migrate deploy
```

### אופציה 2: דרך Vercel Dashboard

1. לך ל-**Settings** → **Build & Development Settings**
2. הוסף ב-**Build Command**:
   ```bash
   npm run build && npx prisma migrate deploy
   ```
3. או הוסף script חדש ב-`package.json`:
   ```json
   "postbuild": "prisma migrate deploy"
   ```

### אופציה 3: דרך API (לאחר deployment)

לאחר שה-build מסתיים, הרץ:

```bash
# קבל את ה-DATABASE_URL מ-Vercel
# ואז הרץ מקומית:
export DATABASE_URL="your-vercel-postgres-url"
npx prisma migrate deploy
npx prisma db seed
```

## שלב 4: הרצת Seed

לאחר שה-migrations רצו, הרץ את ה-seed:

### דרך API endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/seed
```

### או דרך Vercel CLI:
```bash
vercel env pull .env.local
npm run db:seed
```

## אימות שהכל עובד

1. בדוק את ה-logs ב-Vercel - לא אמורות להיות שגיאות
2. פתח את האפליקציה ובדוק שהבתי כנסת מופיעים
3. או הרץ:
   ```bash
   curl https://your-app.vercel.app/api/synagogues
   ```

## פתרון בעיות

### שגיאת "relation does not exist"
- ה-migrations לא רצו. הרץ `npx prisma migrate deploy`

### שגיאת "connection refused"
- בדוק שה-`DATABASE_URL` מוגדר נכון ב-Vercel
- ודא שה-Postgres database פעיל

### אין נתונים
- הרץ את ה-seed: `POST /api/seed`
- או `npm run db:seed` עם ה-DATABASE_URL הנכון

## הערות חשובות

- **SQLite לא עובד ב-Vercel** - כל deployment מתחיל מחדש
- **PostgreSQL הוא הפתרון הנכון** ל-production
- ה-`DATABASE_URL` נוצר אוטומטית ב-Vercel Postgres
- ה-migrations צריכים לרוץ אחרי כל deployment (או דרך `postbuild` script)

