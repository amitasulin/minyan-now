import Link from "next/link";
import { ChevronLeft, Heart, Users, MapPin, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              חזרה
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🕍</div>
              <h1 className="text-2xl font-bold text-gray-900">מניין עכשיו</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            אודות מניין עכשיו
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            פלטפורמה קהילתית למציאת מניינים פעילים ובתי כנסת בקרבת מקום
          </p>
        </div>

        {/* Mission */}
        <section className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 text-red-500 me-3" />
            <h2 className="text-3xl font-bold text-gray-900">המשימה שלנו</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            מניין עכשיו נוצר כדי לסייע לקהילה היהודית למצוא מניינים פעילים ובתי
            כנסת בקרבתם בזמן אמת. אנו מאמינים שחיבור קהילתי חזק הוא הבסיס לחיי
            קהילה משמעותיים.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            הפלטפורמה שלנו מתבססת על דיווחים מהקהילה ומספקת מידע מדויק ועדכני
            על מניינים ובתי כנסת ברחבי ישראל.
          </p>
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            תכונות מרכזיות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <MapPin className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                מפה אינטראקטיבית
              </h3>
              <p className="text-gray-600">
                מצא בתי כנסת בקרבתך באמצעות מפה מתקדמת עם מידע מפורט על כל בית
                כנסת
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Clock className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                זמני תפילה
              </h3>
              <p className="text-gray-600">
                קבל זמני תפילה מדויקים לכל בית כנסת בהתבסס על המיקום והתאריך
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                דיווחים מהקהילה
              </h3>
              <p className="text-gray-600">
                עדכונים בזמן אמת על מניינים פעילים, בדיווחים מהימנים מהקהילה
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <Heart className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                נגישות
              </h3>
              <p className="text-gray-600">
                סנן בתי כנסת לפי תכונות נגישות כמו חניה, כניסה לכיסא גלגלים,
                ומיזוג אוויר
              </p>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">איך זה עובד?</h2>
          <ol className="space-y-4 text-lg">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold me-3">
                1
              </span>
              <span>חפש בתי כנסת בקרבתך באמצעות מיקום או שם</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold me-3">
                2
              </span>
              <span>בחר בית כנסת וצפה בפרטים מלאים וזמני תפילה</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold me-3">
                3
              </span>
              <span>דווח על מניין פעיל כדי לעזור לאחרים בקהילה</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold me-3">
                4
              </span>
              <span>קבל עדכונים בזמן אמת על מניינים פעילים</span>
            </li>
          </ol>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">צור קשר</h2>
          <p className="text-gray-600 mb-6">
            יש לך שאלות או הצעות? נשמח לשמוע ממך!
          </p>
          <a
            href="mailto:info@minyan-now.co.il"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            שלח לנו הודעה
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 מניין עכשיו. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

