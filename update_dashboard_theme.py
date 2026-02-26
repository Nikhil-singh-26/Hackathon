import re

with open('src/pages/dashboard/Dashboard.css', 'r') as f:
    content = f.read()

# Accents
content = content.replace('color: #c084fc;', 'color: var(--color-accent);')
content = content.replace('linear-gradient(135deg, #c026d3, #e879f9)', 'linear-gradient(135deg, var(--color-primary), var(--color-accent))')
content = content.replace('linear-gradient(135deg, #7c3aed, #a78bfa)', 'linear-gradient(135deg, var(--color-primary), var(--color-accent))')

# Shadows and borders
content = content.replace('rgba(192, 38, 211, 0.25)', 'color-mix(in srgb, var(--color-primary) 25%, transparent)')
content = content.replace('rgba(192, 38, 211, 0.2)', 'color-mix(in srgb, var(--color-primary) 20%, transparent)')
content = content.replace('rgba(192, 38, 211, 0.06)', 'color-mix(in srgb, var(--color-primary) 6%, transparent)')
content = content.replace('rgba(124, 58, 237, 0.35)', 'color-mix(in srgb, var(--color-primary) 35%, transparent)')
content = content.replace('rgba(124, 58, 237, 0.5)', 'color-mix(in srgb, var(--color-primary) 50%, transparent)')

# Backgrounds and text
# .os-layout
content = content.replace('background: #0a0a0a;', 'background: var(--bg-gradient);')
content = re.sub(r'color: #fff;(.*?)/\* ======================== SIDEBAR ======================== \*/', r'color: var(--color-text-main);\1/* ======================== SIDEBAR ======================== */', content, flags=re.DOTALL)

# Let's dynamically replace all `background: #0a0a0a;`
# But .os-chart-placeholder and .os-empty-state use #0a0a0a. Let's make it use rgba surface.
content = content.replace('background: #0a0a0a;', 'background: var(--color-surface-dark);')

# .os-sidebar
content = content.replace('background: #0f0f0f;', 'background: var(--color-light-bg);')

# .os-stat-card, .os-panel
content = content.replace('background: #111;', 'background: var(--color-light-bg);')

# Borders
content = content.replace('1px solid rgba(255, 255, 255, 0.06)', 'var(--glass-border)')
content = content.replace('1px solid rgba(255, 255, 255, 0.04)', 'var(--glass-border)')
content = content.replace('1px solid rgba(255, 255, 255, 0.08)', 'var(--glass-border)')

# Text colors
content = content.replace('color: #fff;', 'color: var(--color-text-main);')
content = content.replace('color: #e4e4e7;', 'color: var(--color-text-main);')
content = content.replace('color: #a1a1aa;', 'color: var(--color-text-muted);')
content = content.replace('color: #71717a;', 'color: var(--color-text-muted);')
content = content.replace('color: #52525b;', 'color: var(--color-text-muted);')

with open('src/pages/dashboard/Dashboard.css', 'w') as f:
    f.write(content)

print("Updated Dashboard.css")
