# ResumeIQ - AI Career Assistant

ResumeIQ is a premium, AI-powered career assistant designed to help job seekers optimize their resumes, bypass automated screeners (ATS), and land interviews faster. Driven by Google's state-of-the-art **Gemini 2.5 Flash** model, the application offers real-time scoring, structural feedback, and deep keyword alignment.

---

## 🚀 Key Features

### 1. 🔍 Try Live ATS Scanner (No Login Required)

- **Instant Guest Scan**: Upload a resume (`.pdf`, `.docx`, `.doc`) directly on the landing page for an instant check.
- **In-Memory Parsing**: Processes PDFs (via `pdf2json`) and Word files (via `mammoth`) in-memory to ensure zero-delay scoring without saving files to the cloud.
- **Score Circle**: An animated, color-coded SVG circle that visually charts the ATS compatibility rating.
- **Analysis Preview**: Displays a sample strength and sample gap parsed by AI, complete with a high-conversion call-to-action button leading to registration.

### 2. 🌗 Persisted Theme Toggle (Dark & Light Mode)

- **Theme Syncing**: Accessible toggle control available in the settings dashboard and navbars.
- **FOUC Prevention**: Inline blocking script injected in the document head immediately applies the user's theme preference (`localStorage.theme`) to avoid visual flashes.
- **Premium Contrast System**: Fully overhauled color palette with custom-tailored dark charcoal HSL shades for light mode text, ensuring excellent readability ratios on white backgrounds.

### 3. 🛡️ Transactional Upload & AI Analysis

- **Atomic Pipeline**: Uploading to Cloudinary and writing to MongoDB are blocked until Gemini successfully parses the file and returns a valid ATS JSON payload.
- **Clean Database**: If Gemini experiences temporary high-demand rate limits (e.g., 503 UNAVAILABLE), the upload fails gracefully on the client side, keeping Cloudinary storage and database records free from empty or un-analyzed resumes.

### 4. 📊 ATS Scorecard Dashboard

- **Dynamic Recharts Graphs**: Visualizes score histories using area graphs and graphs peak match ratings with radial gauges.
- **Granular Scorecards**: Breaks down Gemini's evaluation into:
  - **Key Strengths** (emerald checkmarks)
  - **Identified Gaps** (rose alert logs)
  - **AI Recommendations** (indigo lightbulb cards)
- **Document Viewer**: Interactive iframe to review uploaded PDFs side-by-side with the scorecard, or run on-demand re-analysis.

### 5. 🔑 Secure Credentials & Google OAuth Auth

- Fully secured routes utilizing `NextAuth` credentials authentication alongside **Google Social Sign-in**.

---

## 🛠️ Environment Setup

To run the application locally or in production, create a `.env.local` (local development) or set the variables in your hosting environment:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Gemini AI API
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Authentication & Social Login
AUTH_SECRET=your_nextauth_jwt_signing_secret
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret
```

---

## 💻 Git Commands & Local Setup

Get the application running on your local machine by following these instructions:

### 1. Clone the Repository

Clone the codebase and navigate into the project folder:

```bash
git clone https://github.com/shabareesha185/ResumeIQ-AI.git
cd ResumeIQ-AI
```

### 2. Switch Branches (Optional)

Check the current branch and switch if needed:

```bash
# View all local branches
git branch

# Switch to main
git checkout main
```

### 3. Install Project Dependencies

Use `npm` to install mammoth, genai, next-auth, pdf2json, recharts, and other packages:

```bash
npm install
```

### 4. Run Development Server

Start the Next.js local development process:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser to interact with the application.

### 5. Verify & Build

Run the linter and compile the optimized production bundle locally to guarantee build readiness:

```bash
# Check code syntax/rules
npm run lint

# Build production bundle
npm run build
```
