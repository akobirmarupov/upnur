/* Ariza formasi: tekshirish, telefon niqobi va Telegram'ga yuborish */
(function () {
  "use strict";
  var form = document.getElementById("ariza-form");
  if (!form) return;

  var cfg = window.UPNUR_CONFIG || {};
  var COURSES = { python: "🐍 Python", matematika: "📐 Matematika", ingliz: "🇬🇧 Ingliz tili" };
  var COOLDOWN_MS = 60 * 1000; // bir qurilmadan ketma-ket ariza oralig'i
  var phone = form.querySelector("#phone");
  var alertBox = form.querySelector(".form-alert");
  var submitBtn = form.querySelector("button[type=submit]");

  // ?kurs=python bo'lsa — kurs oldindan tanlanadi
  var pre = new URLSearchParams(location.search).get("kurs");
  if (pre && COURSES[pre]) {
    var r = form.querySelector('input[name=kurs][value="' + pre + '"]');
    if (r) r.checked = true;
  }

  // Telefon: (90) 123-45-67
  function digits(v) { return (v || "").replace(/\D/g, ""); }
  function formatPhone(d) {
    d = d.slice(0, 9);
    var out = "";
    if (d.length > 0) out = "(" + d.slice(0, 2);
    if (d.length >= 2) out += ") ";
    if (d.length > 2) out += d.slice(2, 5);
    if (d.length > 5) out += "-" + d.slice(5, 7);
    if (d.length > 7) out += "-" + d.slice(7, 9);
    return out;
  }
  phone.addEventListener("input", function () {
    var d = digits(phone.value);
    if (d.indexOf("998") === 0 && d.length > 9) d = d.slice(3); // +998 bilan qo'yilsa
    phone.value = formatPhone(d);
  });

  function setError(name, msg) {
    var field = form.querySelector('[data-field="' + name + '"]');
    if (!field) return;
    field.classList.toggle("is-error", !!msg);
    var e = field.querySelector(".err");
    if (e && msg) e.textContent = msg;
  }

  function validate() {
    var ok = true;
    var nameRe = /^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ'‘’`\- ]{2,40}$/;
    var ism = form.ism.value.trim(), fam = form.familiya.value.trim();
    if (!nameRe.test(ism)) { setError("ism", "Ismingizni to‘g‘ri kiriting"); ok = false; } else setError("ism");
    if (!nameRe.test(fam)) { setError("familiya", "Familiyangizni to‘g‘ri kiriting"); ok = false; } else setError("familiya");
    if (digits(phone.value).length !== 9) { setError("phone", "Telefon raqamini to‘liq kiriting: (90) 123-45-67"); ok = false; } else setError("phone");
    if (!form.querySelector("input[name=kurs]:checked")) { setError("kurs", "Kursni tanlang"); ok = false; } else setError("kurs");
    return ok;
  }
  form.addEventListener("input", function (e) {
    var f = e.target.closest("[data-field]");
    if (f && f.classList.contains("is-error")) validate();
  });
  form.addEventListener("change", function (e) {
    if (e.target.name === "kurs") setError("kurs");
  });

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function showAlert(msg) { alertBox.textContent = msg; alertBox.classList.add("is-error"); }
  function hideAlert() { alertBox.classList.remove("is-error"); }

  function lastSent() { try { return +localStorage.getItem("upnur_ariza_at") || 0; } catch (e) { return 0; } }
  function markSent() { try { localStorage.setItem("upnur_ariza_at", String(Date.now())); } catch (e) { /* bo'lmasa ham mayli */ } }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideAlert();
    if (form.website && form.website.value) return; // bot-spam tuzog'i
    if (!validate()) {
      var first = form.querySelector(".is-error input");
      if (first) first.focus();
      return;
    }
    if (!cfg.BOT_TOKEN || !cfg.CHAT_ID) {
      showAlert("Ariza qabul qilish hali sozlanmagan. Iltimos, birozdan so‘ng urinib ko‘ring.");
      return;
    }
    var wait = COOLDOWN_MS - (Date.now() - lastSent());
    if (wait > 0) {
      showAlert("Arizangiz yuborilgan. Yana yuborish uchun " + Math.ceil(wait / 1000) + " soniya kuting.");
      return;
    }

    var kurs = form.querySelector("input[name=kurs]:checked").value;
    var tel = "+998 " + phone.value;
    var now = new Date();
    var text =
      "📝 <b>Yangi ariza — Upnur</b>\n\n" +
      "👤 <b>" + esc(form.ism.value.trim()) + " " + esc(form.familiya.value.trim()) + "</b>\n" +
      "📞 <a href=\"tel:+998" + digits(phone.value) + "\">" + esc(tel) + "</a>\n" +
      "📚 Kurs: <b>" + esc(COURSES[kurs]) + "</b>\n" +
      "🕒 " + now.toLocaleDateString("ru-RU") + " " + now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) + "\n" +
      "🌐 Sayt orqali";

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");

    // x-www-form-urlencoded — brauzer qo'shimcha (preflight) so'rov yubormaydi
    var params = new URLSearchParams({ chat_id: cfg.CHAT_ID, text: text, parse_mode: "HTML", disable_web_page_preview: "true" });
    fetch("https://api.telegram.org/bot" + cfg.BOT_TOKEN + "/sendMessage", { method: "POST", body: params })
      .then(function (res) { return res.json().catch(function () { return { ok: res.ok }; }); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error((data && data.description) || "send failed");
        markSent();
        form.querySelector(".form-body").hidden = true;
        var s = document.querySelector(".success");
        s.querySelector("[data-name]").textContent = form.ism.value.trim();
        s.querySelector("[data-course]").textContent = COURSES[kurs];
        s.classList.add("is-shown");
        s.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function () {
        showAlert("Ariza yuborilmadi. Internet aloqangizni tekshirib, qaytadan urinib ko‘ring.");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
      });
  });

  var again = document.querySelector("[data-again]");
  if (again) again.addEventListener("click", function () {
    form.reset();
    form.querySelector(".form-body").hidden = false;
    document.querySelector(".success").classList.remove("is-shown");
  });
})();
