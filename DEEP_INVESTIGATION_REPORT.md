# DEEP LINE-BY-LINE INVESTIGATION: CV PROJECT

## PROJECT OVERVIEW
This is an advanced, interactive professional CV/portfolio website built with HTML5, CSS3, and Three.js. It features 3D animations, interactive elements, and comprehensive skill visualization.

---

## INDEX.HTML DETAILED ANALYSIS

### SECTION 1: DOCTYPE & HEAD (Lines 1-17)
```
Line 1: <!DOCTYPE html>
- Standard HTML5 document type declaration
- Ensures browser renders in standards mode

Lines 2-5: HTML Tag & Meta Tags
- lang="en": Sets document language to English
- charset="UTF-8": Specifies UTF-8 character encoding (supports all Unicode characters)
- viewport: Responsive design meta tag for mobile devices
  - width=device-width: Matches viewport to device width
  - initial-scale=1.0: No zoom on load

Line 6: <title>Professional CV</title>
- Browser tab title

Lines 7-8: Stylesheet Links
- style.css: Main styling (70KB)
- drone-styles.css: 3D drone container styling (694 bytes)

Lines 9-16: Import Map for Three.js
- Defines module imports for ES6 modules
- three@0.160.0: Three.js library version
- three/addons/: Three.js addon modules (GLTFLoader, etc.)
- Uses CDN (cdn.jsdelivr.net) for delivery
```

### SECTION 2: FLOATING 3D DRONE (Lines 19-22)
```
Line 20-22: Drone Container
- Fixed position element in top-right corner
- Canvas element (id="droneCanvas") for WebGL rendering
- Will display 3D drone model using Three.js
```

### SECTION 3: SMOOTH SCROLL IMPLEMENTATION (Lines 25-105)
**Purpose**: Custom smooth scrolling with mouse wheel, touch, and keyboard support

**Key Variables (Lines 28-31)**:
- scrolling: Boolean flag to prevent multiple animations
- targetScrollY: Target scroll position
- currentScrollY: Current scroll position
- scrollSpeed: 0.02 (2% interpolation per frame)

**Mouse Wheel Scroll (Lines 45-57)**:
- preventDefault(): Disables default browser scroll
- Accumulates deltaY (scroll amount) into targetScrollY
- Constrains scroll within page bounds [0, maxScroll]
- Triggers requestAnimationFrame for smooth animation

**Touch Scroll (Lines 60-78)**:
- Tracks touchStartY on touchstart event
- Calculates deltaY from touch movement
- Multiplies by 2 for faster response
- Same bounds checking as mouse wheel

**Keyboard Scroll (Lines 81-103)**:
- Maps key codes to scroll amounts:
  - 38 (Up): -100px
  - 40 (Down): +100px
  - 33 (Page Up): -80% viewport height
  - 34 (Page Down): +80% viewport height
  - 36 (Home): Jump to top
  - 35 (End): Jump to bottom

**Animation Function (Lines 33-42)**:
- Uses requestAnimationFrame for 60fps smooth scrolling
- Linear interpolation: currentScrollY += (targetScrollY - currentScrollY) * scrollSpeed
- Stops when difference < 0.5px

### SECTION 4: PHOTO CONTAINER MOUSE TRACKING (Lines 108-159)
**Purpose**: 3D perspective effect on profile photo and languages section

**Mouse Position Tracking (Lines 116-127)**:
- Calculates mouse position relative to container
- Converts to percentage (0-1 range)
- Calculates offset: (percent - 0.5) * 20px

**Tooltip Transform (Line 130)**:
- Applies translateY and translateX based on mouse position
- Creates parallax effect on info tooltip

**Languages Section Transform (Lines 133-149)**:
- Maps mouse position to 5x5 grid
- Calculates 3D rotation:
  - rotateX: -25deg (top) to +25deg (bottom)
  - rotateY: +15deg (left) to -15deg (right)
- Scale: 1.05 at center, 1.02 elsewhere
- Smooth transition: 150ms ease-out

**Reset on Mouse Leave (Lines 153-158)**:
- Returns all transforms to default (0 rotation, scale 1)

### SECTION 5: VIEW COUNTER (Lines 162-174)
**Purpose**: Display unique visitor count

