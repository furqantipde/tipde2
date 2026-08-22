import{i as e,n as t,t as n}from"./jsx-runtime-Cltr0gcK.js";var r=e(t(),1),i=n();function a(){let[e,t]=(0,r.useState)(`# Welcome to Markdown Preview

## Features
- **Bold text** and *italic text*
- [Links](https://example.com)
- Inline \`code\` blocks

### Lists
1. First item
2. Second item
3. Third item

> This is a blockquote

---

| Feature | Status |
|---------|--------|
| Bold | ✅ |
| Italic | ✅ |
| Links | ✅ |

\`\`\`
code block here
\`\`\`
`);return(0,i.jsxs)(`div`,{className:`space-y-4`,children:[(0,i.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]`,children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`label`,{className:`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1`,children:`Markdown`}),(0,i.jsx)(`textarea`,{value:e,onChange:e=>t(e.target.value),className:`w-full h-[500px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono p-4 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none`,spellCheck:!1})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`label`,{className:`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1`,children:`Preview`}),(0,i.jsx)(`div`,{className:`w-full h-[500px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 overflow-y-auto prose-sm`,dangerouslySetInnerHTML:{__html:(e=>{let t=e;return t=t.replace(/```([\s\S]*?)```/g,`<pre class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto text-sm font-mono my-2"><code>$1</code></pre>`),t=t.replace(/`([^`]+)`/g,`<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>`),t=t.replace(/^### (.+)$/gm,`<h3 class="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>`),t=t.replace(/^## (.+)$/gm,`<h2 class="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h2>`),t=t.replace(/^# (.+)$/gm,`<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h1>`),t=t.replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`),t=t.replace(/\*(.+?)\*/g,`<em>$1</em>`),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,`<a href="$2" class="text-primary-600 dark:text-primary-400 underline" target="_blank" rel="noopener">$1</a>`),t=t.replace(/^> (.+)$/gm,`<blockquote class="border-l-4 border-primary-500 pl-4 py-1 my-2 text-gray-600 dark:text-gray-400 italic">$1</blockquote>`),t=t.replace(/^---$/gm,`<hr class="my-4 border-gray-200 dark:border-gray-700" />`),t=t.replace(/^- (.+)$/gm,`<li class="ml-4 list-disc text-gray-700 dark:text-gray-300">$1</li>`),t=t.replace(/^\d+\. (.+)$/gm,`<li class="ml-4 list-decimal text-gray-700 dark:text-gray-300">$1</li>`),t=t.replace(/\|(.+)\|/g,e=>e.includes(`---`)?``:`<tr>${e.split(`|`).filter(e=>e.trim()).map(e=>`<td class="border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm">${e.trim()}</td>`).join(``)}</tr>`),t=t.replace(/^(?!<[hluobpt]|<li|<hr|<pre|<tr)(.+)$/gm,`<p class="my-1 text-gray-700 dark:text-gray-300">$1</p>`),t})(e)}})]})]}),(0,i.jsxs)(`div`,{className:`text-xs text-gray-500 dark:text-gray-400`,children:[e.length,` characters · `,e.split(/\s+/).filter(Boolean).length,` words`]})]})}export{a as default};