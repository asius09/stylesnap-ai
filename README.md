# StyleSnap AI

[Live Demo](https://stylesnap-ai.vercel.app/)

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
- [x] Implement payment gateway.
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
├── .DS_Store
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
│   ├── .DS_Store
│   ├── 1980s-pop-art.png
│   ├── anime-art.png
│   ├── background.png
│   ├── disney-art.png
│   ├── ghibli-art.png
│   ├── logo.svg
│   ├── pop-surrealism.png
│   ├── retro-robots.png
│   └── textured-portrait.png
├── scripts
│   └── update-readme-structure.js
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── image-generator
│   │   │   │   └── route.ts
│   │   │   ├── order
│   │   │   │   └── route.ts
│   │   │   ├── trial
│   │   │   │   └── route.ts
│   │   │   ├── upload
│   │   │   │   └── route.ts
│   │   │   └── verify-payment
│   │   │       └── route.ts
│   │   ├── cancellations-and-refunds
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── privacy-policy
│   │   │   └── page.tsx
│   │   ├── shipping-policy
│   │   │   └── page.tsx
│   │   └── terms-and-conditions
│   │       └── page.tsx
│   ├── components
│   │   ├── AppHeader.tsx
│   │   ├── ArrowIndicator.tsx
│   │   ├── Button.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroDropZone.tsx
│   │   ├── Loader.tsx
│   │   ├── MessageDialog.tsx
│   │   ├── PreviewCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── RazorpayButton.tsx
│   │   ├── SocialIcon.tsx
│   │   ├── SocialShare.tsx
│   │   ├── StyleCard.tsx
│   │   ├── StyleSelectionDialog.tsx
│   │   ├── Toast.tsx
│   │   ├── pay
│   │   │   └── Paywall.tsx
│   │   └── sections
│   │       ├── FeatureSection.tsx
│   │       ├── HeroSection.tsx
│   │       └── StepsSection.tsx
│   ├── constant.ts
│   ├── data.ts
│   ├── hooks
│   │   ├── useDownloadImage.ts
│   │   ├── useFileRemove.ts
│   │   ├── useImageGeneration.ts
│   │   ├── useLocalStorage.tsx
│   │   ├── useProgressSteps.ts
│   │   ├── useStyleSelection.ts
│   │   └── useTrialId.ts
│   ├── lib
│   │   ├── apiResponse.ts
│   │   └── utils.ts
│   ├── types
│   │   ├── api.type.ts
│   │   ├── model.types.ts
│   │   └── style.types.ts
│   └── utils
│       ├── generateImage.ts
│       ├── idb.ts
│       ├── imageClient.ts
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

---

#### HTTP Status Codes in `src/app/api/image-generator/route.ts`

The API uses a clear set of HTTP status codes to communicate the result of each operation. Here’s an updated reference for their usage:

| Status Code | Usage / Meaning                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 201         | Created — Image generated successfully                                                                                                |
| 400         | Bad Request — Missing or invalid input (e.g., trialId, prompt, image_url)                                                             |
| 403         | Forbidden — Free trial ended, payment required, free limit reached, or paid credits exhausted                                         |
| 404         | Not Found — User, trial, or daily quota not found                                                                                     |
| 451         | Unavailable For Legal Reasons — Payment required by Replicate/external API (not the app user; e.g., Replicate account out of credits) |
| 500         | Internal Server Error — Server-side error (e.g., failed to fetch/update quota, unknown errors, Supabase issues)                       |
| 520         | Web Server Returned an Unknown Error — Replicate/external API error (not payment/model error)                                         |
| 522         | Connection Timed Out — Replicate/external model error (e.g., highlight/model error)                                                   |

**Quick Reference Table:**

| Status | Typical Context / Example                                     |
| ------ | ------------------------------------------------------------- |
| 201    | Image generated successfully                                  |
| 400    | Missing/invalid input (trialId, prompt, image_url)            |
| 403    | Free trial ended, payment required, free limit, credits spent |
| 404    | User/trial/quota not found                                    |
| 451    | Replicate payment required (external API, not app user)       |
| 500    | Internal server/Supabase error, unknown error                 |
| 520    | Replicate/external API error (not payment/model)              |
| 522    | Replicate/external model error (e.g., highlight/model error)  |

These status codes are consistently used in the route to provide precise feedback for both success and error scenarios, making it easier to handle responses on the frontend and debug issues.

---

### **Prompt Building Guide for Kontext (FLUX.1)**

#### **What You Can Do**

Kontext excels at:

- **Style Transfer:** Convert photos to different art styles (watercolor, oil painting, sketches)
- **Object/Clothing Changes:** Modify hairstyles, add accessories, change colors
- **Text Editing:** Replace text in signs, posters, and labels
- **Background Swapping:** Change environments while preserving subjects
- **Character Consistency:** Maintain identity across multiple edits

---

#### **Prompting Best Practices**

**Be Specific**

- Use clear, detailed language with exact colors and descriptions.
- Avoid vague terms like “make it better”.
- Name subjects directly: “the woman with short black hair” vs. “she”.

**Preserve Intentionally**

- Specify what should stay the same: “while keeping the same facial features”.
- Use “maintain the original composition” to preserve layout.
- For background changes: “Change the background to a beach while keeping the person in the exact same position”.

**Text Editing Tips**

- Use quotation marks: “replace ‘old text’ with ‘new text’”.
- Stick to readable fonts.
- Match text length when possible to preserve layout.

**Style Transfer**

- Be specific about artistic styles: “impressionist painting” not “artistic”.
- Reference known movements: “Renaissance” or “1960s pop art”.
- Describe key traits: “visible brushstrokes, thick paint texture”.

**Complex Edits**

- Break into smaller steps for better results.
- Start simple and iterate.
- Use descriptive action verbs instead of “transform” for more control.

---

#### **Tips Summary**

- Be specific with colors, styles, and descriptions
- Start simple and iterate on successful edits
- Preserve intentionally by stating what to keep unchanged
- Use quotation marks for exact text replacements
- Control composition by specifying camera angles and framing
- Choose verbs carefully — “change” vs “transform” gives different results

---

> **Use this guide when building prompts for best results with Kontext. Don’t lose any words from the above — every detail helps!**
