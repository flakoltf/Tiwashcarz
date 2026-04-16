import os
import re

dir_path = '.'
html_files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

mapping = {
    'bg-brand-darker': 'bg-white dark:bg-brand-darker',
    'bg-brand-dark': 'bg-gray-50 dark:bg-brand-dark',
    'bg-gray-800': 'bg-gray-100 dark:bg-gray-800',
    'bg-gray-900': 'bg-gray-200 dark:bg-gray-900',
    'border-gray-800': 'border-gray-200 dark:border-gray-800',
    'border-gray-700': 'border-gray-300 dark:border-gray-700',
    'text-gray-400': 'text-gray-600 dark:text-gray-400',
    'text-gray-300': 'text-gray-700 dark:text-gray-300',
    'text-gray-500': 'text-gray-500 dark:text-gray-400',
}

def p(m):
    c = m.group(1).split()
    n = []
    # If the element has a blue or colored background, the text must stay white even in light mode.
    cb = any(x in ['bg-brand-blue','bg-green-500','bg-red-500','bg-blue-600'] for x in c)
    for x in c:
        if x in mapping: n.append(mapping[x])
        elif x == 'text-white' and not cb: n.append('text-gray-900 dark:text-white')
        else: n.append(x)
    return 'class="' + ' '.join(n) + '"'

for fn in html_files:
    p_path = os.path.join(dir_path, fn)
    with open(p_path, 'r', encoding='utf-8') as f: c = f.read()
    
    if 'dark:bg-brand-darker' in c: continue
    
    c = re.sub(r'class="([^"]+)"', p, c)
    c = re.sub(r'tailwind\.config\s*=\s*\{', "tailwind.config = { darkMode: 'class',", c)
    
    ts = """
    <!-- Theme Init -->
    <script src="theme.js"></script>
</head>"""
    c = re.sub(r'</head>', ts, c, flags=re.IGNORECASE)
    
    with open(p_path, 'w', encoding='utf-8') as f: f.write(c)

print("Migration terminée !")
