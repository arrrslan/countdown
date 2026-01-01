
        // --------------------------------------------------------------
        //  CONFIGURATION SECTION
        // --------------------------------------------------------------
        
        const eventDate = "January 1, 2026";   // Format: Month Day, Year
        const eventTime = "00:05:30";          // Format: HH:MM:SS (24-hour)
        const eventName = "My Birthday Countdown";       // What is the event?
        const eventCele = "Today is my Birthday!" // Shows after timer
        
        // --------------------------------------------------------------
        // --------------------------------------------------------------

        // Update Headline
        const headline = document.getElementById('headline');
        headline.innerText = eventName;

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
            document.title = `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)} - ${eventName}`;

            // Visual pulse on final 10 seconds (Disabled on mobile by simplified CSS, logical check stays)
            if (days === 0 && hours === 0 && minutes === 0 && seconds <= 10 && difference > 0) {
                const secBox = document.getElementById('seconds').parentElement;
                // Only animate if not mobile (simple check)
                 if (window.innerWidth > 768) {
                    secBox.style.animation = 'pulse 0.5s infinite';
                    secBox.style.borderColor = 'rgba(255, 105, 180, 0.8)';
                 }
            }

            // Milestone notifications


            if (difference < 0) {
                clearInterval(timer);
                
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
                
                // Simplified inline styles for mobile are handled by CSS classes mostly, 
                // but we need to ensure the injected HTML isn't too heavy
                container.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        width: 100%;
                        user-select: none;
                        -webkit-user-select: none;
                    ">
                        <div style="
                            display: inline-block;
                            padding: 0.8rem 2.5rem;
                            background: rgba(255, 255, 255, 0.08);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            border-radius: 100px;
                            /* Removed inline backdrop-filter here, relied on parent or simplified CSS */
                            margin-bottom: 1.5rem;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                            cursor: default;
                            max-width: 90%;
                        ">
                            <p style="
                                font-family: 'Inter', sans-serif;
                                font-size: clamp(0.8rem, 2vw, 1.1rem); 
                                font-weight: 600;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                color: #fff; /* Simplified color */
                                margin: 0;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            ">${formattedDate}</p>
                        </div>
                        
                        <h1 id="typewriter-text" style="
                            font-family: 'Space Grotesk', sans-serif;
                            font-size: clamp(2.2rem, 9vw, 5.5rem);
                            font-weight: 800;
                            margin-bottom: 0;
                            color: #fff; /* Simplified color */
                            letter-spacing: -0.02em;
                            min-height: 1.2em;
                            line-height: 1.1;
                            text-align: center;
                            width: 100%;
                            padding: 0 10px;
                        "></h1>
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
                        
                        // Add click event for confetti
                        const card = document.getElementById('tilt-card');
                        card.style.cursor = 'pointer';
                        card.addEventListener('click', (e) => {
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX;
                            const y = e.clientY;
                            startConfetti(x, y);
                        });
                    }
                }
                
                // Start typewriter effect
                typeWriter();

                // Update tab title
                document.title = `🎉 ${eventCele} 🎉`;

                // Auto trigger confetti from BOTH bottom corners diagonally
                startConfettiFromCorner(0, window.innerHeight, 'right'); // Bottom-left corner shooting right
                setTimeout(() => {
                    startConfettiFromCorner(window.innerWidth, window.innerHeight, 'left'); // Bottom-right corner shooting left
                }, 200); 
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
                    wrapper.style.display = 'inline-block';
                    wrapper.style.position = 'relative'; 
                    wrapper.style.width = '0.6em'; // Fixed width per digit
                    wrapper.style.height = '100%';
                    
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
        let isConfettiRunning = false;
        
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

        // Initialize continuous confetti
        function startContinuousConfetti(count = 150) {
            if (isConfettiRunning) return;
            
            isConfettiRunning = true;
            particles = [];

            // CRITICAL OPTIMIZATION: Drastically reduce count on mobile
            // Use 30 particles for mobile (was 60), 150 for desktop
            const particleCount = window.innerWidth < 768 ? 30 : count;
            
            // Create confetti pieces
            for (let i = 0; i < particleCount; i++) {
                const piece = new ConfettiPiece();
                // Stagger initial positions for smooth entrance
                piece.y = Math.random() * canvas.height - canvas.height;
                particles.push(piece);
            }
            
            animateConfetti();
        }

        // Explosion confetti for clicks
        function startConfetti(originX, originY) {
            // CRITICAL OPTIMIZATION: Reduce explosion count on mobile
            // Use 50 particles for mobile (was 100), 300 for desktop
            const count = window.innerWidth < 768 ? 50 : 300;

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
            const count = isMobile ? 80 : 300;

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
        //  UI INTERACTION LOGIC (3D EFFECT)
        // --------------------------------------------------------------
        const card = document.getElementById('tilt-card');
        const container = document.body;

        // Smooth 3D Tilt Effect
        container.addEventListener('mousemove', (e) => {
            // Remove smooth reset class while moving for instant response
            card.classList.remove('smooth-reset');
            
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            // Apply rotation
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            
            // Optional: Move orbs slightly opposite to mouse for parallax depth
            document.querySelector('.orb-1').style.transform = `translate(${xAxis * 2}px, ${yAxis * 2}px)`;
            document.querySelector('.orb-2').style.transform = `translate(${xAxis * -2}px, ${yAxis * -2}px)`;
        });

        // Reset to center when mouse leaves window
        container.addEventListener('mouseleave', () => {
            card.classList.add('smooth-reset');
            card.style.transform = `rotateY(0deg) rotateX(0deg)`;
            
            // Reset orbs
            document.querySelector('.orb-1').style.transform = `translate(0,0)`;
            document.querySelector('.orb-2').style.transform = `translate(0,0)`;
        });

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

        // --------------------------------------------------------------
        //  WISH ME FEATURE (FormSubmit.co)
        // --------------------------------------------------------------
        
        // CONFIGURATION: REPLACE THIS WITH YOUR EMAIL
        const recipientEmail = "c5be7190e6775440e1eba693a27ce0ba"; 

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
             if (!message) {
                 showToast("Please type a wish first! ✨", "error");
                 return;
             }

             // Visual Loading State
             const originalBtnText = sendWishBtn.innerHTML;
             sendWishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
             sendWishBtn.disabled = true;

             // Prepare FormData (More robust than JSON for this API)
             const formData = new FormData();
             formData.append('_subject', 'New Birthday Wish from Website! 🎉');
             formData.append('_captcha', 'false');
             formData.append('_template', 'table');
             formData.append('message', message);
             // Optional: Add a reply-to if you add an email input later
             // formData.append('email', 'sender@example.com'); 

             // Send via FormSubmit AJAX
             fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
                 method: "POST",
                 body: formData
                 // Note: Content-Type header is NOT set manually for FormData
             })
             .then(response => {
                 if (!response.ok) {
                     // If 400-500 range, throw error to catch block
                     throw new Error(`Server returned ${response.status} ${response.statusText}`);
                 }
                 return response.json(); 
             })
             .then(data => {
                 // Success Animation
                 sendWishBtn.innerHTML = 'Sent! 💖';
                 startConfetti(window.innerWidth/2, window.innerHeight/2); // Trigger confetti
                 
                 setTimeout(() => {
                     closeModal();
                     wishMessageInput.value = ""; // Clear input
                     sendWishBtn.innerHTML = originalBtnText; // Reset button
                     sendWishBtn.disabled = false;
                     showToast("Thank you! 💌", "success");
                 }, 1500);
             })
             .catch(error => {
                 console.error('Submission Error:', error);
                 sendWishBtn.innerHTML = 'Error ❌';
                 
                 // More descriptive error message
                 setTimeout(() => {
                     sendWishBtn.innerHTML = originalBtnText;
                     sendWishBtn.disabled = false;
                     
                     // Helper message for first-time use
                     showToast("Oops! Turn off Ad-blocker & Check connection.", "error");
                     console.warn("Detailed Error:", error);
                 }, 3000);
             });
        });