**Elements**:
- Eye icon (SVG)
- Counter label: "Profile Views"
- Counter number: Animated from 0 to actual count
- Sublabel: "Unique Visitors"

### SECTION 6: LANGUAGE SELECTOR (Lines 177-191)
**Purpose**: Multi-language support UI

**Languages Available**:
- EN (English)
- FR (French)
- ES (Spanish)
- DE (German)
- AR (Arabic)

**Functionality**:
- Globe icon
- Current language display
- Dropdown menu with onclick handlers

### SECTION 7: LANGUAGE SELECTOR SCRIPT (Lines 193-211)
```javascript
toggleLanguages(): Toggles .show class on language options
selectLanguage(lang): Updates current language display, closes dropdown
Click outside handler: Closes dropdown when clicking elsewhere
```

### SECTION 8: FEEDBACK BUTTON (Lines 214-234)
**Purpose**: User feedback collection

**Elements**:
- Fixed position button with chat icon
- Input field (max 50 characters)
- Tooltip that appears on click
- toggleFeedback(): Shows/hides feedback input

### SECTION 9: DEVICE FINGERPRINTING & VISITOR TRACKING (Lines 236-320)
**Purpose**: Track unique visitors using browser fingerprinting

**Fingerprint Data Collected (Lines 245-256)**:
- userAgent: Browser identification string
- language: Browser language setting
- platform: OS platform (Windows, Mac, Linux)
- screenResolution: Display resolution
- colorDepth: Color bit depth
- timezone: User's timezone
- canvas: Canvas fingerprint (unique to GPU/browser)
- plugins: Installed browser plugins
- hardwareConcurrency: Number of CPU cores
- deviceMemory: RAM available

**SHA-256 Hashing (Lines 259-261)**:
- Converts fingerprint object to JSON string
- Uses Web Crypto API to generate SHA-256 hash
- Returns 64-character hex string

**Visitor Tracking Logic (Lines 264-300)**:
- Retrieves existing visitor data from localStorage
- Checks if fingerprint exists:
  - New visitor: Creates entry with firstVisit, lastVisit, visitCount
  - Returning visitor: Updates lastVisit and increments visitCount
- Increments totalViews
- Saves to localStorage as JSON
- Animates counter display

**Counter Animation (Lines 302-316)**:
- Animates from 0 to target value over 2 seconds
- Uses setInterval with 16ms steps (60fps)
- Formats number with locale-specific separators

### SECTION 10: MARQUEE FADE ANIMATION (Lines 323-377)
**Purpose**: Animated scrolling text that fades on scroll

**Scroll Tracking (Lines 332-336)**:
- Calculates scroll progress: scrollY / 150px
- Maps to opacity: 1 - scrollProgress (fades out)

**Mask Gradient (Lines 344-352)**:
- Creates bottom-to-top fade effect
- transparentEnd: -10% + (scrollProgress * 110)
- blackStart: transparentEnd + 20%
- Applies both webkit and standard mask-image

**Pointer Events (Lines 355-359)**:
- Disables interaction when fully faded

**Animation Loop (Lines 365-376)**:
- Uses requestAnimationFrame for smooth updates
- Ticking flag prevents multiple simultaneous animations

### SECTION 11: MARQUEE CONTENT (Lines 381-457)
**Purpose**: Repeating scrolling banner with professional tags

**Marquee Items** (repeated twice for seamless loop):
1. IoT Engineering Student (with cube icon)
2. Full Stack Developer (with monitor icon)
3. Available for Internships (with clock icon)
4. Passionate About Innovation (with people icon)

**Structure**:
- Each item has SVG icon + text
- Separated by dividers
- Duplicated for seamless CSS animation loop

### SECTION 12: PROFILE SECTION WRAPPER (Lines 465-602)
**Purpose**: Main profile area with photo, languages, and skills

**Personal Stats Overlay (Lines 469-490)**:
- BMI: 22.0 (purple tooltip)
- IQ: 130 (blue tooltip)
- Age: 21
- Height: 175cm
- Weight: 67kg

**Mouse Tracker Grid (Lines 493-518)**:
- 25 tracker divs (tr-1 through tr-25)
- 5x5 grid for precise mouse position detection
- Used for 3D perspective calculations

