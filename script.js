
// ===== PDF.js SETUP ====
let pdfjsLib;




document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
})
const navbar = document.getElementById("navbar");
const navLink = document.getElementById("navLink");
const mobileMenu = document.getElementById("mobileMenu");

function openMenu() {
    mobileMenu.style.transform = 'translateX(-16rem)';
}

function closeMenu() {
    mobileMenu.style.transform = 'translateX(0)';
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');

    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
}

window.addEventListener('scroll', () => {
    if (scrollY > 50) {
        navbar.classList.add('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm', 'dark:bg-darkTheme', 'dark:shadow-white/20');
        navLink.classList.remove('bg-white', 'shadow-sm', 'bg-opacity-50', 'dark:border', 'dark:border-white/30', "dark:bg-transparent");
    } else {
        navbar.classList.remove('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm', 'dark:bg-darkTheme', 'dark:shadow-white/20');
        navLink.classList.add('bg-white', 'shadow-sm', 'bg-opacity-50', 'dark:border', 'dark:border-white/30', "dark:bg-transparent");
    }
})
gsap.registerPlugin(ScrambleTextPlugin);

gsap.set("#scramble-text-original", { opacity: 0 });
gsap.set("#scramble-cursor", { opacity: 0 });

// Cursor kedip — mulai setelah teks selesai
const cursorTl = gsap.timeline({ repeat: -1, paused: true });
cursorTl
  .to("#scramble-cursor", { opacity: 0, duration: 0.45, ease: "none" })
  .to("#scramble-cursor", { opacity: 1, duration: 0.45, ease: "none" });

// Timeline utama
const tl = gsap.timeline({ defaults: { ease: "none" } });

tl
  // 1. Munculkan kursor dulu sebelum teks mulai
  .to("#scramble-cursor", { opacity: 1, duration: 0.3 })

  // 2. Scramble teks satu per satu
  .to("#scramble-text-1", {
    scrambleText: { text: "Frontend Developer & Data Enthusiast", chars: "lowerCase", speed: 0.45 },
    duration: 2
  })
  .to("#scramble-text-2", {
    scrambleText: { text: "\n crafting data-driven web interfaces,", chars: "lowerCase", speed: 0.45 },
    duration: 2
  })
  .to("#scramble-text-3", {
    scrambleText: { text: "\n visualizing complex information,", chars: "lowerCase", speed: 0.45 },
    duration: 1.8
  })
  .to("#scramble-text-4", {
    scrambleText: { text: "\n bridging code with analytics", chars: "lowerCase", speed: 0.45 },
    duration: 1.5
  })
  .to("#scramble-text-5", {
    scrambleText: { text: "\n for smarter user experiences.", chars: "lowerCase", speed: 0.45 },
    duration: 1.5
  })

  // 3. Setelah teks selesai, munculkan tombol CTA dengan slide up
  .to("#home-cta", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out"
  }, "+=0.3")

  // 4. Aktifkan kedip kursor
  .add(() => cursorTl.play());

gsap.set("#home-cta", { opacity: 0, y: 20 });

// Replay HANYA saat klik di area teks scramble, bukan seluruh halaman
document.querySelector('.text-scramble__content').addEventListener('click', () => {
  // Reset semua span
  ['1','2','3','4','5'].forEach(n => {
    document.getElementById(`scramble-text-${n}`).textContent = '';
  });
  cursorTl.pause();
  gsap.set("#home-cta", { opacity: 0, y: 20 });
  tl.restart();
});

window.onclick = () => tl.play(0); // click to replay

function truncateWords(text, maxWords = 10) {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
}


// ===== EMAILJS INIT =====
// Ganti YOUR_PUBLIC_KEY dengan Public Key dari dashboard EmailJS
emailjs.init('un2DPrD6I4QiO0T4l');

function sendEmail(event) {
    event.preventDefault();

    const form      = document.getElementById('contact-form');
    const btn       = document.getElementById('submit-btn');
    const label     = document.getElementById('submit-label');
    const icon      = document.getElementById('submit-icon');
    const status    = document.getElementById('contact-status');

    // Tampilkan loading state
    btn.disabled    = true;
    label.textContent = 'Mengirim...';
    icon.style.display = 'none';
    status.textContent = '';

    // Ganti dengan Service ID dan Template ID kamu
    emailjs.sendForm('service_i23efiw', 'template_ww86e5v', form)
        .then(() => {
            // Sukses
            status.textContent = 'Pesan berhasil dikirim! Terima kasih, saya akan segera membalas.';
            status.className   = 'mt-4 text-center text-sm text-green-600 dark:text-green-400';
            form.reset();
        })
        .catch((error) => {
            // Gagal
            console.error('EmailJS error:', error);
            status.textContent = 'Gagal mengirim pesan. Silakan coba lagi atau hubungi lewat email langsung.';
            status.className   = 'mt-4 text-center text-sm text-red-500';
        })
        .finally(() => {
            // Kembalikan tombol ke semula
            btn.disabled       = false;
            label.textContent  = 'Submit now';
            icon.style.display = '';
        });
}

