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

const tl = gsap.timeline({
  id: "text-scramble",
  defaults: { ease: "none" }
});

const cursorTl = gsap.timeline({ repeat: -1 });

gsap.set("#scramble-text-original", {
  opacity: 0
});

cursorTl
  .to("#scramble-cursor", {
    opacity: 0,
    duration: 0.5,
    ease: "none",
    delay: 0.2
  })
  .to("#scramble-cursor", {
    opacity: 1,
    duration: 0.5,
    ease: "none",
    delay: 0.2
  });
// Pastikan cursorTl sudah didefinisikan sebelumnya

tl.to("#scramble-text-1", {
  scrambleText: {
    // Identitas utama: Menggabungkan role teknis (Frontend) dengan minat (Data)
    text: "Frontend Developer & Data Enthusiast", 
    chars: "lowerCase", // Konsisten lowercase agar bersih
    speed: 0.4
  },
  duration: 2
})
.to("#scramble-text-2", {
  scrambleText: {
    // Menjelaskan SPESIALISASI: Bukan sekadar bikin web, tapi web yang berbasis data
    text: "crafting data-driven web interfaces,",
    chars: "lowerCase",
    speed: 0.4
  },
  duration: 2
})
.to("#scramble-text-3", {
  scrambleText: { 
    // Menunjukkan kemampuan analisis/visualisasi (Big Data context)
    text: "visualizing complex information,", 
    chars: "lowerCase",
    speed: 0.4
  },
  duration: 2
})
.to("#scramble-text-4", {
  scrambleText: { 
    // Jembatan antara coding dan data (Analyst context)
    text: "bridging code with analytics", 
    chars: "lowerCase", 
    speed: 0.4 
  },
  duration: 1.5
})
.to("#scramble-text-5", {
  scrambleText: {
    // Hasil akhir: User Experience yang cerdas
    text: "for smarter user experiences.",
    chars: "lowerCase",
    speed: 0.4
  },
  duration: 1.5
})
.add(cursorTl);

window.onclick = () => tl.play(0); // click to replay

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
            // Template Literal (Backticks) untuk HTML
            const projectHTML = `
                <div onclick="window.location.href='projek.html?id=${project.id}'" 
                    class="aspect-square bg-no-repeat bg-cover bg-center rounded-lg relative cursor-pointer group hover:shadow-xl transition-all"
                    style="background-image: url('${bgImage}');">
                    
                    <div class="bg-white w-10/12 rounded-md absolute bottom-5 left-1/2 -translate-x-1/2 py-3 px-5 flex items-center justify-between duration-500 group-hover:bottom-7 shadow-md">
                        <div class="overflow-hidden pr-2">
                            <h2 class="font-semibold text-sm truncate" title="${project.title}">
                                ${project.title}
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
// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadProjects);