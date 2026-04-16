// theme.js
// 1. Initialisation immédiate du thème pour éviter le clignotement
if (localStorage.getItem('tiwash_theme') === 'dark' || (!('tiwash_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Injection des styles pour le premium View Transitions effect
const style = document.createElement('style');
style.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation: none;
        mix-blend-mode: normal;
    }
    ::view-transition-old(root) {
        z-index: 1;
    }
    ::view-transition-new(root) {
        z-index: 2;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    // 2. Injection du bouton Switch
    const targetContainers = document.querySelectorAll('#theme-toggle-container, header .max-w-7xl > .flex > .flex:last-child, header .max-w-7xl > .flex');
    
    // Prendre le premier conteneur valide trouvé
    const container = Array.from(targetContainers).find(c => c !== null);
    
    if (container && !container.querySelector('.theme-toggle')) {
        const btn = document.createElement('button');
        btn.className = 'theme-toggle ml-4 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shrink-0 outline-none focus:ring-2 focus:ring-brand-blue/50 overflow-hidden relative shadow-inner';
        btn.innerHTML = `
            <div class="relative w-full h-full flex items-center justify-center">
                <i class="fa-solid fa-moon text-lg transition-all duration-500 absolute scale-100 rotate-0 dark:scale-0 dark:rotate-90"></i>
                <i class="fa-solid fa-sun text-lg transition-all duration-500 absolute scale-0 -rotate-90 dark:scale-100 dark:rotate-0 text-yellow-400"></i>
            </div>
        `;
        btn.ariaLabel = "Basculer le thème";
        
        btn.onclick = (e) => {
            e.preventDefault();
            
            const toggleTheme = () => {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('tiwash_theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('tiwash_theme', 'dark');
                }
            };

            // Si le navigateur ne supporte pas View Transitions, fallback classique avec transition native
            if (!document.startViewTransition) {
                toggleTheme();
                return;
            }

            // Récupérer les coordonnées du clic
            const x = e.clientX !== undefined ? e.clientX : window.innerWidth / 2;
            const y = e.clientY !== undefined ? e.clientY : window.innerHeight / 2;
            
            // Calculer le rayon maximum pour couvrir l'écran
            const endRadius = Math.hypot(
                Math.max(x, innerWidth - x),
                Math.max(y, innerHeight - y)
            );

            // Démarrer la transition fluide
            const transition = document.startViewTransition(() => {
                toggleTheme();
            });

            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ];
                
                document.documentElement.animate(
                    {
                        clipPath: clipPath,
                    },
                    {
                        duration: 500,
                        easing: 'ease-out',
                        pseudoElement: '::view-transition-new(root)',
                    }
                );
            });
        };
        
        container.appendChild(btn);
    }
});
