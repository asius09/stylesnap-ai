# StyleSnap AI

## 🐞 Known Bugs

- **Output image display issue:**  
  Sometimes, the generated output image does not display correctly on the result screen after generation.  
  _Potential solution: Debug the image generation and result rendering logic to ensure the output image is always shown when available._

---

## 🚧 Current Problems

- **Replicate API has a better version, but each output costs $0.025:**  
  Replicate offers a high-quality image generation API, but it is not free—each new output costs $0.025. This cost limitation makes it challenging to provide unlimited free generations. Free alternatives like Gemini, Stability AI, and Runway API have been tested, but none currently offer a suitable free tier.

---

## ✅ Progress & Checklist (as of 12/8/2025)

- [x] Work on UI loading states for a smoother experience. _(Done)_
- [x] Improve the download UI for styled images. _(Done)_
- [x] Integrate AI-powered image generation. _(Done)_
- [x] Limit to one free image generation per IP or user (add restriction logic). _(Done)_
- [x] Ensure image preview is clear and accessible before download. _(Done)_
- [x] Show a prompt to re-upload if the uploaded image is missing after reload (local storage handler). _(Done)_
- [x] Style the whole page for a polished look.
- [x] Handle SEO (add meta tags, improve discoverability).
- [x] Add more styles (at least 10), including anime and couple sections.
- [ ] Implement payment gateway.
- [ ] Testing.
- [ ] Replicate API testing.
- [ ] 🎉 Celebrate first 100 generated images!

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

---

### File Structure

<!-- FILE_STRUCTURE_START -->
```
├── .env
├── .gitignore
├── .prettierignore
├── .prettierrc
├── README.md
├── database.types.ts
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── 1980s-pop-art.png
│   ├── anime-art.png
│   ├── disney-art.png
│   └── ghibli-art.png
├── scripts
│   └── update-readme-structure.js
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── image-generator
│   │   │   │   └── route.ts
│   │   │   ├── trial
│   │   │   │   └── route.ts
│   │   │   └── upload
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── AppHeader.tsx
│   │   ├── ArrowIndicator.tsx
│   │   ├── Button.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroDropZone.tsx
│   │   ├── Loader.tsx
│   │   ├── MessageDialog.tsx
│   │   ├── MyDropzone.tsx
│   │   ├── PreviewCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SocialIcon.tsx
│   │   ├── SocialShare.tsx
│   │   ├── StyleCard.tsx
│   │   ├── StyleSelectionDialog.tsx
│   │   ├── Toast.tsx
│   │   └── sections
│   │       ├── ButtonCTASection.tsx
│   │       ├── FeatureSection.tsx
│   │       ├── HeroSection.tsx
│   │       ├── KeyPoints.tsx
│   │       └── StepsSection.tsx
│   ├── constant.ts
│   ├── data.ts
│   ├── hooks
│   │   ├── useFileRemove.ts
│   │   ├── useImageGeneration.ts
│   │   ├── useLocalStorage.tsx
│   │   ├── useProgressSteps.ts
│   │   ├── useScrollId.ts
│   │   ├── useScrollLock.ts
│   │   ├── useStyleSelection.ts
│   │   └── useTrialId.ts
│   ├── lib
│   │   └── utils.ts
│   ├── types
│   │   ├── api.type.ts
│   │   ├── model.types.ts
│   │   └── style.types.ts
│   └── utils
│       ├── buildResponse.ts
│       ├── downloadUtils.ts
│       ├── generateImage.ts
│       ├── idb.ts
│       ├── resolveImageUrl.ts
│       ├── supabase
│       │   └── server.ts
│       └── trialClient.ts
└── tsconfig.json
```
<!-- FILE_STRUCTURE_END -->

### Key Directories:

