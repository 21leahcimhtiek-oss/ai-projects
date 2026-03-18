#!/usr/bin/env python3
"""
Script to add Vercel Web Analytics to all index.html files in the apps directory.
Based on official documentation: https://vercel.com/docs/analytics/quickstart
"""

import os
import re
from pathlib import Path

# Vercel Analytics script for static HTML sites (from official docs)
ANALYTICS_SCRIPT = """  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
"""

def add_analytics_to_html(file_path):
    """Add Vercel Analytics script to an HTML file before </head> tag."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if analytics already exists
        if 'window.va' in content or '_vercel/insights' in content:
            print(f"⏭️  Skipped {file_path} - Analytics already present")
            return False
        
        # Find </head> tag and insert analytics before it
        if '</head>' not in content:
            print(f"⚠️  Warning: No </head> tag found in {file_path}")
            return False
        
        # Replace the first occurrence of </head> with analytics + </head>
        new_content = content.replace('</head>', f'{ANALYTICS_SCRIPT}</head>', 1)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Added analytics to {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Process all index.html files in the apps directory."""
    apps_dir = Path('./apps')
    
    if not apps_dir.exists():
        print("❌ Apps directory not found!")
        return
    
    # Find all index.html files
    html_files = list(apps_dir.glob('*/index.html'))
    
    print(f"🔍 Found {len(html_files)} HTML files to process\n")
    
    modified_count = 0
    skipped_count = 0
    
    for html_file in sorted(html_files):
        if add_analytics_to_html(html_file):
            modified_count += 1
        else:
            skipped_count += 1
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Modified: {modified_count}")
    print(f"   ⏭️  Skipped: {skipped_count}")
    print(f"   📁 Total: {len(html_files)}")
    print("\n✨ Vercel Web Analytics installation complete!")
    print("   Next steps:")
    print("   1. Deploy to Vercel")
    print("   2. Enable Web Analytics in your Vercel dashboard")
    print("   3. Analytics will start tracking after deployment")

if __name__ == '__main__':
    main()
