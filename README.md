# 🥫 Re-Plate: Reducing Food Waste through Optimization and AI

## 💡 Inspiration

Every year, **1.3 billion tons** of food is wasted globally, while nearly **828 million people** go hungry. In developed countries, **40%** of food waste happens at the **retail and consumer** levels.

This isn’t just a statistic – it’s a **solvable crisis**.

Food waste contributes significantly to climate change, producing **methane** – a greenhouse gas **25x more potent** than CO₂. Meanwhile, shelters and food banks face shortages in providing consistent, nutritious meals to those in need.

**Re-Plate** bridges this gap by connecting surplus food with communities, using AI and smart logistics to reduce waste and combat hunger.

---

## 🚀 Getting Started

Follow the steps below to set up and run the project locally:

1. **Clone the Repository**

   ```bash
   git clone git@github.com:Arjun-Mishra-312/re-plate.git
2. Navigate to the Project Directory

   ```bash
   cd re-plate
3. Navigate to the Frontend Folder

   ```bash
   cd re-plateFrontend
4. Install Dependencies

   ```bash
   npm install
5. Start the Development Server

   ```bash
   npm run dev
6. Open http://localhost:3000 in your browser to view the app.

---

## 🥗 What It Does

Re-Plate is an intelligent donation platform that redefines food redistribution by combining smart classification, analytics, and seamless donor-shelter connections.

### Key Features

- 🍎 **Donate surplus food easily**  
  Businesses and individuals can log surplus food through an intuitive interface, with AI assistance to classify and evaluate food safety.

- 🔍 **Analyze food safety instantly**  
  The platform analyzes best-before dates and food conditions to ensure all donations are safe for consumption.

- 📊 **Track donation impact**  
  Donors can visualize their contributions through analytics—tracking food saved, CO₂ offset, and people served.

- 🏠 **Connect with local shelters**  
  Shelters post food requests and get automatically matched with nearby donations.

---

## 🛠️ How We Built It

### 🌐 Frontend (Next.js + Tailwind CSS)
- **Component-Based UI** for reusability and maintainability
- **Responsive Design** across mobile, tablet, and desktop
- **Dynamic Routing** using Next.js for fast and smooth navigation
- **ApexCharts** for visually engaging donation analytics
- **Sidebar Navigation** for easy access to dashboard and features

### 🤖 AI Integration (Google Gemini)
- **Image Recognition** to automatically classify food items
- **Text + Vision Analysis** to extract and interpret best-before dates
- **Safety Evaluation** based on packaging condition and expiry

### ⚙️ Backend (Python + FastAPI)
- **FastAPI** for lightweight, high-performance APIs
- **RESTful Architecture** to enable clean data flow
- **Role-Based Authentication** for donors and shelters
- **Secure Endpoints** for image processing and data handling

---

## 🧗 Challenges We Faced

- 📦 **Expiry Date Variability**  
  Food labels vary in format, location, and clarity, making them hard to extract. We solved this by combining Gemini's **vision and OCR** capabilities in a single pipeline.

- 🧑‍🤝‍🧑 **Dual-User Experience**  
  Designing interfaces for both **donors** and **shelters** meant balancing simplicity with functionality.

---

## 🏆 Accomplishments

- 🧠 Successfully integrated **dual-mode AI** for image + text-based food assessment
- 🌍 Created a platform that has the potential to **reduce food waste at scale**
- 📈 Built an **impact-driven dashboard** that educates and motivates users

---

## 📚 What We Learned

- The importance of **error handling** in AI-enhanced applications
- Building for **multiple user types** with differing goals and workflows
- Best practices in **Next.js structure**, state management, and API communication

---

## 🚀 What’s Next

- 📱 **Native Mobile App** for faster and more convenient food logging  
- 🗺️ **Volunteer Coordination & Routing** for optimized pickups and deliveries  
- 📍 **Geolocation Matching** to connect shelters with nearby donors  
- 💬 **In-App Chat** for real-time communication  
- 🌐 **Community Impact Visualization** to show progress on hunger relief goals

---

## 🤝 Get Involved

Whether you’re a:
- 🧑‍💻 **Developer** who wants to contribute
- 🏪 **Business** with food surplus
- 🏚️ **Shelter** in need of supplies
- 🚴 **Volunteer** eager to make a difference

**Re-Plate is for you.**

Let’s work together to turn **waste into nourishment**.

---

## 🧠 Tech Stack

- **Frontend**: Next.js, Tailwind CSS, ApexCharts  
- **Backend**: Python FastAPI  
- **AI**: Google Gemini (Vision + OCR)  
- **Auth**: JWT + Role-Based Access  
- **Deployment**: Vercel (Frontend), Render/AWS/GCP (Backend)
