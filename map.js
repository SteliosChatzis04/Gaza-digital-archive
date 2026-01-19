document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. MAP & ACCESSIBILITY MODAL LOGIC
    // ==========================================
    const map = L.map('map').setView([31.40, 34.38], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const hotspots = [
        {
            name: "Gaza City",
            coords: [31.5017, 34.4668],
            desc: "Once the most densely populated area, Gaza City has faced extensive bombardment, resulting in the destruction of major hospitals like Al-Shifa.",
            img: "Images/GazaCity.jpg"
        },
        {
            name: "Khan Yunis",
            coords: [31.3444, 34.3031],
            desc: "A major southern city that became a primary combat zone in early 2024. The Nasser Medical Complex was rendered non-functional.",
            img: "Images/KhanYunis.jpg"
        },
        {
            name: "Rafah",
            coords: [31.2809, 34.2520],
            desc: "Located on the Egyptian border, Rafah became the last refuge for over 1.4 million displaced people.",
            img: "Images/Rafah.jpg"
        },
        {
            name: "Jabalia Camp",
            coords: [31.5290, 34.4850],
            desc: "The largest of Gaza's refugee camps, historically home to over 100,000 people. Site of multiple large-scale airstrikes.",
            img: "Images/Jabalyia.jpg" 
        },
        {
            name: "Deir al-Balah",
            coords: [31.4170, 34.3510],
            desc: "Located in central Gaza, saw a massive influx of displaced families fleeing both the north and Rafah.",
            img: "Images/Balah.jpg"
        }
    ];

    hotspots.forEach(spot => {
        const marker = L.marker(spot.coords).addTo(map);

        // Αντί για απλό popup, ανοίγουμε το Modal για καλύτερο UX/Accessibility
        marker.on('click', function() {
            document.getElementById('mapModalLabel').innerText = spot.name;
            
            let content = '';
            if (spot.img) {
                content += `<img src="${spot.img}" class="img-fluid rounded mb-3" alt="${spot.name}" style="width:100%; max-height:350px; object-fit:cover;">`;
            }
            content += `<p class="lead">${spot.desc}</p>`;
            
            document.getElementById('mapModalBody').innerHTML = content;

            // Εμφάνιση του Bootstrap Modal
            const myModal = new bootstrap.Modal(document.getElementById('mapModal'));
            myModal.show();
        });
    });

    // ==========================================
    // 2. SCROLL REVEAL ANIMATION
    // ==========================================
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100; // Απόσταση από το κάτω μέρος

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);
    // Τρέξε το μια φορά στην αρχή μήπως κάτι φαίνεται ήδη
    reveal();

    // ==========================================
    // 3. BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 4. DONATION FORM FEEDBACK
    // ==========================================
    const donateForm = document.getElementById('donateForm');
    if (donateForm) {
        donateForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Σταματάει το reload

            // Προσομοίωση αποστολής (UX Feedback)
            const originalContent = donateForm.innerHTML;
            donateForm.innerHTML = `
                <div class="text-center py-5 fade-in">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                    <h3 class="mt-3 fw-bold">Thank You!</h3>
                    <p class="lead">Your donation has been recorded.</p>
                    <button class="btn btn-outline-dark btn-sm mt-3" onclick="location.reload()">Donate Again</button>
                </div>
            `;
        });
    }
});

    // ==========================================
    // 5. DONATION PROGRESS BAR SIMULATION
    // ==========================================
    const goalAmount = 1000;   // Ο υποθετικός στόχος μας (1000€)
    const baseAmount = 600;    // Το ποσό που έχουμε ήδη "μαζέψει" (600€)
    
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const amountRadios = document.querySelectorAll('input[name="amount"]');

    if (progressBar && progressText) {
        amountRadios.forEach(radio => {
            radio.addEventListener('change', function(e) {
                // Βρίσκουμε ποιο ποσό διάλεξε ο χρήστης από το ID του κουμπιού
                let selectedAmount = 0;
                if (this.id === 'amount5') selectedAmount = 5;
                if (this.id === 'amount10') selectedAmount = 10;
                if (this.id === 'amount20') selectedAmount = 20;
                if (this.id === 'amount50') selectedAmount = 50;

                // Υπολογίζουμε το νέο σύνολο
                const currentTotal = baseAmount + selectedAmount;
                
                // Υπολογίζουμε το ποσοστό (max 100%)
                let percentage = (currentTotal / goalAmount) * 100;
                if (percentage > 100) percentage = 100;

                // Ενημερώνουμε την μπάρα και το κείμενο
                progressBar.style.width = percentage + "%";
                progressText.innerText = Math.round(percentage) + "% of goal achieved! (+" + selectedAmount + "€)";
                
                // Προαιρετικό: Αλλάζουμε χρώμα αν φτάσει κοντά στο 100%
                if (percentage >= 90) {
                    progressBar.classList.add('bg-success');
                    progressBar.classList.remove('bg-primary');
                } else {
                    progressBar.classList.add('bg-primary');
                    progressBar.classList.remove('bg-success');
                }
            });
        });
    }