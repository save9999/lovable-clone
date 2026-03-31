import { FileNode } from "./types";

function processComponent(filename: string, code: string, isMain: boolean): string {
  const componentName = filename.replace(/\.(tsx|jsx|ts|js)$/, "");

  // Strip React imports (global via CDN)
  code = code.replace(/^import\s+React[^;]*;?\s*\n/gm, "");
  code = code.replace(/^import\s+type\s+\{[^}]*\}\s+from\s+['"]react['"];?\s*\n/gm, "");
  code = code.replace(/^import\s+\{[^}]*\}\s+from\s+['"]react['"];?\s*\n/gm, "");

  // Strip CSS imports
  code = code.replace(/^import\s+['"][^'"]*\.css['"];?\s*\n/gm, "");

  // Strip local imports (components already inlined)
  code = code.replace(/^import\s+.*?\s+from\s+['"]\.[^'"]*['"];?\s*\n/gm, "");

  // Strip external lib imports (not available in browser without bundler)
  code = code.replace(/^import\s+.*?;?\s*\n/gm, "");

  // Transform "export default function ComponentName" -> window.ComponentName = function ComponentName
  code = code.replace(
    /export\s+default\s+function\s+(\w+)/g,
    `window.$1 = function $1`
  );
  code = code.replace(
    /export\s+default\s+class\s+(\w+)/g,
    `window.$1 = class $1`
  );

  // Transform arrow function exports: "const Foo = () => {..." + "export default Foo"
  code = code.replace(/^export\s+default\s+(\w+)\s*;?\s*$/gm, (_, name) => {
    return `window.${name} = ${name}; ${isMain ? `window.__Main = window.${name};` : ""}`;
  });

  // Named exports - remove export keyword
  code = code.replace(/^export\s+(const|let|var|function|class)\s+/gm, "$1 ");
  code = code.replace(/^export\s+\{[^}]*\}\s*;?\s*\n/gm, "");

  // TypeScript: remove type/interface exports
  code = code.replace(/^(export\s+)?(type|interface)\s+\w+[^;{]*(\{[^}]*\}|;)?\s*\n/gm, "");

  // If main component, mark it
  if (isMain) {
    code += `\n// Auto-detect main component\nif (typeof App !== 'undefined') window.__Main = App;\nif (typeof ${componentName} !== 'undefined') window.__Main = window.__Main || ${componentName};\n`;
  }

  return code;
}

export function buildReactPreview(files: FileNode[]): string {
  if (!files.length) return "<html><body><p>Aucun fichier</p></body></html>";

  const tsxFiles = files.filter((f) => /\.(tsx|jsx)$/.test(f.path));
  const cssFiles = files.filter((f) => /\.css$/.test(f.path) && !f.path.includes("globals"));
  const globalCss = files.find((f) => f.name === "globals.css");

  const allCSS = [...(globalCss ? [globalCss] : []), ...cssFiles]
    .map((f) => f.content)
    .join("\n");

  // Identifier le fichier principal
  const mainFile = tsxFiles.find(
    (f) => f.name === "App.tsx" || f.name === "App.jsx" || f.name === "page.tsx" || f.name === "index.tsx"
  ) || tsxFiles[0];

  // Trier : composants d'abord, main en dernier
  const orderedFiles = [
    ...tsxFiles.filter((f) => f !== mainFile),
    ...(mainFile ? [mainFile] : []),
  ];

  const processedCode = orderedFiles
    .map((f) => `// === ${f.name} ===\n${processComponent(f.name, f.content, f === mainFile)}`)
    .join("\n\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    ${allCSS}
  </style>
</head>
<body>
  <div id="root"></div>

  <script>
    // Globals depuis CDN
    var { useState, useEffect, useRef, useCallback, useMemo, useContext,
          createContext, Fragment, forwardRef, memo, useReducer,
          useLayoutEffect, useImperativeHandle, useDebugValue, useId } = React;
    window.__Main = null;
  </script>

  <script type="text/babel" data-presets="react,typescript">
${processedCode}

    // Render
    try {
      const RootComponent = window.__Main || window.App || window.Page;
      if (!RootComponent) throw new Error("Aucun composant principal trouvé (App, Page, ou export default)");
      const rootEl = document.getElementById('root');
      const root = ReactDOM.createRoot(rootEl);
      root.render(React.createElement(RootComponent));
    } catch(err) {
      document.getElementById('root').innerHTML =
        '<div style="padding:24px;color:#f87171;font-family:monospace;font-size:13px;background:#1a1a1a;min-height:100vh">' +
        '<div style="background:#2a1a1a;border:1px solid #7f1d1d;border-radius:8px;padding:16px">' +
        '<strong style="color:#fca5a5">Erreur de rendu :</strong><br/><br/>' +
        err.message + '</div></div>';
    }
  </script>

  <script>
    window.addEventListener('error', function(e) {
      if (e.message && !e.message.includes('ResizeObserver')) {
        const root = document.getElementById('root');
        if (root && root.innerHTML === '') {
          root.innerHTML =
            '<div style="padding:24px;color:#f87171;font-family:monospace;font-size:13px">' +
            '<strong>Erreur :</strong> ' + e.message + '</div>';
        }
      }
    });
  </script>
</body>
</html>`;
}
