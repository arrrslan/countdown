        // --------------------------------------------------------------
        //  CONFIGURATION SECTION
        // --------------------------------------------------------------
        
        // DEFAULT VALUES
        const defaultDate = "January 16, 2026";
        const defaultTime = "00:00:00"; 
        const defaultName = "My Birthday";
        const defaultCele = "It's my Birthday";

        // Load from LocalStorage or use Default
        let eventDate = localStorage.getItem('eventDate') || defaultDate;
        let eventTime = localStorage.getItem('eventTime') || defaultTime;
        let eventName = localStorage.getItem('eventName') || defaultName;
        let eventCele = localStorage.getItem('eventCele') || defaultCele;
        
        const confettiPopCount = 5;              // How many times to pop confetti
        const confettiDelay = 7000;              // Delay between pops in ms
        
        // --------------------------------------------------------------
        // Emojies: 🎉🥳🎊✨🎁🎈🎂

        // Update Headline
        const headline = document.getElementById('headline');
        headline.innerText = eventName;
        document.getElementById('date-display').innerText = eventDate;

        // Combine date and time
        const targetDate = new Date(`${eventDate} ${eventTime}`).getTime();
        


        const timer = setInterval(function() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Helper function to add leading zero
            const formatTime = (time) => time < 10 ? `0${time}` : time;

            // Updated Animation Function
            updateSegment("days", formatTime(days));
            updateSegment("hours", formatTime(hours));
            updateSegment("minutes", formatTime(minutes));
            updateSegment("seconds", formatTime(seconds));



            // Update browser tab title with countdown
            document.title = `${eventName}`;

            // Visual pulse on final 16 seconds (Disabled on mobile)
            if (days === 0 && hours === 0 && minutes === 0 && seconds <= 16 && difference > 0) {
                const secBox = document.getElementById('seconds').parentElement;
                // Only animate if not mobile (simple check)
                //  if (window.innerWidth > 768) {
                    secBox.style.animation = 'pulse 0.5s infinite';
                    secBox.style.borderColor = 'rgba(241, 57, 7, 0.8)';
                //  }
            }

            // Milestone notifications


            if (difference < 0) {
                clearInterval(timer);
                
                // Remove UI Controls
                const maxBtn = document.getElementById('maximizeBtn');


                const clockToggle = document.getElementById('clockToggle');
                if (clockToggle) clockToggle.style.display = 'none';
                
                // Stop pulse
                document.getElementById('seconds').parentElement.style.animation = 'none';

                // Get the current date
                const currentDate = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = currentDate.toLocaleDateString('en-US', options);
                
                // Show Wish Button with Delay (Late Entrance)
                setTimeout(() => {
                    const wishContainer = document.getElementById('wishContainer');
                    if(wishContainer) wishContainer.classList.add('visible');
                }, 2000); // 2 second delay after timer ends

                // Display date ABOVE the birthday message with typewriter container
                const container = document.querySelector('.container');
                container.classList.add('floating-card'); // Add floating animation
                
                // Simplified inline styles for mobile are handled by CSS classes mostly, 
                // but we need to ensure the injected HTML isn't too heavy
                container.innerHTML = `
                    <div class="celebration-wrapper">
                        <p class="celebration-date">${formattedDate}</p>
                        <h1 id="typewriter-text" class="celebration-text"></h1>
                    </div>
                `;
                
                // Typewriter Effect
                const typewriterElement = document.getElementById('typewriter-text');
                const fullText = eventCele;
                let charIndex = 0;
                
                function typeWriter() {
                    if (charIndex < fullText.length) {
                        // Add next character + cursor
                        typewriterElement.innerHTML = fullText.substring(0, charIndex + 1) + '<span class="cursor"></span>';
                        charIndex++;
                        setTimeout(typeWriter, 100); // Typing speed
                    } else {
                        // Remove cursor at end, make it clickable
                        typewriterElement.innerHTML = fullText;
                        typewriterElement.style.cursor = 'pointer';
                                               
                        // Add GLOBAL click event for confetti
                        document.addEventListener('click', (e) => {
                            // Ignore clicks on buttons/inputs to prevent conflicts
                            if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;

                            const x = e.clientX;
                            const y = e.clientY;
                            const width = window.innerWidth;
                            const height = window.innerHeight;
                            const cornerThreshold = 150; // Pixels from corner

                            // Bottom Left Corner -> Shoot Right
                            if (x < cornerThreshold && y > height - cornerThreshold) {
                                startConfettiFromCorner(0, height, 'right');
                            } 
                            // Bottom Right Corner -> Shoot Left
                            else if (x > width - cornerThreshold && y > height - cornerThreshold) {
                                startConfettiFromCorner(width, height, 'left');
                            } 
                            // Anywhere else -> Normal Pop
                            else {
                                startConfetti(x, y);
                            }
                        });
                        
                        // Set cursor for whole body
                       // document.body.style.cursor = 'pointer';

                        // Auto trigger confetti from BOTH bottom corners diagonally based on config
                        const runConfettiWave = () => {
                            startConfettiFromCorner(0, window.innerHeight, 'right');
                            setTimeout(() => {
                                startConfettiFromCorner(window.innerWidth, window.innerHeight, 'left');
                            }, 200);
                        };

                        // Execute pops with defined delay
                        for (let i = 0; i < confettiPopCount; i++) {
                            setTimeout(runConfettiWave, i * confettiDelay);
                        } 
                    }
                }
                
                // Start typewriter effect
                typeWriter();

                // Update tab title
                document.title = `${eventCele}`; 


            }
        }, 1000);


        // --------------------------------------------------------------
        //  HELPER FUNCTIONS
        // --------------------------------------------------------------
        
        // Animated Digit Update Function (Per-Digit)
        function updateSegment(id, value) {
            const container = document.getElementById(id);
            if (!container) return;

            // Ensure value is a string
            const valStr = value.toString();

            // Initialize digits if not present
            let digitWrappers = container.querySelectorAll('.digit-wrapper');
            
            // If first run or length mismatch (unlikely for time), build structure
            if (digitWrappers.length !== valStr.length) {
                container.innerHTML = '';
                for (let char of valStr) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'digit-wrapper';
                    // Inline styles are now mostly handled by CSS class .digit-wrapper
                    // but we keep minimal overrides if needed or rely on class
                    wrapper.style.position = 'relative'; 
                    
                    wrapper.innerHTML = `<span class="current">${char}</span>`;
                    container.appendChild(wrapper);
                }
                return;
            }

            // Update each digit independently
            digitWrappers.forEach((wrapper, index) => {
                const newDigit = valStr[index];
                const currentSpan = wrapper.querySelector('.current');
                
                // If this specific digit hasn't changed, skip animation
                if (currentSpan && currentSpan.innerText === newDigit) return;

                // Animate ONLY this digit
                const newSpan = document.createElement('span');
                newSpan.className = 'current anim-enter';
                newSpan.innerText = newDigit;

                if (currentSpan) {
                    currentSpan.className = 'anim-exit'; // Mark for exit
                    // Remove after animation
                    setTimeout(() => currentSpan.remove(), 450);
                }
                
                wrapper.appendChild(newSpan);
            });
        }

        // Keyboard shortcut - Space to trigger confetti
        document.addEventListener('keydown', (e) => {
            // Ignore if user is typing in an input field
            const target = e.target.tagName;
            if (target === 'INPUT' || target === 'TEXTAREA') return;

            if (e.code === 'Space' && !e.repeat) {
                e.preventDefault();
                const x = window.innerWidth / 2;
                const y = window.innerHeight / 2;
                startConfetti(x, y);
            }
        });

        // --------------------------------------------------------------
        //  CONFETTI ANIMATION
        // --------------------------------------------------------------
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        
        // Google's vibrant confetti colors
        const confettiColors = [
            '#4285F4', // Google Blue
            '#DB4437', // Google Red
            '#F4B400', // Google Yellow
            '#0F9D58', // Google Green
            '#FF6D00', // Orange
            '#AB47BC', // Purple
            '#00ACC1', // Cyan
            '#E91E63', // Pink
            '#FDD835', // Bright Yellow
            '#7CB342', // Light Green
        ];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Confetti particle class for continuous falling
        class ConfettiPiece {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20; // Start above screen
                this.w = Math.random() * 10 + 6; // Width
                this.h = Math.random() * 6 + 3; // Height (rectangles/sheets)
                this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                
                // Faster falling physics
                this.vx = Math.random() * 1 - 0.5; // Horizontal drift
                this.vy = Math.random() * 2 + 1.5; // Faster fall speed
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 5 - 2.5; // More dynamic rotation
                
                // 3D effect properties
                this.flip = Math.random() * Math.PI * 2; // Flip angle for 3D effect
                this.flipSpeed = Math.random() * 0.1 + 0.05; // Flip rotation speed
                this.scale = Math.random() * 0.5 + 0.7; // Size variation for depth
                this.depth = Math.random(); // Depth in space (0=far, 1=near)
                
                // Natural swaying motion
                this.swayAmplitude = Math.random() * 2 + 0.5;
                this.swaySpeed = Math.random() * 0.03 + 0.01;
                this.swayPhase = Math.random() * Math.PI * 2;
                
                // Air resistance for natural floating
                this.airResistance = 0.96; // Very low resistance for far travel
                this.gravity = 0.15; // Faster gravity
                
                // Opacity for depth effect
                this.opacity = Math.random() * 0.3 + 0.7;
            }

            update() {
                // Apply air resistance
                this.vx *= this.airResistance;
                this.vy *= this.airResistance;
                
                // Apply faster gravity
                this.vy += this.gravity;
                
                // 3D flip animation
                this.flip += this.flipSpeed;
                
                // Sway side to side with 3D effect
                this.swayPhase += this.swaySpeed;
                this.x += this.vx + Math.sin(this.swayPhase) * this.swayAmplitude;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;

                // Bounce off screen edges (left and right boundaries)
                if (this.x <= 0) {
                    this.x = 0;
                    this.vx = Math.abs(this.vx) * 0.7; // Bounce back with some energy loss
                } else if (this.x >= canvas.width) {
                    this.x = canvas.width;
                    this.vx = -Math.abs(this.vx) * 0.7; // Bounce back with some energy loss
                }
            }

            isOffScreen() {
                // Check if confetti has fallen off screen (bottom only)
                return this.y > canvas.height + 20;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                
                // 3D perspective: scale based on flip angle (creates flipping effect)
                const scaleX = Math.cos(this.flip) * this.scale;
                const scaleY = this.scale;
                
                // Adjust opacity based on flip angle for 3D depth
                const flipOpacity = Math.abs(Math.cos(this.flip)) * 0.5 + 0.5;
                ctx.globalAlpha = this.opacity * flipOpacity * (0.6 + this.depth * 0.4);
                
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.w / 2 * scaleX, -this.h / 2 * scaleY, this.w * scaleX, this.h * scaleY);
                ctx.restore();
            }
        }

        // Explosion confetti for clicks
        function startConfetti(originX, originY) {
            // CRITICAL OPTIMIZATION: Reduce explosion count on mobile
            // Increased mobile count as requested
            const count = window.innerWidth < 768 ? 150 : 300;

            // Add explosion burst with more confetti
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const velocity = Math.random() * 12 + 10; // Much faster burst for distance

                const piece = new ConfettiPiece();
                piece.x = originX;
                piece.y = originY;
                piece.vx = Math.cos(angle) * velocity;
                piece.vy = Math.sin(angle) * velocity - 5; // Shoot upward
                piece.rotation = Math.random() * 360;
                
                particles.push(piece);
            }
            
            if (!animationId) {
                animateConfetti();
            }
        }

        // Diagonal corner burst confetti
        function startConfettiFromCorner(originX, originY, direction) {
            // Responsive angle spread based on viewport width
            const isMobile = window.innerWidth <= 768;
            const angleSpread = isMobile ? 45 : 30; // Wider spread on mobile for better coverage
            
            // OPTIMIZATION: Check for mobile (reduce particle count significantly)
            const count = isMobile ? 200 : 300;

            // Create diagonal burst from corner
            for (let i = 0; i < count; i++) {
                // Calculate angle for diagonal upward burst (responsive)
                let angle;
                if (direction === 'right') {
                    // From bottom-left, shoot diagonally up-right
                    const centerAngle = -60; // Center angle for the cone
                    angle = (Math.random() * angleSpread - (angleSpread / 2) + centerAngle) * Math.PI / 180;
                } else {
                    // From bottom-right, shoot diagonally up-left
                    const centerAngle = -120; // Center angle for the cone
                    angle = (Math.random() * angleSpread - (angleSpread / 2) + centerAngle) * Math.PI / 180;
                }
                
                const velocity = Math.random() * 25 + 20; // Maximum velocity for corner bursts

                const piece = new ConfettiPiece();
                piece.x = originX;
                piece.y = originY;
                piece.vx = Math.cos(angle) * velocity;
                piece.vy = Math.sin(angle) * velocity; // Negative = upward
                piece.rotation = Math.random() * 360;
                
                particles.push(piece);
            }
            
            if (!animationId) {
                animateConfetti();
            }
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Remove particles that have fallen off screen
            particles = particles.filter(p => !p.isOffScreen());
            
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            
            // Stop animation when all particles are gone
            if (particles.length > 0) {
                animationId = requestAnimationFrame(animateConfetti);
            } else {
                animationId = null;
            }
        }



        // --------------------------------------------------------------
        //  CUSTOM TOAST NOTIFICATIONS
        // --------------------------------------------------------------
        function showToast(message, type = 'default') {
            const container = document.getElementById('toastContainer');
            
            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            // Icon based on type
            let icon = 'fa-info-circle';
            if (type === 'success') icon = 'fa-check-circle';
            if (type === 'error') icon = 'fa-exclamation-circle';
            
            toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
            
            container.appendChild(toast);
            
            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
            
            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 400); // Wait for transition
            }, 3000);
        }

        // CONFIGURATION: GOOGLE APPS SCRIPT URL
        // ------------------------------------------------------------------
        // IMPORTANT: Replace this URL with your own Google Web App URL
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjYhNgay0buTKl-1_HMjiXabqz5w1ZaPBLOyN1bhpiAQsNEAewlpZdy8RFtHNzka2Itw/exec"; 
        // ------------------------------------------------------------------

        const wishModal = document.getElementById('wishModal');
        const openWishModalBtn = document.getElementById('openWishModal');
        const closeWishModalBtn = document.getElementById('closeWishModal');
        const sendWishBtn = document.getElementById('sendWish');
        const wishMessageInput = document.getElementById('wishMessage');

        // Open Modal
        openWishModalBtn.addEventListener('click', () => {
            wishModal.classList.add('active');
            wishMessageInput.focus();
        });

        // Close Modal
        function closeModal() {
            wishModal.classList.remove('active');
        }

        closeWishModalBtn.addEventListener('click', closeModal);
        
        // Close on outside click
        wishModal.addEventListener('click', (e) => {
            if (e.target === wishModal) closeModal();
        });

        // Send Logic
        sendWishBtn.addEventListener('click', () => {
             const message = wishMessageInput.value.trim();
             const name = document.getElementById('wishName').value.trim(); // Get Name
             
             // --- SECRET TRIGGER ---
             if (name === "" && message.toLowerCase() === "letmeedit") {
                 closeModal();
                 openAdminPanel();
                 wishMessageInput.value = "";
                 return;
             }
             // -----------------------

             if (!message || !name) {
                 showToast("Please enter your name and wish! ✨", "error");
                 return;
             }

             if (GOOGLE_SCRIPT_URL.includes("REPLACE_WITH")) {
                 showToast("Setup Error: Script URL not configured!", "error");
                 console.error("Please deploy the Google Script and update the GOOGLE_SCRIPT_URL in script.js");
                 return;
             }

             // Visual Loading State
             const originalBtnText = sendWishBtn.innerHTML;
             sendWishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
             sendWishBtn.disabled = true;

             // Prepare FormData
             // keys must match the header names in the Google Sheet
             const formData = new FormData();
             formData.append('Name', name);
             formData.append('Message', message);

             // Detect Device Name
             let deviceName = "Unknown Device";
             const ua = navigator.userAgent;
             if (/android/i.test(ua)) deviceName = "Android Device";
             else if (/iPad|iPhone|iPod/.test(ua)) deviceName = "iOS Device";
             else if (/windows phone/i.test(ua)) deviceName = "Windows Phone";
             else if (/Win/i.test(ua)) deviceName = "Windows PC";
             else if (/Mac/i.test(ua)) deviceName = "Macintosh";
             else if (/Linux/i.test(ua)) deviceName = "Linux PC";
             
             formData.append('Device Name', deviceName);
             formData.append('Full User Agent', ua);

             // Send via Google Apps Script (AJAX)
             fetch(GOOGLE_SCRIPT_URL, {
                 method: 'POST',
                 body: formData
             })
             .then(response => {
                 if (!response.ok) {
                     throw new Error(`Server returned ${response.status} ${response.statusText}`);
                 }
                 return response.json(); 
             })
             .then(data => {
                 if (data.result === 'success') {
                     // Success Animation
                     sendWishBtn.innerHTML = 'Sent! 💖';
                     startConfetti(window.innerWidth/2, window.innerHeight/2); // Trigger confetti
                     
                     setTimeout(() => {
                         closeModal();
                         wishMessageInput.value = ""; // Clear input
                         // document.getElementById('wishName').value = ""; // Optional: Clear name too
                         sendWishBtn.innerHTML = originalBtnText; // Reset button
                         sendWishBtn.disabled = false;
                         showToast("Thank you! 💌", "success");
                     }, 1500);
                 } else {
                     throw new Error(data.error || 'Unknown script error');
                 }
             })
             .catch(error => {
                 console.error('Submission Error:', error);
                 sendWishBtn.innerHTML = 'Error ❌';
                 
                 // More descriptive error message
                 setTimeout(() => {
                     sendWishBtn.innerHTML = originalBtnText;
                     sendWishBtn.disabled = false;
                     
                     showToast("Failed to send. Check console.", "error");
                 }, 3000);
             });
        });

        // --------------------------------------------------------------
        //  ADMIN SECRET MENU 🛠️
        // --------------------------------------------------------------
        
        const adminModal = document.getElementById('adminModal');
        const closeAdminModal = document.getElementById('closeAdminModal');
        const adminDateInput = document.getElementById('adminDate');
        const adminTimeInput = document.getElementById('adminTime');
        const adminEventNameInput = document.getElementById('adminEventName');
        const adminEventCeleInput = document.getElementById('adminEventCele');
        const saveAdminBtn = document.getElementById('saveAdmin');
        const resetAdminBtn = document.getElementById('resetAdmin');

        function openAdminPanel() {
            adminModal.classList.add('active');
            
            // Convert "January 2, 2026" -> "2026-01-02" for Date Input
            const d = new Date(eventDate);
            if (!isNaN(d)) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                adminDateInput.value = `${year}-${month}-${day}`;
            }

            // Time input accepts HH:MM:SS (saved format matches mostly, ensuring fit)
            adminTimeInput.value = eventTime;
            
            adminEventNameInput.value = eventName;
            adminEventCeleInput.value = eventCele;
        }

        function closeAdminPanel() {
            adminModal.classList.remove('active');
        }

        if(closeAdminModal) closeAdminModal.addEventListener('click', closeAdminPanel);
        
        // Save Changes
        saveAdminBtn.addEventListener('click', () => {
            const dateVal = adminDateInput.value; // YYYY-MM-DD
            const timeVal = adminTimeInput.value; // HH:MM:SS
            const newName = adminEventNameInput.value.trim();
            const newCele = adminEventCeleInput.value.trim();
            
            if(dateVal && timeVal && newName && newCele) {
                // Convert "2026-01-02" -> "January 2, 2026" for consistency
                const [y, m, d] = dateVal.split('-');
                const formattedDate = new Date(y, m-1, d).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });

                localStorage.setItem('eventDate', formattedDate);
                localStorage.setItem('eventTime', timeVal);
                localStorage.setItem('eventName', newName);
                localStorage.setItem('eventCele', newCele);
                showToast("Settings Saved! Reloading...", "success");
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast("All fields are required", "error");
            }
        });

        // Reset Changes
        resetAdminBtn.addEventListener('click', () => {
             showConfirmToast("Reset ALL settings to default?", () => {
                localStorage.removeItem('eventDate');
                localStorage.removeItem('eventTime');
                localStorage.removeItem('eventName');
                localStorage.removeItem('eventCele');
                showToast("Resetting...", "success");
                setTimeout(() => location.reload(), 1000);
            });
        });

        // --- Maximize Button Logic ---
        const maximizeBtn = document.getElementById('maximizeBtn');
        const maximizeIcon = maximizeBtn.querySelector('i');

        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent tilt card click event
            document.body.classList.toggle('maximize-mode');
            
            const isMax = document.body.classList.contains('maximize-mode');
            if(isMax) {
                maximizeIcon.classList.replace('fa-expand', 'fa-compress');
            } else {
                maximizeIcon.classList.replace('fa-compress', 'fa-expand');
            }
        });

        // Toggle Maximize with 'F' key
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key.toLowerCase() === 'f') {
                maximizeBtn.click();
            }
        });
        
        function showConfirmToast(message, onConfirm) {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = 'toast confirm';
            
            toast.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fas fa-question-circle" style="color:#ff0055;"></i>
                    <span>${message}</span>
                </div>
                <div class="toast-btn-group">
                    <button class="toast-btn yes">Yes, Reset</button>
                    <button class="toast-btn no">Cancel</button>
                </div>
            `;
            
            container.appendChild(toast);
            
            // Animation
            requestAnimationFrame(() => toast.classList.add('show'));
            
            // Handlers
            const yesBtn = toast.querySelector('.toast-btn.yes');
            const noBtn = toast.querySelector('.toast-btn.no');
            
            const closeToast = () => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            };
            
            yesBtn.addEventListener('click', () => {
                onConfirm();
                closeToast();
            });
            
            noBtn.addEventListener('click', closeToast);
        }
        
        // TRIGGER 1: Click Sequence on Timer Boxes
        // Sequence: Days(0) -> Hours(1) -> Minutes(2) -> Seconds(3) -> Repeat
        // Total 2 loops = 0,1,2,3,0,1,2,3
        
        const expectedSequence = [0, 1, 2, 3, 0, 1, 2, 3];
        let currentSequence = [];
        
        const timerItems = document.querySelectorAll('.countdown-item');
        timerItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Check if clicked item matches the next expected item in sequence
                const expectedIndex = expectedSequence[currentSequence.length];
                
                if (index === expectedIndex) {
                    currentSequence.push(index);
                    console.log("Sequence Progress:", currentSequence);
                    
                    if (currentSequence.length === expectedSequence.length) {
                        // Success!
                        openAdminPanel();
                        currentSequence = []; // Reset
                    }
                } else {
                    // Wrong click, reset
                    currentSequence = [];
                    // If they just started a new sequence with Days(0), keep it
                    if (index === 0) currentSequence.push(0);
                }
            });
        });


        // --------------------------------------------------------------
        //  UI INTERACTIONS (Tilt & Mobile Effects)
        // --------------------------------------------------------------
        
        const tiltCard = document.getElementById('tilt-card');
        const maxTilt = 10; // Max rotation degrees
        
        // Mouse Move (PC Tilt)
        tiltCard.addEventListener('mousemove', (e) => {
            // Disable on Mobile or if Maximize Mode is on
            if (window.innerWidth <= 768 || document.body.classList.contains('maximize-mode')) {
                return;
            }
            
            // FIX: Don't tilt if hovering over the Maximize Button (or if it catches you)
            if (e.target.closest('#maximizeBtn')) {
                // Determine if we should reset tilt (optional, but cleaner)
                // Let's just stop the tilt update so it stays stable or returns to 0
                return; 
            }

            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation
            // RotateX is based on Y position (tilt up/down)
            // RotateY is based on X position (tilt left/right)
            const rotateX = ((y - centerY) / centerY) * -maxTilt; // Invert Y
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            
            // Apply Transform
            requestAnimationFrame(() => {
                tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
        });

        let resetTimer;

        // Mouse Enter (Reset transition for instant response)
        tiltCard.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 768) return;
            
            // Cancel any pending reset to prevent snapping if re-entering
            if (resetTimer) clearTimeout(resetTimer);

            tiltCard.style.transition = ''; // Use CSS default (0.1s)
            tiltCard.style.animation = 'none'; // Ensure animation remains off
        });

        // Mouse Leave (Smooth Reset)
        tiltCard.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 768) return;
            
            // Block CSS animation from taking over immediately
            tiltCard.style.animation = 'none';

            // Apply slow transition for smooth return
            tiltCard.style.transition = 'transform 2.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            
            // Clear after transition
            resetTimer = setTimeout(() => {
                // Check if user hasn't re-entered (optional, but good practice if we were tracking state, 
                // but here clearing styles basically reverts to CSS state which is what we want)
                tiltCard.style.transform = ''; 
                tiltCard.style.transition = ''; 
                tiltCard.style.animation = ''; // Restore CSS animation (Heartbeat or Floating)
            }, 2800);
        });
        
        // Mobile Touch Interaction 
        // "Hover effect of tap": Scale UP slightly and apply subtle glow ONLY when tapped
        tiltCard.addEventListener('touchstart', () => {
             if (window.innerWidth <= 768 && !document.body.classList.contains('maximize-mode')) {
                 // Hover up (scale 1.02) + Faded Low Glow
                 tiltCard.style.transform = 'translateY(-6px)';
                 tiltCard.style.border = '3px solid rgba(255, 255, 255, 0.1)';
                 tiltCard.style.transition = 'all 0.2s ease-out';
             }
        }, {passive: true});
        
        tiltCard.addEventListener('touchend', () => {
             if (window.innerWidth <= 768 && !document.body.classList.contains('maximize-mode')) {
                 // Release -> Return to normal
                 tiltCard.style.transform = 'translateY(0)';
                 tiltCard.style.border = ''; // Revert to CSS default
                 
                 // Remove inline style after transition to clean up
                 setTimeout(() => {
                     tiltCard.style.transform = '';
                     tiltCard.style.border = '';
                     tiltCard.style.transition = '';
                 }, 200);
             }
        });
