# מדריך ליצירת Google Maps Map ID

## למה צריך Map ID?

Map ID נדרש לשימוש ב-AdvancedMarkerElement (המרקרים החדשים של Google Maps). בלי Map ID, המרקרים לא יעבדו כראוי.

## שלב 1: גישה ל-Google Cloud Console

1. לך ל-[Google Cloud Console](https://console.cloud.google.com/)
2. התחבר עם החשבון שלך
3. בחר את הפרויקט שבו יש לך את מפתח ה-API של Google Maps

## שלב 2: יצירת Map ID

יש לך שתי אפשרויות:

### אפשרות א': יצירת Map Style חדש (מומלץ)

1. **נווט ל-Map Styles:**
   - בתפריט השמאלי, לחץ על **"Maps"** (או "APIs & Services" → "Maps")
   - לחץ על **"Map Styles"** או **"Map Management"**
   - או גש ישירות ל-[Map Styles page](https://console.cloud.google.com/google/maps-apis/studio/maps)

2. **צור Map Style חדש:**
   - לחץ על הכפתור **"Create Map Style"** או **"New Map Style"**
   - בחר אחת מהאפשרויות:
     - **"Import JSON"** - אם יש לך קובץ JSON עם סגנון
     - **"Create new style"** - ליצירת סגנון חדש מאפס
     - **"Copy existing style"** - להעתקת סגנון קיים

3. **הגדר את הסגנון:**
   - אם יצרת סגנון חדש, תוכל להתאים את הצבעים והסגנון
   - או פשוט בחר תבנית מוכנה

4. **שמור את הסגנון:**
   - לחץ על **"Save"** או **"Publish"**
   - תקבל **Map ID** (נראה כמו: `1234567890abcdef` או `abc123def456`)

### אפשרות ב': שימוש ב-Map ID קיים

אם כבר יש לך Map ID בפרויקט:

1. לך ל-**"Maps"** → **"Map Management"** → **"Map IDs"**
2. תראה רשימה של כל ה-Map IDs הקיימים בפרויקט
3. העתק את ה-Map ID שאתה רוצה להשתמש בו

## שלב 3: עדכון .env.local

1. פתח את הקובץ `.env.local` בתיקיית השורש של הפרויקט
2. מצא את השורה:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="DEMO_MAP_ID"
   ```
3. החלף את `DEMO_MAP_ID` ב-Map ID האמיתי:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="your-actual-map-id-here"
   ```
4. שמור את הקובץ

## שלב 4: הפעלה מחדש של השרת

לאחר עדכון `.env.local`, הפעל מחדש את השרת:

```bash
# עצור את השרת (Ctrl+C)
npm run dev
```

## הערות חשובות

- **DEMO_MAP_ID**: עובד לבדיקות, אבל יש לו מגבלות. לא מומלץ לייצור.
- **Map ID אמיתי**: נותן גישה מלאה לכל התכונות של Advanced Markers.
- **עלות**: יצירת Map ID היא חינמית, אבל שימוש ב-Google Maps API כרוך בעלויות (בדוק את המחירים).

## פתרון בעיות

### לא רואה את "Map Styles" בתפריט?

1. ודא שהפעלת את **Maps JavaScript API** בפרויקט
2. ודא שאתה בפרויקט הנכון
3. נסה לגשת ישירות: https://console.cloud.google.com/google/maps-apis/studio/maps

### Map ID לא עובד?

1. ודא שהעתקת את ה-Map ID במלואו (ללא רווחים)
2. ודא שה-Map ID שייך לאותו פרויקט כמו מפתח ה-API
3. ודא שהשרת הופעל מחדש לאחר עדכון `.env.local`

### עדיין מקבל אזהרות?

אם עדיין יש אזהרות על סגנונות, זה אומר שה-Map ID לא נטען כראוי. בדוק:
1. שהמשתנה `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` מוגדר ב-`.env.local`
2. שהשרת הופעל מחדש
3. שהקובץ `.env.local` נמצא בתיקיית השורש

## קישורים שימושיים

- [Google Cloud Console](https://console.cloud.google.com/)
- [Map Styles](https://console.cloud.google.com/google/maps-apis/studio/maps)
- [תיעוד Advanced Markers](https://developers.google.com/maps/documentation/javascript/advanced-markers)
- [מדריך Migration ל-Advanced Markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration)

