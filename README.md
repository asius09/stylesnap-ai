# StyleSnap AI

## 🐞 Known Bugs

- **Upload image local persist issue:**  
  When a user uploads an image, it is stored in local storage. However, due to browser security restrictions, the file's object URL is not persistent across page reloads. This means that after reloading the page, the uploaded image is lost and cannot be previewed or used again.  
  _Potential solution: Consider using IndexedDB or prompting the user to re-upload after reload._
  - **Prompt suggestion:** If an uploaded image is missing after reload (detected via local storage), show a prompt to the user asking them to re-upload the image. This can be handled in the local storage logic of the app.

---

## ✅ Progress & Checklist (as of 12/8/2025)

- [x] Work on UI loading states for a smoother experience. _(Done)_
- [x] Improve the download UI for styled images. _(Done)_
- [ ] Integrate AI-powered image generation.
- [ ] Limit to one free image generation per IP or user (add restriction logic).
- [ ] Ensure no one can download images for free from inspect tools; test with browser inspect/tools to ensure free image download and preview works as expected.
- [ ] Ensure image preview is clear and accessible before download.
- [ ] Show a prompt to re-upload if the uploaded image is missing after reload (local storage handler).

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

## 📁 Project Structure

```
stylesmap-ai/
├── public/
│   ├── 1980b-pop-art.png
│   ├── demo-art.png
│   ├── demo-yat.png
│   └── ghibis-art.png
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   └── upload/
│   │   │       ├── page.tax
│   │   ├── global.css
│   │   ├── layout.tax
│   │   └── page.tax
│   ├── components/
│   │   ├── AppHeader.tax
│   │   ├── ArrowIndicator.tax
│   │   ├── Button.tax
│   │   ├── Loader.tax
│   │   ├── MyDropzone.tax
│   │   ├── PreviewCard.tax
│   │   ├── ProgressBar.tax
│   │   ├── SocialIcon.tax
│   │   ├── SocialShare.tax
│   │   └── StyleCard.tax
│   ├── hooks/
|   |    └── useLocalStorage.tsx
│   └── types/
│       ├── style.types.ts
│       └── data.ts
├── .gitignore
└── README.md
```

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
