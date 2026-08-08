/**
 * الشاف أيمن — استقبال الحجوزات في Google Sheets
 * ------------------------------------------------
 * هذا الكود يُلصق داخل Google Apps Script (شوف SETUP.md للخطوات).
 * كل حجز يصل من الموقع يتسجل تلقائياً كسطر جديد في الجدول.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // إذا كانت هذه أول عملية إرسال، أضف صف العناوين
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "تاريخ الإرسال", "الاسم", "الهاتف", "تاريخ المناسبة",
        "عدد الضيوف", "نوع المناسبة", "القائمة/الباقة", "ملاحظات", "اللغة", "الحالة"
      ]);
    }

    sheet.appendRow([
      new Date(data.submitted_at || new Date()),
      data.name || "",
      data.phone || "",
      data.date || "",
      data.guests || "",
      data.type || "",
      data.menu || "",
      data.notes || "",
      data.lang || "",
      "بانتظار المراجعة" // الحالة الافتراضية — عدّلها يدوياً لاحقاً في الجدول
    ]);

    return ContentService.createTextOutput(JSON.stringify({result: "success"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("الخدمة تعمل بشكل طبيعي ✅");
}
