# دليل تفعيل موقع "الشاف أيمن" قبل النشر

هذا الموقع جاهز من الناحية التصميمية، لكن فيه **4 أشياء لازم تسويها** قبل ما تحط الرابط في بايو انستغرام.

---

## 1. تفعيل لوحة التحكم (استقبال الحجوزات في Google Sheets)

### الخطوات:
1. روح لـ [sheets.google.com](https://sheets.google.com) وسوي جدول (Spreadsheet) جديد، سميه مثلاً "حجوزات الشاف أيمن".
2. من القائمة فوق: **Extensions ← Apps Script**.
3. امسح أي كود موجود، والصق محتوى ملف `apps-script.gs` كاملاً.
4. اضغط 💾 (Save)، وسمّي المشروع أي اسم.
5. اضغط **Deploy ← New deployment**.
6. اختر النوع (Type): **Web app**.
7. في "Execute as": اختر **Me**.
8. في "Who has access": اختر **Anyone**.
9. اضغط **Deploy**. قد يطلب منك تسجيل الدخول والموافقة على الصلاحيات (طبيعي، هذا مشروعك الخاص).
10. بعد النشر، راح يعطيك رابط شكله:
    `https://script.google.com/macros/s/XXXXXXXXXXXX/exec`
11. انسخ هذا الرابط.

### وضع الرابط في الموقع:
افتح ملف `script.js`، دور على هذا السطر (قريب من السطر 100):
```js
const SHEET_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
```
واستبدله بالرابط اللي نسخته:
```js
const SHEET_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";
```

**بعد هذا، كل حجز من الموقع راح يظهر مباشرة كسطر جديد في جدول Google Sheets** — وهذا هو "لوحة التحكم" ديالك: تقدر تفرز، تبحث، تعلّم الحالة (مؤكد/ملغى)، وتفتحها من الهاتف أو الكمبيوتر في أي وقت.

---

## 2. استبدال البيانات التجريبية

في ملف `build.py` (أعلى الملف) وملف `script.js`، بدّل:

| ما تبدله | وين تلقاه |
|---|---|
| رقم الواتساب | `script.js` (متغير `WHATSAPP_NUMBER`) — موجود حالياً |
| الإيميل | `build.py` (متغير `EMAIL`) |
| رابط انستغرام | `build.py` (متغير `INSTAGRAM`) — تأكد من صحة الحساب |
| رابط الموقع النهائي | `build.py` (متغير `SITE_URL`) + `robots.txt` + `sitemap.xml` |

بعد أي تعديل في `build.py`، شغّل من جديد:
```bash
python3 generate_pages.py
```
هذا راح يعيد بناء الصفحات الستة تلقائياً بالمعلومات الجديدة.

---

## 3. إضافة صورك الحقيقية

في صفحة `gallery.html`، كل مربع (`gframe`) هو مكان فارغ مؤقت. لاستبداله بصورة حقيقية:

1. حط صورك في مجلد جديد اسمه `images/` بجانب باقي الملفات.
2. في `generate_pages.py`، دور على دالة `gframe()` وبدّلها بـ:
```python
def gframe(cat, img):
    return f'''<div class="gframe" data-cat="{cat}" style="padding:0;">
      <img src="images/{img}" alt="" style="width:100%;height:100%;object-fit:cover;">
    </div>'''
```
3. استعمل صور بمقاس متقارب (نسبة 4:5 مثلاً 800×1000 بكسل) لأفضل نتيجة.
4. شغّل `python3 generate_pages.py` من جديد.

**مهم:** لا تستعمل صوراً منسوخة من الإنترنت لا تملك حقوقها — استعمل صورك الخاصة فقط لتجنب مشاكل حقوق الملكية.

---

## 4. رفع الموقع على GitHub Pages

1. سوي Repository جديد باسم `chef-aymen` (أو أي اسم تحبه).
2. ارفع **كل الملفات** التالية في جذر الريبو (بدون مجلدات فرعية):
   - `index.html`, `about.html`, `menus.html`, `gallery.html`, `booking.html`, `contact.html`
   - `style.css`, `script.js`, `favicon.svg`, `robots.txt`, `sitemap.xml`
   - مجلد `images/` إذا أضفت صوراً
3. روح لـ **Settings ← Pages**، فعّل من فرع `main` والمجلد `/root`.
4. بعد دقيقة تقريباً، يعطيك رابط شكله:
   `https://username.github.io/chef-aymen/`
5. هذا الرابط حطه في بايو انستغرام ✅

---

## قائمة تحقق نهائية قبل النشر

- [ ] فعّلت Google Sheets ولصقت الرابط في `script.js`
- [ ] جربت نموذج الحجز بنفسك وتأكدت أنه يظهر في الجدول
- [ ] بدّلت الإيميل والانستغرام برقمك الحقيقي
- [ ] راجعت الأسعار في `menus.html` وعدّلتها لأسعارك الحقيقية
- [ ] أضفت صورك الحقيقية (أو تركت الإطارات المؤقتة مؤقتاً)
- [ ] رفعت الموقع على GitHub Pages وجربت الرابط من الهاتف
