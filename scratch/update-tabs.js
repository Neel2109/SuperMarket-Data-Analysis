import fs from 'fs';
import path from 'path';

const tabsDir = path.join(process.cwd(), 'src/components/tabs');
const files = fs.readdirSync(tabsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  if (file === 'OverviewTab.tsx') continue; // Already updated

  const filePath = path.join(tabsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already imported
  if (content.includes('MultiChartSection')) {
    continue;
  }

  // 1. Add import
  // Find where to add import - usually after other imports, before the interface or component definition
  const importStatement = "import { MultiChartSection } from '../MultiChartSection';\n";
  
  if (content.includes('import { SaleRecord } from \'../../types\';')) {
    content = content.replace('import { SaleRecord } from \'../../types\';', 'import { SaleRecord } from \'../../types\';\n' + importStatement);
  } else {
    // just append after first import
    const firstImportEnd = content.indexOf(';\n') + 2;
    content = content.slice(0, firstImportEnd) + importStatement + content.slice(firstImportEnd);
  }

  // 2. Add component before last </div>
  // This is tricky, we can find the last `</div>` before `);` and insert there.
  const regex = /<\/div>\s*\);\s*(};|export default)/g;
  const match = [...content.matchAll(regex)];
  if (match.length > 0) {
    const lastMatch = match[match.length - 1];
    const insertPos = lastMatch.index;
    const title = file.replace('Tab.tsx', '').replace(/([A-Z])/g, ' $1').trim() + ' Analytics';
    
    // Check if data is available in props. Usually it's `data`
    // If not, we pass empty array or try to find it. Most tabs have `data`.
    // Exception: DataModelTab and DaxStudioTab don't have data.
    const hasDataProp = content.includes('data: SaleRecord[]');
    const dataAttr = hasDataProp ? 'data={data}' : 'data={[]}';

    const insertText = `      <MultiChartSection ${dataAttr} title="${title}" />\n    </div>\n  );\n};`;
    
    // Replace the matched string with our new string
    content = content.slice(0, insertPos) + insertText;
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