// Fungsi untuk memuat data
async function loadProjects() {
    try {
        // 1. Ambil data dari file JSON
        const response = await fetch('./daftar-projek.json'); // Sesuaikan path jika perlu
        const projects = await response.json();
        // 2. Ambil elemen container
        const container = document.getElementById('project-container');
        // 3. Loop data dan buat HTML
        projects.forEach(project => {
            // Ambil gambar pertama dari array
            const bgImage = project.image[0];
            const shortTitle = truncateWords(project.title, 10);
            // Template Literal (Backticks) untuk HTML
            const projectHTML = `
                <div onclick="window.location.href='projek.html?id=${project.id}'" 
                    class="aspect-square bg-no-repeat bg-cover bg-center rounded-lg relative cursor-pointer group hover:shadow-xl transition-all"
                    style="background-image: url('${bgImage}');">
                    
                    <div class="bg-white w-10/12 rounded-md absolute bottom-5 left-1/2 -translate-x-1/2 py-3 px-5 flex items-center justify-between duration-500 group-hover:bottom-7 shadow-md">
                        <div class="overflow-hidden pr-2">
                            <h2 class="font-semibold text-sm truncate" title="${project.title}">
                                ${shortTitle}
                            </h2>
                            <p class="text-xs text-gray-700 truncate">
                                ${project.role}
                            </p>
                        </div>
                        <div class="border rounded-full border-black w-9 h-9 aspect-square flex items-center justify-center shadow-[2px_2px_0_#000] group-hover:bg-lime-300 transition shrink-0">
                            <img src="./assets/send-icon.png" alt="icon" class="w-4">
                        </div>
                    </div>
                </div>
            `;
            // 4. Masukkan ke dalam container
            container.innerHTML += projectHTML;
        });
    } catch (error) {
        console.error("Gagal memuat projek:", error);
        // Opsi: Tampilkan pesan error di layar jika data gagal dimuat
        document.getElementById('project-container').innerHTML = '<p class="text-center text-red-500">Gagal memuat data proyek.</p>';
    }
}
// ===== SCROLL REVEAL — bisa dipanggil ulang untuk elemen baru =====
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe ulang semua kartu (termasuk yang baru dirender dari JSON)
  document.querySelectorAll('.cert-card, .project-card').forEach(el => {
    // Reset dulu supaya observer bisa jalan ulang
    el.classList.remove('is-visible');
    observer.observe(el);
  });
}

// ===== FILTER SERTIFIKAT =====
function filterCerts(type, btn) {
  document.querySelectorAll('.cert-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.cert-card').forEach((card) => {
    const match = type === 'all' || card.dataset.type === type;
    if (match) {
      card.style.display = '';
      // Paksa animasi ulang supaya kartu yang muncul kembali punya efek
      card.classList.remove('is-visible');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('is-visible');
        });
      });
    } else {
      card.style.display = 'none';
    }
  });
}

