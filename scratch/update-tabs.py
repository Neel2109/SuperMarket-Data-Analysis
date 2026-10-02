import os
import re

tabs_dir = os.path.join(os.getcwd(), 'src', 'components', 'tabs')

if not os.path.exists(tabs_dir):
    print(f"Directory not found: {tabs_dir}")
    exit(1)

files = [f for f in os.listdir(tabs_dir) if f.endswith('.tsx')]

for file in files:
    if file == 'OverviewTab.tsx':
        continue  # Already updated

    file_path = os.path.join(tabs_dir, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already imported
    if 'MultiChartSection' in content:
        continue

    # 1. Add import
    import_statement = "import { MultiChartSection } from '../MultiChartSection';\n"
    
    if "import { SaleRecord } from '../../types';" in content:
        content = content.replace(
            "import { SaleRecord } from '../../types';",
            "import { SaleRecord } from '../../types';\n" + import_statement
        )
    else:
        # just append after first import
        first_import_end = content.find(';\n')
        if first_import_end != -1:
            first_import_end += 2
            content = content[:first_import_end] + import_statement + content[first_import_end:]
        else:
            content = import_statement + content

    # 2. Add component before last </div>
    regex = r'<\/div>\s*\);\s*(};|export default)'
    matches = list(re.finditer(regex, content))
    
    if len(matches) > 0:
        last_match = matches[-1]
        insert_pos = last_match.start()
        
        # e.g. "PaymentAnalyticsTab.tsx" -> "PaymentAnalytics" -> "Payment Analytics"
        base_name = file.replace('Tab.tsx', '')
        title_part = re.sub(r'([A-Z])', r' \1', base_name).strip()
        title = f"{title_part} Analytics"
        
        has_data_prop = 'data: SaleRecord[]' in content
        data_attr = 'data={data}' if has_data_prop else 'data={[]}'
        
        # Match original JS script logic
        insert_text = f'      <MultiChartSection {data_attr} title="{title}" />\n    </div>\n  );\n}};'
        
        content = content[:insert_pos] + insert_text
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Updated {file}")