**Profile Photo Card (Lines 521-525)**:
- Image: files/profile.png
- Wrapped in photo-wrapper div

**Info Tooltip (Lines 530-548)**:
- Profile picture thumbnail
- Name: Mohamed Cherif
- Description: Full Stack Developer bio
- Availability checkmark

**Languages Section (Lines 551-601)**:
- Title: "Languages Spoken"
- 4 language items:
  1. Arabic (Native) - 100% - Saudi Arabia flag
  2. French (Fluent) - 95% - French flag
  3. English (Advanced) - 85% - US flag
  4. Spanish (Intermediate) - 60% - Spain flag
- Each has progress bar visualization

### SECTION 13: SKILLS CONTAINERS (Lines 605-1093)
**Purpose**: Comprehensive skill visualization with progress bars

**First Skills Container (Lines 605-703)** - Web Development:
- HTML: 50%
- CSS: 70%
- JavaScript: 50%
- NodeJS: 30%
- TypeScript: 55% (#3178C6 - TypeScript blue)
- Sass: 60% (#CC6699 - Sass pink)
- Vue.js: 65% (#42B883 - Vue green)

**Second Skills Container (Lines 706-803)** - Frameworks & Tools:
- Git: 65%
- React: 60%
- Python: 55%
- MongoDB: 45%
- jQuery: 70% (#0769AD - jQuery blue)
- Express: 50% (#000000 - black)
- Docker: 55% (#2496ED - Docker blue)

**Third Skills Container (Lines 807-905)** - IoT & Embedded:
- Arduino: 75%
- ESP32: 80%
- C/C++: 65%
- MQTT: 70%
- STM32: 60% (#03234B - STM32 dark blue)
- MicroPython: 65% (#2B2728 - dark)
- FreeRTOS: 60% (#00A8E1 - cyan)

**Fourth Skills Container (Lines 908-1006)** - Sensors & Hardware:
- Sensors: 85%
- PCB Design: 60%
- Wireless: 75%
- Raspberry Pi: 70%
- I2C/SPI: 75% (#FF6B35 - orange)
- Bluetooth: 70% (#0082FC - blue)
- LoRa: 65% (#1ABC9C - teal)

**Fifth Skills Container (Lines 1009-1093)** - Design & Tools:
- Figma: 70% (#000000)
- Photoshop: 65% (#000000)
- Excel: 80% (#000000)
- PowerPoint: 75% (#000000)
- Word: 85% (#2B579A - Word blue)
- PDF Tools: 70% (#DC3545 - red)

**Sixth Skills Container (Lines 1096-1151)** - Database & Backend:
- SQL: 70%
- RESTful API: 75%
- Docker: 55%
- Security: 60%

**Seventh Skills Container (Lines 1155-1211)** - Cloud & DevOps:
- AWS: 50%
- Linux: 65%
- Firebase: 70%
- CI/CD: 55%

**Eighth Skills Container (Lines 1214-1298)** - Creative & Video:
- Photoshop: 75% (#31A8FF - Adobe blue)
- After Effects: 70% (#9999FF - purple)
- Vegas Pro: 68% (#1C69D4 - blue)
- Premiere Pro: 72% (#9999FF - purple)
- Illustrator: 65% (#FF9A00 - orange)
- InDesign: 60% (#FF3366 - pink)

### SECTION 14: PERSONAL INFORMATION (Lines 1300-1391)
**Purpose**: Contact and personal details

**Contact Information**:
- Phone: +216 123 456 789
- Email: mohamed@example.com
- Location: Kelibia, Tunisia
- Website: mohamedcherif.com
- Birthday: January 15, 2002
- Status: Student
- Nationality: Tunisian

**Icons**: SVG icons for each information type

### SECTION 15: HOBBIES & INTERESTS (Lines 1395-1453)
**Purpose**: Personal interests display

**Hobbies Listed**:
1. Coding (monitor icon)
2. Reading (book icon)
3. Gaming (play circle icon)
4. Music (music notes icon)
5. Photography (image icon)
6. IoT Projects (cube icon)

### SECTION 16: RADAR CHARTS (Lines 1457-1573)
**Purpose**: Skill visualization using radar/spider charts

**Three Radar Charts**:

**Chart 1 (Lines 1459-1495)** - Design & Strategy (Violet):
- Labels: Design, Innovation, Analysis, Research, Planning, Strategy
- Data points: 6-point polygon

**Chart 2 (Lines 1498-1534)** - Academic Subjects (Alt color):
- Labels: Math, History, Biology, Chemistry, Physics, Literacy
- Data points: 6-point polygon

**Chart 3 (Lines 1537-1573)** - Soft Skills (Default):
- Labels: Leadership, Technical, Creative, Teamwork, Problem-solving, Communication
- Data points: 6-point polygon

**SVG Structure**:
- Background grid: 5 concentric hexagons (grid-5 to grid-1)
- Axis lines: 6 lines from center to vertices
- Data polygon: Colored shape representing skill levels
- Data points: Circles at each vertex
- Labels: Text at each axis endpoint

### SECTION 17: SOCIAL MEDIA IMAGES (Lines 1576-1633)
**Purpose**: Social media profile previews

**Three Image Containers**:

**Facebook (Lines 1577-1591)**:
- Image: files/Untitled.png
- Profile pic: files/chief.jpg
- Name: Med Cherif
- Stats: 2.4K followers • 505 following

**Instagram (Lines 1594-1615)**:
- Image: files/Untitled2.png
- Username: cheriffmed (with verified badge)
- Stats: 1 post • 456 followers • 320 following

**LinkedIn (Lines 1618-1633)**:
- Image: files/Untitled3.png
- Profile pic: files/profile.png
- Name: Med Cherif
- Stats: 2.4K followers • 505 following

**Mouse Tracking Animation**:
- Each container has 3D transform on hover
- Social icon appears above image
- Text overlay shows profile info

### SECTION 18: ABOUT ME SECTION (Lines 1637-1669)
**Purpose**: Professional bio

**Content**:
- Intro: "IoT Engineering student at 21..."
- Body paragraphs:
  1. Full stack skills (Arduino, ESP32, React, Python, C++)
  2. Current focus: Sensor networks, internship search
  3. Location: Kelibia, Tunisia; Languages: Arabic, French, English

### SECTION 19: EARTH MAP WITH MARKERS (Lines 1674-1733)
**Purpose**: Geographic location visualization

**Elements**:
- Earth image: files/earth.png
- SVG markers and info boxes:
  - Tunisia marker (red): General location
  - Kelibia marker (teal): Specific city
- Dashed lines connecting markers to info boxes
- Gradient definitions for line styling

**Google Maps Embeds**:
- Ariana, Tunisia map
- Kelibia, Tunisia map
- Both use iframe embeds with specific coordinates

### SECTION 20: FLOATING SOCIAL BUTTONS (Lines 1736-1782)
**Purpose**: Fixed social media links

**Social Links**:
1. Facebook
2. LinkedIn
3. Twitter
4. Instagram
5. GitHub

**Features**:
- Fixed position on page
- Animated fill effect on hover
- Tooltip labels
- SVG icons
- aria-label for accessibility

### SECTION 21: RADAR IMAGE MOUSE TRACKING SCRIPT (Lines 1785-1850)
**Purpose**: 3D perspective effect on social media images

**Grid-Based Rotation (Lines 1804-1815)**:
- Maps mouse position to 5x5 grid
- Calculates rotateX: -25deg to +25deg
- Calculates rotateY: +15deg to -15deg
- Scale: 1.05 at center, 1.02 elsewhere

**Transform Application (Lines 1819-1832)**:
- Applies to: image, text overlay, social icon
- Social icon preserves translateX(-50%) for centering
- Smooth 150ms transition

**Reset on Leave (Lines 1836-1847)**:
- Resets all transforms to default

### SECTION 22: 3D DRONE ANIMATION SCRIPT (Lines 1853-2039)
**Purpose**: Interactive 3D drone model with scroll-based animation

**Imports (Lines 1854-1855)**:
- THREE: Main Three.js library
- GLTFLoader: For loading .glb 3D models

**Global Variables (Lines 1860-1866)**:
- scene, camera, renderer, drone, mixer, clock
- lastScrollY, lastScrollTime: Scroll tracking
- scrollVelocity: Pixels per second
- animationActive: Boolean flag
- animationSpeed, targetAnimationSpeed: Easing values

**Initialization Function (Lines 1868-1957)**:

**Canvas Setup (Lines 1871-1879)**:
- Gets canvas element (id="droneCanvas")
- Gets container (.drone-container)
- Error checking for missing canvas

**Scene Setup (Lines 1882-1888)**:
- Creates THREE.Scene()
- Creates PerspectiveCamera: 45° FOV, z=29
- Logs to console for debugging

**Renderer Setup (Lines 1891-1898)**:
- WebGLRenderer with alpha=true (transparency)
- antialias=true for smooth edges
- Size: 150x150 pixels
- Pixel ratio: device dependent

**Lighting (Lines 1904-1914)**:
- Ambient light: 0xffffff (white), intensity 0.8
- Directional light 1: Position (5,5,5), intensity 1
- Directional light 2: Position (-5,-5,-5), intensity 0.5

**Model Loading (Lines 1918-1956)**:
- Loads files/drone.glb using GLTFLoader
- Centers model using Box3
- Scales to fit 2-unit bounding box
- Sets up AnimationMixer if animations exist
- Starts animation loop

**Animation Function (Lines 1959-1991)**:

**Floating Motion (Lines 1964-1966)**:
- Y position: sin(time * 0.5) * 0.1 (gentle bobbing)
- Y rotation: += 0.0005 per frame (slow spin)

**Scroll-Based Animation (Lines 1971-1987)**:
- Maps scroll velocity to animation speed (0-3)
- Minimum speed: 0.2 when scrolling
- Eases in/out with factor 0.08
- Updates mixer with eased speed * 0.5

**Scroll Event Listener (Lines 1997-2031)**:

**Velocity Calculation (Lines 2003-2005)**:
- deltaScroll: Absolute scroll distance
- deltaTime: Time since last scroll
- scrollVelocity: pixels per second

**Animation Control (Lines 2012-2030)**:
- Activates animation immediately on scroll
- Adds .active class to container
- Clears previous timeout
- Deactivates animation 50ms after scroll stops

**Initialization Trigger (Lines 2034-2038)**:
- Checks if DOM is loading
- Calls init3DDrone when ready

---

## CSS FILES ANALYSIS

### STYLE.CSS (Main Stylesheet - 3205 lines)

**Global Styles (Lines 1-26)**:
- Universal selector reset: margin, padding, box-sizing
- HTML: smooth scroll-behavior
- Body: white background, 3px red debug border
- CV container: 2px blue debug border, 100% width

**View Counter (Lines 29-103)**:
- Fixed position: bottom 0, left 150px
- Flexbox layout with gap 8px
- Z-index: 1000000 (very high)
- Animation: slideInUp 0.8s with 0.2s delay
- Hover effect: translateY(-2px)

**Language Selector (Lines 106-185)**:
- Fixed position: top 60px, right 30px
- Flexbox with gap 6px
- Z-index: 10000
- Animation: slideInRight 0.8s
- Dropdown menu: position absolute, right 100%
- Show state: opacity 1, visibility visible

**Feedback Button (Lines 188-200+)**:
- Fixed position: bottom 0, left 0
- Flexbox column layout
- Z-index: 10000
- Animation: slideInUp 0.8s with 0.2s delay

### DRONE-STYLES.CSS (Drone Container - 36 lines)

**Drone Container (Lines 2-14)**:
- Fixed position: top -45px, right 5px
- Size: 150x150px
- Z-index: 9999
- pointer-events: none (doesn't block clicks)
- Background: rgba(0, 150, 255, 0.1)
- Border: 2px rgba(0, 150, 255, 0.3)
- Border-radius: 10px

**Active State (Lines 16-19)**:
- Scale: 1.1 (10% larger)
- Drop shadow: 20px blur, 0.6 opacity

**Canvas (Lines 21-25)**:
- 100% width and height
- Display: block

**Responsive (Lines 28-35)**:
- Mobile: 50x50px, top 10px, right 10px

---

## KEY FEATURES SUMMARY

### 1. **Interactive Elements**
- Smooth custom scrolling (mouse, touch, keyboard)
- 3D perspective effects on hover
- Mouse tracking with grid-based calculations
- Animated counters and transitions

### 2. **3D Graphics**
- Three.js 3D drone model
- Scroll-based animation control
- Lighting and camera setup
- Model loading and scaling

### 3. **Data Visualization**
- Skill progress bars with percentages
- Radar/spider charts (3 variants)
- Language proficiency indicators
- Personal statistics overlay

### 4. **Visitor Tracking**
- Browser fingerprinting (SHA-256)
- LocalStorage persistence
- Unique visitor counting
- Animated counter display

### 5. **Responsive Design**
- Mobile-optimized drone container
- Flexible layouts
- Viewport meta tags
- CSS media queries

### 6. **Accessibility**
- Semantic HTML structure
- aria-label attributes on links
- SVG icons with descriptions
- Keyboard navigation support

### 7. **Performance Optimizations**
- RequestAnimationFrame for smooth animations
- Ticking flags to prevent multiple animations
- Easing functions for smooth transitions
- Lazy loading for Google Maps

---

## TECHNICAL STACK

| Technology | Purpose | Version |
|-----------|---------|---------|
| HTML5 | Structure | Latest |
| CSS3 | Styling & Animations | Latest |
| JavaScript (ES6) | Interactivity | ES6+ |
| Three.js | 3D Graphics | 0.160.0 |
| Web Crypto API | Fingerprinting | Native |
| LocalStorage API | Data Persistence | Native |
| Google Maps API | Location Display | Embedded |

---

## FILE STRUCTURE

```
cv/
├── index.html (2042 lines) - Main HTML document
├── style.css (3205 lines) - Main stylesheet
├── drone-styles.css (36 lines) - Drone container styles
├── files/
│   ├── profile.png - Profile photo
│   ├── chief.jpg - Social media profile pic
│   ├── Untitled.png - Facebook preview
│   ├── Untitled2.png - Instagram preview
│   ├── Untitled3.png - LinkedIn preview
│   ├── earth.png - World map image
│   ├── drone.glb - 3D drone model
│   ├── esp32.glb - ESP32 3D model
│   ├── robotic_arm.glb - Robotic arm 3D model
│   ├── Flag-Saudi-Arabia.webp - Arabic flag
│   ├── frenchflag.jpg - French flag
│   ├── unitedstates.webp - English flag
│   └── Flag-Spain.webp - Spanish flag
└── 3d/ - Additional 3D assets
```

---

## CRITICAL CODE SECTIONS

### Smooth Scroll Implementation
- Custom scroll handler with velocity calculation
- Prevents default browser behavior
- Supports multiple input methods (wheel, touch, keyboard)

### Visitor Fingerprinting
- Collects 10+ browser/device properties
- SHA-256 hashing for privacy
- LocalStorage for persistence
- Unique visitor identification

### 3D Drone Animation
- Scroll velocity-based animation speed
- Smooth easing in/out
- Model loading and scaling
- Lighting and camera setup

### Mouse Tracking
- Grid-based position mapping
- 3D perspective transforms
- Smooth transitions
- Reset on mouse leave

---

## DEBUGGING FEATURES

**Console Logging** (Lines 1857-1954):
- 🚁 Drone script loading
- ✅ Component initialization
- ❌ Error reporting
- 📦 Model loading progress

**Debug Borders**:
- Red border on body (3px)
- Blue border on cv-container (2px)
- Colored borders on UI elements

**Visual Indicators**:
- Drone container border (blue)
- Language selector border (pink)
- View counter border (blue)
- Feedback button border (green)

---

## PERFORMANCE METRICS

- **Total HTML Size**: 126.5 KB
- **CSS Size**: 70 KB (style.css) + 694 bytes (drone-styles.css)
- **Animation Frame Rate**: 60 FPS (requestAnimationFrame)
- **Scroll Smoothing**: 2% interpolation per frame
- **3D Model Size**: 286 KB (ESP32) + 10.8 MB (Robotic Arm)

---

## CONCLUSION

This is a sophisticated, modern portfolio website that combines:
- **Frontend Excellence**: Smooth animations, 3D graphics, interactive elements
- **Data Visualization**: Multiple chart types, progress indicators
- **User Tracking**: Privacy-respecting fingerprinting
- **Responsive Design**: Mobile-optimized layouts
- **Accessibility**: Semantic HTML, ARIA labels, keyboard support

The codebase demonstrates advanced web development skills including ES6+, Three.js, CSS animations, and browser APIs.