// ===== LOAD SERTIFIKAT DARI JSON =====
async function loadCertificates() {
  try {
    const response = await fetch('./daftar-sertifikat.json');
    const certs = await response.json();

    const grid = document.getElementById('cert-grid');
    grid.innerHTML = '';

    certs.forEach((cert, index) => {
      const badgeClass  = cert.type === 'hki' ? 'hki-badge' : 'cert-badge-style';
      const badgeLabel  = cert.type === 'hki' ? 'HKI' : 'Sertifikat';
      const fallbackIcon = cert.type === 'hki' ? '📜' : '🏆';
      const safeTitle   = cert.title.replace(/'/g, "\\'");

      const cardHTML = `
        <div class="cert-card group"
             data-type="${cert.type}"
             data-pdf="${cert.pdf}"
             style="transition-delay: ${index * 60}ms">
          <div class="cert-img-wrapper">
            <canvas class="pdf-preview-canvas"></canvas>
            <div class="cert-pdf-loading">
              <div class="pdf-spinner"></div>
              <span class="text-xs text-gray-400 mt-2">Memuat preview...</span>
            </div>
            <div class="cert-placeholder" style="display:none">
              <span style="font-size:2.5rem">${fallbackIcon}</span>
              <span class="text-xs text-gray-400">Preview tidak tersedia</span>
            </div>
            <span class="cert-type-badge ${badgeClass}">${badgeLabel}</span>
            <div class="cert-hover-overlay" onclick="openPdfViewer('${cert.pdf}', '${safeTitle}')">
              <span class="cert-zoom-btn">📄 Lihat PDF</span>
            </div>
          </div>
          <div class="cert-body">
            <p class="cert-title">${cert.title}</p>
            <p class="cert-issuer">${cert.issuer}</p>
            <p class="cert-date">${cert.date}</p>
          </div>
        </div>
      `;

      grid.innerHTML += cardHTML;
    });

    // Setelah semua kartu masuk DOM:
    // 1. Jalankan scroll reveal untuk kartu baru
    initScrollReveal();
    // 2. Render preview PDF
    if (typeof pdfjsLib !== 'undefined') {
      renderAllPdfPreviews();
    } else {
      document.addEventListener('pdfjsReady', renderAllPdfPreviews, { once: true });
    }

  } catch (error) {
    console.error('Gagal memuat sertifikat:', error);
    document.getElementById('cert-grid').innerHTML =
      '<p class="text-center text-red-500 col-span-3">Gagal memuat data sertifikat.</p>';
  }
}

// ===== PDF.js SETUP =====
async function initPdfJs() {
  const pdfModule = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
  pdfjsLib = pdfModule;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

  // Beritahu loadCertificates bahwa PDF.js sudah siap
  document.dispatchEvent(new Event('pdfjsReady'));
  renderAllPdfPreviews();
}

// ===== RENDER PREVIEW HALAMAN 1 TIAP KARTU =====
async function renderAllPdfPreviews() {
  const cards = document.querySelectorAll('.cert-card[data-pdf]');

  cards.forEach(async (card) => {
    const pdfPath = card.dataset.pdf;
    const canvas  = card.querySelector('.pdf-preview-canvas');
    const loading = card.querySelector('.cert-pdf-loading');
    const fallback = card.querySelector('.cert-placeholder');

    try {
      const pdf = await pdfjsLib.getDocument(pdfPath).promise;
      const page = await pdf.getPage(1);

      // Hitung scale agar pas dengan wrapper
      const wrapper = card.querySelector('.cert-img-wrapper');
      const wrapperW = wrapper.clientWidth  || 300;
      const wrapperH = wrapper.clientHeight || 225;
      const viewport0 = page.getViewport({ scale: 1 });
      const scale = Math.max(wrapperW / viewport0.width, wrapperH / viewport0.height);
      const viewport = page.getViewport({ scale });

      canvas.width  = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
      }).promise;

      // Tampilkan canvas, sembunyikan loader
      loading.style.display = 'none';
      canvas.style.display  = 'block';

    } catch (err) {
      console.warn(`Gagal render preview: ${pdfPath}`, err);
      loading.style.display  = 'none';
      fallback.style.display = 'flex';
    }
  });
}

// ===== PDF VIEWER MODAL =====
let pdfViewerDoc  = null;
let pdfCurrentPage = 1;
let pdfTotalPages  = 1;

async function openPdfViewer(pdfPath, title) {
  const modal       = document.getElementById('pdf-modal');
  const modalCanvas = document.getElementById('pdf-viewer-canvas');
  const loadingEl   = document.getElementById('pdf-modal-loading');
  const titleEl     = document.getElementById('pdf-modal-title');
  const downloadBtn = document.getElementById('pdf-download-btn');

  // Reset state
  modalCanvas.style.display = 'none';
  loadingEl.style.display   = 'flex';
  titleEl.textContent       = title;
  downloadBtn.href          = pdfPath;
  downloadBtn.download      = title + '.pdf';
  pdfCurrentPage            = 1;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  try {
    pdfViewerDoc = await pdfjsLib.getDocument(pdfPath).promise;
    pdfTotalPages = pdfViewerDoc.numPages;

    document.getElementById('pdf-total-pages').textContent = pdfTotalPages;

    await renderViewerPage(pdfCurrentPage);
  } catch (err) {
    console.error('Gagal membuka PDF:', err);
    loadingEl.innerHTML = '<p class="text-red-500 text-sm">Gagal membuka dokumen.</p>';
  }
}

async function renderViewerPage(pageNum) {
  const canvas    = document.getElementById('pdf-viewer-canvas');
  const loadingEl = document.getElementById('pdf-modal-loading');

  loadingEl.style.display   = 'flex';
  canvas.style.display      = 'none';

  const page = await pdfViewerDoc.getPage(pageNum);

  // Scale: muat dalam lebar modal (~820px maks)
  const maxW    = Math.min(window.innerWidth - 80, 820);
  const vp0     = page.getViewport({ scale: 1 });
  const scale   = maxW / vp0.width;
  const viewport = page.getViewport({ scale });

  canvas.width  = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: canvas.getContext('2d'),
    viewport,
  }).promise;

  loadingEl.style.display = 'none';
  canvas.style.display    = 'block';

  // Update tombol navigasi
  document.getElementById('pdf-current-page').textContent = pageNum;
  document.getElementById('btn-prev').disabled = pageNum <= 1;
  document.getElementById('btn-next').disabled = pageNum >= pdfTotalPages;
}

function changePage(delta) {
  const newPage = pdfCurrentPage + delta;
  if (newPage < 1 || newPage > pdfTotalPages) return;
  pdfCurrentPage = newPage;
  renderViewerPage(pdfCurrentPage);
}

function closePdfViewer(event) {
  // Tutup hanya jika klik overlay, bukan konten dalam modal
  if (event && event.target !== document.getElementById('pdf-modal')) return;
  const modal = document.getElementById('pdf-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  pdfViewerDoc = null;
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  loadProjects();
  loadCertificates();
  initPdfJs();
});


