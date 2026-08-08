/* =========================================================
   Chef Aymen — Shared Scripts
   ========================================================= */
(function(){
  const html = document.documentElement;

  /* ---------- Language toggle (persists across pages) ---------- */
  function applyLang(lang){
    const isFr = lang === 'fr';
    html.classList.toggle('lang-fr', isFr);
    html.setAttribute('lang', isFr ? 'fr' : 'ar');
    html.setAttribute('dir', isFr ? 'ltr' : 'rtl');
    document.querySelectorAll('select option[data-ar][data-fr]').forEach(opt => {
      opt.textContent = isFr ? opt.getAttribute('data-fr') : opt.getAttribute('data-ar');
    });
    try{ localStorage.setItem('chefaymen_lang', lang); }catch(e){}
  }
  let savedLang = 'ar';
  try{ savedLang = localStorage.getItem('chefaymen_lang') || 'ar'; }catch(e){}
  applyLang(savedLang);

  const langToggle = document.getElementById('langToggle');
  if(langToggle){
    langToggle.addEventListener('click', () => {
      applyLang(html.classList.contains('lang-fr') ? 'ar' : 'fr');
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  function closeMenu(){
    if(mobileMenu) mobileMenu.classList.remove('open');
    if(mobileOverlay) mobileOverlay.classList.remove('open');
  }
  if(burger && mobileMenu){
    burger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      if(mobileOverlay) mobileOverlay.classList.add('open');
    });
  }
  if(mobileClose) mobileClose.addEventListener('click', closeMenu);
  if(mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Header shadow on scroll ---------- */
  const headerEl = document.querySelector('header');
  if(headerEl){
    window.addEventListener('scroll', () => {
      headerEl.classList.toggle('scrolled', window.scrollY > 12);
    }, {passive:true});
  }

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat b');
  if(statEls.length){
    const animateCount = (el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/(\d+)/);
      if(!match) return;
      const target = parseInt(match[1], 10);
      const prefix = raw.split(match[1])[0];
      const suffix = raw.split(match[1])[1] || '';
      let current = 0;
      const duration = 1200;
      const start = performance.now();
      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(target * eased);
        el.textContent = prefix + current + suffix;
        if(progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, {threshold:.4});
    statEls.forEach(el => statIo.observe(el));
  }

  /* ---------- Gallery lightbox ---------- */
  window.openLightbox = function(src){
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if(!lb || !img) return;
    img.src = src;
    lb.classList.add('open');
  };
  window.closeLightbox = function(){
    const lb = document.getElementById('lightbox');
    if(lb) lb.classList.remove('open');
  };
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') window.closeLightbox();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('active');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.15});
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Gallery filter ---------- */
  const gtabs = document.querySelectorAll('.gtab');
  if(gtabs.length){
    gtabs.forEach(tab => {
      tab.addEventListener('click', () => {
        gtabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        document.querySelectorAll('.gframe').forEach(frame => {
          const cat = frame.getAttribute('data-cat');
          frame.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
        });
      });
    });
  }

  /* =========================================================
     Booking form — sends to Google Apps Script (Google Sheets)
     ⚠️ استبدل الرابط تحت بالرابط اللي تحصل عليه بعد نشر
     Apps Script كـ Web App (شوف ملف SETUP.md للتعليمات)
     ========================================================= */
  const SHEET_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
  const WHATSAPP_NUMBER = "213792289766";

  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    const statusBox = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBooking');

    function showStatus(type, msgAr, msgFr){
      if(!statusBox) return;
      const isFr = html.classList.contains('lang-fr');
      statusBox.textContent = isFr ? msgFr : msgAr;
      statusBox.className = 'form-status show ' + type;
    }

    function getData(){
      const isFr = html.classList.contains('lang-fr');
      const typeSel = document.getElementById('f_type');
      const menuSel = document.getElementById('f_menu');
      return {
        name: document.getElementById('f_name').value.trim(),
        phone: document.getElementById('f_phone').value.trim(),
        date: document.getElementById('f_date').value,
        guests: document.getElementById('f_guests').value.trim(),
        type: typeSel.options[typeSel.selectedIndex].getAttribute(isFr ? 'data-fr' : 'data-ar'),
        menu: menuSel.options[menuSel.selectedIndex].getAttribute(isFr ? 'data-fr' : 'data-ar'),
        notes: document.getElementById('f_notes').value.trim(),
        lang: isFr ? 'FR' : 'AR',
        submitted_at: new Date().toISOString()
      };
    }

    function validate(data){
      return data.name && data.phone && data.date && data.guests;
    }

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isFr = html.classList.contains('lang-fr');
      const data = getData();
      if(!validate(data)){
        showStatus('err', 'الرجاء تعبئة الحقول الإلزامية (*).', "Merci de remplir les champs obligatoires (*).");
        return;
      }

      if(SHEET_ENDPOINT.indexOf('PASTE_YOUR') === 0){
        showStatus('err',
          'لوحة التحكم غير مفعّلة بعد — استخدم زر واتساب بالأسفل مؤقتاً.',
          "Le tableau de bord n'est pas encore activé — utilisez WhatsApp ci-dessous pour le moment.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = isFr ? 'جاري الإرسال...' : '...جاري الإرسال';

      try{
        await fetch(SHEET_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {'Content-Type':'text/plain;charset=utf-8'},
          body: JSON.stringify(data)
        });
        showStatus('ok',
          'تم استلام طلبك بنجاح! سنتواصل معك قريباً لتأكيد الحجز.',
          'Votre demande a été reçue avec succès ! Nous vous contacterons bientôt.');
        bookingForm.reset();
      }catch(err){
        showStatus('err',
          'حدث خطأ أثناء الإرسال. جرّب زر واتساب بالأسفل.',
          "Une erreur s'est produite. Essayez le bouton WhatsApp ci-dessous.");
      }finally{
        submitBtn.disabled = false;
        submitBtn.textContent = isFr ? 'إرسال الطلب' : 'إرسال الطلب';
        submitBtn.innerHTML = '<span data-ar>إرسال الطلب</span><span data-fr>Envoyer la demande</span>';
        applyLang(html.classList.contains('lang-fr') ? 'fr' : 'ar');
      }
    });

    const waBtn = document.getElementById('sendWaBackup');
    if(waBtn){
      waBtn.addEventListener('click', () => {
        const isFr = html.classList.contains('lang-fr');
        const data = getData();
        if(!validate(data)){
          showStatus('err', 'الرجاء تعبئة الحقول الإلزامية (*).', "Merci de remplir les champs obligatoires (*).");
          return;
        }
        const msg = isFr
          ? `Nouvelle demande de réservation — Chef Aymen\n\nNom : ${data.name}\nTéléphone : ${data.phone}\nDate : ${data.date}\nInvités : ${data.guests}\nType : ${data.type}\nMenu : ${data.menu}\nNotes : ${data.notes || '—'}`
          : `طلب حجز جديد — الشاف أيمن\n\nالاسم: ${data.name}\nالهاتف: ${data.phone}\nالتاريخ: ${data.date}\nعدد الضيوف: ${data.guests}\nنوع المناسبة: ${data.type}\nالقائمة: ${data.menu}\nملاحظات: ${data.notes || '—'}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    }
  }
})();
