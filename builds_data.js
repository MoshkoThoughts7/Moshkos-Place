const buildsData = [
    {
        image: "images/pizza-man.jpg",
        title: "The Pizza Man",
        description: "A man spinning pizza dough."
    },
    {
        image: "images/Moshko-fire-bender.jpg",
        title: "Fire Bender",
        description: "A man fire bending from a volcano."
    },
    {
        image: "images/avatar-ang-final.jpg",
        title: "The Avatar State",
        description: "Avatar aang in his famous bending pose."
    },
    {
        image: "images/mountain-trees.jpg",
        title: "Mountain forest",
        description: "A nature scene with a mountain in the middl of a forest."
    }
];

function renderBuilds() {
    const gallery = document.querySelector('.minecraft-gallery');
    if (!gallery) return;

    gallery.innerHTML = buildsData.map(build => `
        <div class="gallery-item glass-card" data-aos="fade-up" style="flex: 0 1 30%; min-width: 320px; padding: 10px !important; overflow: hidden; display: flex; flex-direction: column; align-self: flex-start;">
            <img src="${build.image}" alt="${build.title}" style="width: 100%; height: auto; border-radius: 12px; display: block;">
            <div class="gallery-overlay">
                <h3>${build.title}</h3>
                <p>${build.description}</p>
            </div>
        </div>
    `).join('');
}

// Run on initial page load
document.addEventListener('DOMContentLoaded', renderBuilds);

// Also run when navigating via SPA routing
window.addEventListener('page-load', renderBuilds);
