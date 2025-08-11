# StyleSnap AI

## 🐞 Known Bugs

- **Upload image local persist issue:**  
  When a user uploads an image, it is stored in local storage. However, due to browser security restrictions, the file's object URL is not persistent across page reloads. This means that after reloading the page, the uploaded image is lost and cannot be previewed or used again.  
  _Potential solution: Consider using IndexedDB or prompting the user to re-upload after reload._

---

## ✅ Progress & Checklist (as of 12/8/2025)

- [x] Work on UI loading states for a smoother experience. _(Done)_
- [ ] Improve the download UI for styled images.
- [ ] Integrate AI-powered image generation.
- [ ] Test with browser inspect/tools to ensure free image download and preview works as expected.
- [ ] Ensure image preview is clear and accessible before download.

---

## 🚀 Features

- **Image Upload:** Upload PNG, JPEG, and other image formats.
- **Live Preview:** Instantly preview your uploaded image.
- **Trending Styles:** Browse and pick from popular style presets.
- **AI Generation:** Apply AI to generate new styled images.
- **Download:** Download your styled image for free.

---

## 🛠️ Getting Started

To run the project locally:

1. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open in Browser**

   Go to [http://localhost:3000](http://localhost:3000) to use the app.

---
