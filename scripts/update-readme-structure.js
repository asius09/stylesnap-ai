// file: update-readme-structure.js
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const README_PATH = path.join(ROOT_DIR, "README.md");

// Directories to ignore
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git"]);

function generateTree(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  let tree = "";
  items.forEach((item, index) => {
    if (IGNORE_DIRS.has(item.name)) return; // skip ignored folders

    const isLast = index === items.length - 1;
    const pointer = isLast ? "└── " : "├── ";

    tree += `${prefix}${pointer}${item.name}\n`;

    if (item.isDirectory()) {
      tree += generateTree(
        path.join(dir, item.name),
        prefix + (isLast ? "    " : "│   "),
      );
    }
  });

  return tree;
}

function updateReadme() {
  if (!fs.existsSync(README_PATH)) {
    console.error("README.md not found");
    return;
  }

  const readmeContent = fs.readFileSync(README_PATH, "utf8");
  const treeStructure = "```\n" + generateTree(ROOT_DIR) + "```";

  const newContent = readmeContent.replace(
    /(<!-- FILE_STRUCTURE_START -->)([\s\S]*?)(<!-- FILE_STRUCTURE_END -->)/,
    `$1\n${treeStructure}\n$3`,
  );

  fs.writeFileSync(README_PATH, newContent);
  console.log("✅ README file structure updated!");
}

updateReadme();
