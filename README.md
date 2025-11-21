# FaceMetric - AI Facial Structure & Golden Ratio Analyzer

![FaceMetric Banner](https://via.placeholder.com/1200x600/0a0a0a/0070f3?text=FaceMetric+AI)

## 📖 About

**FaceMetric** is a cutting-edge web application designed to analyze facial structure and symmetry using advanced AI. By leveraging Google's MediaPipe technology, FaceMetric provides real-time analysis of face shapes and calculates the "Golden Ratio" score of facial features.

Whether you're interested in aesthetics, styling, or just curious about your facial geometry, FaceMetric offers a precise, scientific approach to understanding your unique features.

## ✨ Features

- **Real-time Analysis**: Instant face mesh detection via webcam.
- **Photo Upload**: Analyze existing photos with high precision.
- **Manual Input**: Input measurements manually for specific calculations.
- **Face Shape Detection**: Automatically identifies face shapes (Oval, Round, Square, etc.).
- **Golden Ratio Score**: Calculates facial symmetry and proportions based on the Golden Ratio (1.618).
- **History Tracking**: Save your analysis results to the cloud (Firebase) to track changes over time.
- **User Authentication**: Secure login via Google to manage your personal history.
- **Privacy First**: All processing happens client-side or securely in your private cloud instance.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI/CV**: [MediaPipe Face Mesh](https://developers.google.com/mediapipe)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started Locally

1. **Clone the repository**

    ```bash
    git clone https://github.com/vksaini-d/FACEMATERIC.git
    cd FACEMATERIC
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure Firebase**
    - Create a project at [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** (Google Provider).
    - Enable **Firestore Database**.
    - Update `src/lib/firebase.ts` with your config keys if they differ.

4. **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment to Vercel

Deploying FaceMetric to Vercel is simple and recommended for the best performance.

### Prerequisites

* A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account.
- A [Firebase](https://firebase.google.com) project.

### Steps

1. **Push to GitHub**
    Ensure your latest code is pushed to your GitHub repository.

    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin master
    ```

2. **Import to Vercel**
    - Log in to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your `FACEMATERIC` repository.

3. **Configure Project**
    - **Framework Preset**: Next.js (Auto-detected).
    - **Root Directory**: `./` (Default).
    - **Environment Variables**: You typically don't need to set build-time env vars for this client-side Firebase setup, but for security, it's best practice to move Firebase config to `.env.local` and add them here.
        - *If you moved keys to env vars, add them here (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`).*

4. **Deploy**
    - Click **"Deploy"**.
    - Wait for the build to complete (approx. 1-2 mins).

5. **Finalize Firebase Auth**
    - Once deployed, copy your new Vercel domain (e.g., `facemetric.vercel.app`).
    - Go to **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized Domains**.
    - **Add Domain**: Paste your Vercel domain here. This is crucial for Google Sign-In to work.

6. **Done!**
    Your app is now live globally!

## 📄 License

This project is licensed under the MIT License.
