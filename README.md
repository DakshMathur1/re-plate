🥫 Re-Plate: Reducing Food Waste through Optimization and AI

🌟 Inspiration

Every year, 1.3 billion tons of food are wasted globally, while nearly 828 million people go hungry. In developed countries, 40% of food waste happens at the retail and consumer levels.

This isn’t just a statistic – it’s a solvable crisis.

Landfilled food waste produces methane, a greenhouse gas 25x more potent than CO₂. At the same time, local shelters and food banks struggle to maintain supplies of nutritious food.

Re-Plate aims to bridge this gap, connecting surplus food with those in need using smart automation and artificial intelligence.

🥗 What It Does

Re-Plate is an intelligent food donation platform that:

Matches donors with local shelters
Classifies and verifies food safety
Tracks impact using real-time analytics
Key Features
🍎 Donate surplus food easily
Businesses and individuals can quickly log food items with AI-powered assistance.
🔍 Analyze food safety instantly
Our system extracts and evaluates best-before dates and item condition for safe donations.
📊 Track donation impact
Donors see how much waste was prevented, CO₂ was offset, and people served.
🏠 Connect with local shelters
Shelters can post specific needs and receive real-time matches from nearby donors.
🛠️ How We Built It

🌐 Frontend (Next.js + Tailwind CSS)
Component-Based Architecture: Built with reusable, maintainable components
Responsive UI: Seamless across mobile, tablet, and desktop
ApexCharts Integration: Engaging visual analytics for donation tracking
Sidebar Navigation: Intuitive interface with clean routing using Next.js dynamic routes
🤖 AI Integration with Gemini
Powered by Google Gemini, our AI performs:

Image Recognition: Automatically classifies food from photos
Best-Before Date Extraction: Combines image + OCR to interpret expiry dates
Food Safety Assessment: Evaluates donation safety based on visual and textual cues
⚙️ Backend (FastAPI)
RESTful API Design: Clean architecture for frontend-backend communication
Authentication & Roles: Role-based access control for donors and shelters
High Performance: FastAPI ensures efficient data handling
🧗 Challenges We Faced

Inconsistent Expiry Labels: Variability in packaging made date extraction tough. We overcame this with multi-modal AI endpoints that combine image + text recognition.
Diverse User Flows: Designing for both donors and shelters while keeping the interface intuitive required thoughtful UI/UX planning.
🏆 Accomplishments

Built a dual-mode AI system for food classification + expiry analysis
Delivered a functional MVP tackling food waste with real-world potential
Designed an analytics dashboard that empowers users with impact insights
📚 What We Learned

How to integrate AI into production-ready apps
Importance of error handling and fallback systems in AI services
Balancing user experience for diverse stakeholders
Gained deeper experience with Next.js, FastAPI, and state management
🚀 What’s Next

📱 Mobile App Development – Native iOS/Android apps for on-the-go donations
🗺️ Logistics Integration – Volunteer routing & optimized pickup delivery
📍 Geolocation Matching – Smarter, real-time donor-recipient connections
💬 In-App Messaging – Direct coordination between donors and shelters
🌐 Community Impact Dashboards – Broader metrics on hunger reduction and waste prevention
