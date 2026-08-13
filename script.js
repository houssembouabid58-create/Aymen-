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
  function openMenu(){
    if(mobileMenu) mobileMenu.classList.add('open');
    if(mobileOverlay) mobileOverlay.classList.add('open');
  }
  window.toggleMobileMenu = function(){
    if(!mobileMenu) return;
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  };
  if(burger && mobileMenu){
    burger.addEventListener('click', openMenu);
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
     Booking form — sends directly via WhatsApp + Email
     (works immediately, no backend required)
     ========================================================= */
  const WHATSAPP_NUMBER = "213792289766";
  const OWNER_EMAIL = "houssembouabid418@gmail.com";

  /* EmailJS config — استبدل هذه القيم الثلاث بمفاتيحك من حسابك على emailjs.com
     شرح كيفية الحصول عليها موجود في الرسالة المرفقة معك */
  const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

  if(window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY"){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    const statusBox = document.getElementById('formStatus');
    const whatsappBtn = document.getElementById('submitWhatsapp');
    const emailBtn = document.getElementById('submitEmail');

    function showStatus(type, msgAr, msgFr){
      if(!statusBox) return;
      const isFr = html.classList.contains('lang-fr');
      statusBox.textContent = isFr ? msgFr : msgAr;
      statusBox.className = 'form-status show ' + type;
    }

    function getData(){
      const isFr = html.classList.contains('lang-fr');
      const typeSel = document.getElementById('f_type');
      const placeSel = document.getElementById('f_place_type');
      const checkedDishes = Array.from(document.querySelectorAll('input[name="dish"]:checked')).map(cb => cb.value);
      return {
        name: document.getElementById('f_name').value.trim(),
        phone: document.getElementById('f_phone').value.trim(),
        date: document.getElementById('f_date').value,
        guests: document.getElementById('f_guests').value.trim(),
        type: typeSel.options[typeSel.selectedIndex].getAttribute(isFr ? 'data-fr' : 'data-ar'),
        placeType: placeSel.options[placeSel.selectedIndex].getAttribute(isFr ? 'data-fr' : 'data-ar'),
        placeName: document.getElementById('f_place_name').value.trim(),
        dishes: checkedDishes,
        notes: document.getElementById('f_notes').value.trim(),
      };
    }

    function validate(data){
      return data.name && data.phone && data.date && data.guests;
    }

    function buildMessage(data, isFr){
      const dishesText = data.dishes.length
        ? data.dishes.join('، ')
        : (isFr ? 'غير محدد — Non spécifié' : 'غير محدد');
      if(isFr){
        return `Nouvelle demande de réservation — Chef Aymen\n\n` +
          `Nom : ${data.name}\nTéléphone : ${data.phone}\nDate : ${data.date}\nInvités : ${data.guests}\n` +
          `Type d'événement : ${data.type}\nLieu : ${data.placeType}${data.placeName ? ' - ' + data.placeName : ''}\n` +
          `Plats choisis : ${dishesText}\nNotes : ${data.notes || '—'}`;
      }
      return `طلب حجز جديد — الشاف أيمن\n\n` +
        `الاسم: ${data.name}\nالهاتف: ${data.phone}\nالتاريخ: ${data.date}\nعدد الضيوف: ${data.guests}\n` +
        `نوع المناسبة: ${data.type}\nمكان المناسبة: ${data.placeType}${data.placeName ? ' - ' + data.placeName : ''}\n` +
        `الأطباق المختارة: ${dishesText}\nملاحظات: ${data.notes || '—'}`;
    }

    if(whatsappBtn){
      whatsappBtn.addEventListener('click', () => {
        const isFr = html.classList.contains('lang-fr');
        const data = getData();
        if(!validate(data)){
          showStatus('err', 'الرجاء تعبئة الحقول الإلزامية (*).', "Merci de remplir les champs obligatoires (*).");
          return;
        }

        const msg = buildMessage(data, isFr);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

        showStatus('ok',
          'تم فتح واتساب برسالتكم — أكملوا الإرسال من هناك وسنتواصل معكم قريباً.',
          'WhatsApp s\'est ouvert avec votre message — finalisez l\'envoi, nous vous contacterons bientôt.');
      });
    }

    if(emailBtn){
      emailBtn.addEventListener('click', () => {
        const isFr = html.classList.contains('lang-fr');
        const data = getData();
        if(!validate(data)){
          showStatus('err', 'الرجاء تعبئة الحقول الإلزامية (*).', "Merci de remplir les champs obligatoires (*).");
          return;
        }

        const msg = buildMessage(data, isFr);
        const subject = isFr ? "Demande de réservation - Chef Aymen" : "طلب حجز - الشاف أيمن";

        if(!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY"){
          // إعداد EmailJS لم يكتمل بعد — رجوع مؤقت لفتح تطبيق البريد
          window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
          return;
        }

        emailBtn.disabled = true;
        showStatus('ok',
          'جارٍ إرسال طلبكم عبر البريد الإلكتروني...',
          'Envoi de votre demande par e-mail en cours...');

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: OWNER_EMAIL,
          subject: subject,
          message: msg,
          from_name: data.name,
          from_phone: data.phone,
        }).then(() => {
          emailBtn.disabled = false;
          showStatus('ok',
            'تم إرسال طلبكم بنجاح عبر البريد الإلكتروني — سنتواصل معكم قريباً.',
            'Votre demande a été envoyée par e-mail avec succès — nous vous contacterons bientôt.');
        }).catch(() => {
          emailBtn.disabled = false;
          showStatus('err',
            'تعذّر إرسال البريد الإلكتروني، الرجاء المحاولة مجدداً أو التواصل عبر واتساب.',
            "Échec de l'envoi de l'e-mail, veuillez réessayer ou nous contacter via WhatsApp.");
        });
      });
    }
  }
})();
