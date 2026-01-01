# ⏳ Cyberpunk Event Countdown

A visually stunning, neon-themed countdown timer web application with advanced customization features, 3D tilt effects, and a secret admin panel.

### 🔗 [View Deployment](http://arrrslan.github.io/countdown/)

## ✨ Features

### 🎨 Visual & UI
-   **Neon Glassmorphism Design**: High-end dark UI with glass blur effects and neon accents.
-   **3D Tilt Effect**: Interactive card that tilts with mouse movement.
-   **Responsive Layout**: Fully adaptive design that looks great on Desktop, Mobile, and Landscape orientations.
-   **Animations**: Floating cards, confetti explosions, and smooth transitions.

### ⚙️ Functionality
-   **Dynamic Countdown**: Accurate Days/Hours/Minutes/Seconds timer.
-   **Maximize Mode**: Dedicated button to expand the timer to Full Screen (perfect for landscape displays).
-   **Celebration Event**:
    -   Typewriter text effect when the timer hits zero.
    -   "Wish" button appears for users to send messages.
    -   Confetti showers on interaction.

### 🛠️ Secret Admin Panel
A hidden menu allows you to customize the event details without touching the code.
-   **Edit Event Name**: Change the headline (e.g., "My Birthday").
-   **Edit Date & Time**: Pick the exact target using a calendar/clock UI.
-   **Edit Celebration Text**: Change the message shown after the timer ends.
-   **Persistent Settings**: All changes are saved to the browser's `localStorage`.

## 🚀 How to Use

### 1. Standard Usage
Simply open `index.html` in any modern web browser. The countdown will start immediately based on the configured date.

### 2. Accessing the Secret Admin Panel
There are two ways to open the hidden configuration menu:
1.  **Click Sequence**: Click the countdown boxes in this order: `Days` -> `Hours` -> `Minutes` -> `Seconds` -> (Repeat) `Days` -> `Hours` -> `Minutes` -> `Seconds`.
2.  **Wish Hack**: Wait for the timer to end (or set it to the past), click "Send Wish", leave the **Name** empty, and type `letmeedit` in the message box.

### 3. Maximize View
Click the **Expand Icon** (diagonal arrows) in the top-right corner of the card to enter "Big Mode". This hides the title and date, enlarging the numbers to fill the entire screen. Great for using an old phone as a dedicated countdown clock!

## 💻 Tech Stack
-   **HTML5**: Semantic structure and input controls.
-   **CSS3**: Variables, Flexbox/Grid, Animations, Media Queries.
-   **JavaScript (ES6+)**: Logic for timer, DOM manipulation, `localStorage` persistence, and confetti canvas.
-   **Libraries**:
    -   `canvas-confetti`: For the celebration effects.
    -   FontAwesome: For UI icons.
    -   Google Fonts: 'Bebas Neue' and 'Inter'.

## 📂 Installation
No build process is required! This is a vanilla web project.
1.  Clone the repository.
2.  Open `index.html` in your browser.

## 📝 Customization (Code)
If you prefer hardcoded defaults, you can edit the `script.js` file:
```javascript
// DEFAULT VALUES
const defaultDate = "January 16, 2026";
const defaultTime = "00:00:00"; 
const defaultName = "My Birthday";
```

## 📄 License
This project is open source and available for personal use.
