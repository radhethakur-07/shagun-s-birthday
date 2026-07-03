# 🎂 Happy Birthday Shagun! — Birthday Website

A beautifully designed, animated birthday website for Shagun built with React + Vite.
Deployed on Vercel. ✨

---

## 🌟 Features

- **Animated Hero** — Big glowing name, stars, floating balloons & emojis
- **Interactive Cake** — Click to blow out candles → slice the cake → confetti explosion 🎉
- **Special Message** — Heartfelt friendship birthday message on a glassmorphism card
- **Photo Gallery** — Masonry grid with lightbox, add Shagun's photos easily
- **Music Player** — Happy Birthday melody synthesized in the browser (no MP3 needed!) 🎵
- **Floating Elements** — Petals, butterflies, hearts drifting across the screen
- **"Made by Hariom"** — Signature at the bottom right
- **Fully Responsive** — Works beautifully on mobile & desktop

---

## 🚀 How to Deploy on Vercel (Step by Step)

### Step 1 — Push to GitHub

1. Create a new repository on GitHub (e.g., `birthday-shagun`)
2. Upload all project files to the repository
   - You can drag & drop the entire folder on GitHub's web interface
   - Or use GitHub Desktop

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `birthday-shagun` repository
4. Vercel will auto-detect it as a Vite project ✅
5. Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"** 🚀

Your site will be live in ~1 minute!

---

## 📸 Adding Photos to the Gallery

1. **Add your photo files** to the `public/photos/` folder in your GitHub repo
   - Supported: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Tip: Compress images at [squoosh.app](https://squoosh.app) for faster loading

2. **Edit `src/data/photos.js`** — uncomment and update entries:
   ```js
   export const photos = [
     { id: 1, src: '/photos/photo1.jpg', caption: 'Beautiful Shagun! 💕', span: 2 },
     { id: 2, src: '/photos/photo2.jpg', caption: 'Smiling always 🌸', span: 1 },
     { id: 3, src: '/photos/photo3.jpg', caption: 'Happy Birthday! 🎂', span: 1 },
   ];
   ```
   - `span: 2` → taller card (great for portrait photos)
   - `span: 1` → normal height

3. **Commit and push** — Vercel auto-redeploys in seconds!

---

## ✏️ Customizing the Message

Edit `src/components/SpecialMessage.jsx` to change the birthday message text.

---

## 🎵 About the Music

The Happy Birthday melody is **synthesized directly in the browser** using the Web Audio API — no external files needed! Just click the music player in the bottom-left corner to play/pause.

---

## 📁 Project Structure

```
birthday-shagun/
├── public/
│   └── photos/          ← Add Shagun's photos here!
│       └── README.md
├── src/
│   ├── components/
│   │   ├── Hero.jsx         ← Landing section
│   │   ├── CakeCutting.jsx  ← Interactive cake animation
│   │   ├── SpecialMessage.jsx ← Birthday message
│   │   ├── Gallery.jsx      ← Photo gallery
│   │   ├── MusicPlayer.jsx  ← Happy Birthday music
│   │   ├── FloatingElements.jsx ← Floating petals & emojis
│   │   └── Footer.jsx       ← Footer + "Made by Hariom"
│   ├── data/
│   │   └── photos.js        ← ← Edit this to add photos!
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 💜 Made with love by Hariom