- **public/**: Static assets and images
- **src/app/**: Main application pages and layouts
- **src/components/**: Reusable UI components
- **src/types/**: Type definitions and data structures
- **README.md/**: Documentation and planning files

## Key Components

1. **AppHeader.tsx** - Main application header component
2. **Loader.tsx** - Animated loading component with particle effects
3. **StyleCard.tsx** - Component for displaying style cards
4. **MyDropzone.tsx** - File upload/dropzone component
5. **PreviewCard.tsx** - Preview component for uploaded content

## Installation

```bash
git clone [repository-url]
cd stylesmap-ai
npm install
npm run dev
```

## 📝 Commit Guidelines

To ensure clarity and consistency in our git history, please follow these commit message conventions. Below you'll find a summary table of the main structures, when to use them, and examples for each style.

---

### **Commit Message Structures Overview**

| Structure Format              | When to Use                                 | Example                                     |
| ----------------------------- | ------------------------------------------- | ------------------------------------------- |
| `<type>(<scope>): <subject>`  | Professional/semantic versioning projects   | `feat(loader): add particle animation`      |
| `<verb> <description>`        | Simple/personal/small projects              | `Add dark mode toggle`                      |
| `<imperative command>`        | Git's standard imperative style             | `Implement user authentication`             |
| `<context>: <description>`    | Complex projects, clear component reference | `Loader: Add particle animation effects`    |
| `<message> (#<issue-number>)` | Linking to issues/tickets                   | `Fix memory leak in image processor (#142)` |

---

### **Detailed Commit Message Styles & Examples**

#### 1. **Conventional Commits (Recommended)**

- **Format:** `<type>(<scope>): <subject>`
- **Use for:** Professional projects, semantic versioning, changelog automation.
- **Types:** feat, fix, docs, style, refactor, test, chore

| Type     | Description        | Example                                       |
| -------- | ------------------ | --------------------------------------------- |
| feat     | New feature        | `feat(loader): add particle animation`        |
| fix      | Bug fix            | `fix(upload): resolve file type validation`   |
| docs     | Documentation      | `docs(readme): add installation instructions` |
| refactor | Code restructuring | `refactor(header): simplify nav logic`        |
| chore    | Maintenance        | `chore(deps): update framer-motion to v10`    |

#### 2. **Action + Description**

- **Format:** `<verb> <description>`
- **Use for:** Simpler or personal projects.
- **Examples:**
  - `Add dark mode toggle`
  - `Fix image upload crash`
  - `Update dependencies`

#### 3. **Imperative Mood**

- **Format:** `<imperative command>`
- **Use for:** Following Git's own style.
- **Examples:**
  - `Implement user authentication`
  - `Remove unused dependencies`

#### 4. **Contextual Format**

- **Format:** `<context>: <description>`
- **Use for:** Large/complex projects, clear component reference.
- **Examples:**
  - `Loader: Add particle animation effects`
  - `API: Fix pagination limit bug`

#### 5. **GitHub/GitLab Issue Linking**

- **Format:** `<message> (#<issue-number>)`
- **Use for:** Linking commits to issues/tickets.
- **Examples:**
  - `Fix memory leak in image processor (#142)`
  - `Add user profile export feature (#87)`

---

### **Best Practices & Pro Tips**

- **First Line Rules:**
  - Keep under 50 characters
  - Capitalize first letter
  - No period at end

- **Optional Body:**
  - Use for context, reasoning, or details.
  - Separate from title with a blank line.
  - Example:

    ```
    Add responsive breakpoints for header

    - Added mobile menu toggle at 768px
    - Fixed z-index conflict with dropdowns
    - Updated tests for new behavior
    ```

- **Footer (for issue tracking):**
  - Example:

    ```
    Fix Safari rendering bug

    Closes #42
    Related to #38, #39
    ```

- **Avoid:**
  - Vague messages (e.g., "Update files")
  - Emotional comments (e.g., "Stupid bug fix")
  - All-caps shouting

---

### **Example Commit Workflow**

1. Make small, focused commits.
2. Use `git commit -m "Title" -m "Description"` for multi-line messages.
3. Check your history with `git log --oneline` before pushing.

---

By following these guidelines, we keep the StylesMap-AI project history clean, readable, and easy to maintain.  
Feel free to refer to this section whenever you make a commit!
