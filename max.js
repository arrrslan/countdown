document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('maximizeBtn');
    
    if (!btn) return;

    // --- State & Variables ---
    let currentTx = 0;
    let currentTy = 0;
    
    let isChasing = false; 
    let isReturning = false; // Flag for smooth reset
    let mouseX = 0;
    let mouseY = 0;
    
    let stopTimer = null;

    // --- Helper Functions ---

    // Reset Logic
    function resetPosition() {
        isReturning = true; // Pause physics loop
        
        // Visual Reset
        btn.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        btn.style.transform = 'translate(0px, 0px) scale(1)';
        
        // Logical Reset (Target)
        currentTx = 0;
        currentTy = 0;
    }

    // Schedule Reset
    function scheduleReset() {
        if (stopTimer) clearTimeout(stopTimer);
        
        // Don't reset if chasing (Zombie mode should be persistent)
        if (isChasing) return;

        // Reset to original position after 3 seconds of inactivity
        stopTimer = setTimeout(resetPosition, 3000); 
    }

    // Initialize timer
    scheduleReset();

    // --- Event Listeners ---

    // Toggle Chase Mode
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key.toLowerCase() === 'x') {
            isChasing = !isChasing;
            if (isChasing) {
                // Enter Chase Mode
                if (stopTimer) clearTimeout(stopTimer);
                isReturning = false; // Force wake up

                // btn.style.borderColor = '#ff0055';
                btn.style.boxShadow = '0 0 11px #ff0055';
                btn.innerHTML = '<i class="fas fa-skull fa-fade"></i>'; 
            } else {
                // Exit Chase Mode
                scheduleReset();

                btn.style.borderColor = '';
                btn.style.boxShadow = '';
                btn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    });

    // Track Mouse
    window.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('maximize-mode')) return;
        
        // If we were returning home and user moved mouse, WAKE UP smoothly
        if (isReturning) {
            // Read current visual position to prevent snapping
            const style = window.getComputedStyle(btn);
            const matrix = new DOMMatrix(style.transform);
            currentTx = matrix.m41;
            currentTy = matrix.m42;
            
            isReturning = false; // Resume physics
        }

        mouseX = e.clientX;
        mouseY = e.clientY;
        scheduleReset(); 
    });

    // Handle Resize
    window.addEventListener('resize', resetPosition);

    // --- Game Loop ---
    function update() {
        requestAnimationFrame(update);

        if (document.body.classList.contains('maximize-mode')) return;
        if (isReturning) return; // Skip physics if resetting
        
        // Button Data
        const btnRect = btn.getBoundingClientRect();
        const btnCtx = btnRect.left + btnRect.width / 2;
        const btnCty = btnRect.top + btnRect.height / 2;

        const dx = mouseX - btnCtx;
        const dy = mouseY - btnCty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (isChasing && dist < 5) return; 

        let moveX = 0;
        let moveY = 0;
        let shouldMove = false;

        // --- BEHAVIORS ---
        if (isChasing) {
            // ZOMBIE CHASE
            const speed = 5; 
            if (dist > 0) {
                moveX = (dx / dist) * speed;
                moveY = (dy / dist) * speed;
                shouldMove = true;
            }
        } else {
             // RUN AWAY Mode
             const safeRadius = 150;
             if (dist < safeRadius && dist > 0) {
                 const force = (safeRadius - dist) * 0.15; 
                 moveX = -(dx / dist) * force;
                 moveY = -(dy / dist) * force;
                 shouldMove = true;
             }
        }

        if (shouldMove) {
            let nextTx = currentTx + moveX;
            let nextTy = currentTy + moveY;

            // --- HARD CLAMPING ---
            const baseLeft = btnRect.left - currentTx;
            const baseTop = btnRect.top - currentTy;
            
            const padding = 20;
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const btnW = btnRect.width;
            const btnH = btnRect.height;
            
            const pLeft = baseLeft + nextTx;
            const pTop = baseTop + nextTy;
            
            if (pLeft < padding) { 
                nextTx = padding - baseLeft; 
            } else if (pLeft + btnW > winW - padding) {
                nextTx = (winW - padding - btnW) - baseLeft;
            }

            if (pTop < padding) {
                nextTx = nextTx; 
                nextTy = padding - baseTop;
            } else if (pTop + btnH > winH - padding) {
                nextTy = (winH - padding - btnH) - baseTop;
            }

            currentTx = nextTx;
            currentTy = nextTy;
            
            btn.style.transition = 'none';
            btn.style.transform = `translate(${currentTx}px, ${currentTy}px) scale(1.1)`;
        }
    }

    // Start Loop
    update();
});
