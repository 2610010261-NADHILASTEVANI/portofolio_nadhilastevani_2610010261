/* =========================================================
   HMP-TI ITS - Katalog Unit Usaha
   Interaktivitas: boot log, modal detail, menu mobile, jam
   ========================================================= */

// ---------- 1. Data detail tiap unit (edit sesuai info asli) ----------
const unitData = {
  fnb: {
    file: "RAM_FNB.exe",
    title: "Unit F&B",
    desc: "Aneka minuman dingin, kopi sachet, dan camilan untuk mahasiswa.",
    hours: "Hari kuliah, sekitar 08.00 - 16.00 WIB (sesuaikan)",
    how: "Datang langsung ke ruang HMP-TI dan sebutkan pesananmu.",
    contact: "Instagram @its_hmpti"
  },
  percetakan: {
    file: "HDD_PERCETAKAN.exe",
    title: "Unit Percetakan & Dokumen",
    desc: "Print, fotokopi, penjilidan, print stiker, dan pengetikan dokumen.",
    hours: "Hari kuliah, sekitar 08.00 - 16.00 WIB (sesuaikan)",
    how: "Bawa file lewat flashdisk atau kirim lewat chat sebelum datang.",
    contact: "Instagram @its_hmpti"
  },
  konsinyasi: {
    file: "USB_KONSINYASI.exe",
    title: "Unit Konsinyasi",
    desc: "Titip jual produk mahasiswa. Produkmu dipajang dan dijual oleh pengurus.",
    hours: "Hari kuliah, sekitar 08.00 - 16.00 WIB (sesuaikan)",
    how: "Hubungi pengurus, kirim foto produk dan harga, lalu atur jadwal penitipan.",
    contact: "Instagram @its_hmpti"
  },
  kreatif: {
    file: "GPU_KREATIF.exe",
    title: "Unit Jasa Kreatif",
    desc: "Desain grafis, photo dan video editing, serta pembuatan web sederhana.",
    hours: "Fleksibel, sesuai kesepakatan dengan pengurus (sesuaikan)",
    how: "Kirim brief singkat: kebutuhan, tenggat, dan referensi yang kamu suka.",
    contact: "Instagram @its_hmpti"
  },
  umum: {
    file: "kontak.txt",
    title: "Kontak HMP-TI",
    desc: "Tanya apa saja soal unit usaha HMP-TI, mulai dari harga sampai jadwal.",
    hours: "Hari kuliah, sekitar 08.00 - 16.00 WIB (sesuaikan)",
    how: "Kirim pesan lewat Instagram atau datang langsung ke ruang HMP-TI.",
    contact: "Instagram @its_hmpti"
  }
};

// ---------- 2. Efek mengetik: log boot ala BIOS ----------
const typedEl = document.getElementById("typedCode");

// Tiap baris terdiri dari potongan teks [kelas warna, teks]
const bootLines = [
  [["tk-hi", "HMP-TI BIOS v2026.11"]],
  [["tk-dim", "Memeriksa memori.......... "], ["tk-ok", "OK"]],
  [["tk-dim", "Memuat unit usaha:"]],
  [["", "  [ "], ["tk-ok", "OK"], ["", " ] F&B"]],
  [["", "  [ "], ["tk-ok", "OK"], ["", " ] Percetakan & Dokumen"]],
  [["", "  [ "], ["tk-ok", "OK"], ["", " ] Konsinyasi"]],
  [["", "  [ "], ["tk-ok", "OK"], ["", " ] Jasa Kreatif"]],
  [["tk-hi", "C:\\HMP-TI> "], ["", "katalog.exe"]]
];

function typeBoot() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ratakan semua baris menjadi antrean potongan teks
  const queue = [];
  bootLines.forEach((line, i) => {
    line.forEach(([cls, text]) => queue.push({ cls, text }));
    if (i < bootLines.length - 1) queue.push({ cls: "", text: "\n" });
  });

  let seg = 0;
  let pos = 0;
  let span = null;

  function step() {
    if (seg >= queue.length) return;
    const current = queue[seg];

    if (!span) {
      span = document.createElement("span");
      if (current.cls) span.className = current.cls;
      typedEl.appendChild(span);
    }

    // Pengguna yang mematikan animasi langsung melihat hasil akhir
    if (reduce) {
      span.textContent = current.text;
      seg++;
      span = null;
      step();
      return;
    }

    span.textContent += current.text.charAt(pos);
    pos++;

    if (pos >= current.text.length) {
      seg++;
      pos = 0;
      span = null;
    }
    setTimeout(step, 26);
  }

  step();
}

// ---------- 3. Modal detail ----------
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
let lastFocused = null;

function openModal(key) {
  const data = unitData[key];
  if (!data) return;

  document.getElementById("modalFile").textContent = data.file;
  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalDesc").textContent = data.desc;
  document.getElementById("modalHours").textContent = data.hours;
  document.getElementById("modalHow").textContent = data.how;
  document.getElementById("modalContact").textContent = data.contact;

  lastFocused = document.activeElement;
  modal.hidden = false;
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  if (lastFocused) lastFocused.focus();
}

// Semua tombol dengan atribut data-unit membuka modal
document.querySelectorAll("[data-unit]").forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.dataset.unit));
});

modalClose.addEventListener("click", closeModal);

// Klik area gelap di luar jendela menutup modal
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// ---------- 4. Menu navigasi mobile ----------
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- 5. Jam di taskbar ----------
const clockEl = document.getElementById("clock");

function updateClock() {
  clockEl.textContent = new Date().toLocaleTimeString("id-ID", { hour12: false });
}

// ---------- Jalankan ----------
typeBoot();
updateClock();
setInterval(updateClock, 1000);