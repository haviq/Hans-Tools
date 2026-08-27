#!/bin/bash
cd /tmp/Hans-Tools
# Remove old block display that breaks transition
sed -i 's/display: block;//g' src/css/styles.css

# Rewrite correctly
sed -i 's/#sidebar.mobile-show {/#sidebar.mobile-show {\n  transform: translateY(0);\n  pointer-events: auto;\n  display: block;\n}/' src/css/styles.css
sed -i 's/#sidebar-overlay.show {/#sidebar-overlay.show {\n  opacity: 1;\n  pointer-events: auto;\n  display: block;\n}/' src/css/styles.css

npm run build > /tmp/build7.log 2>&1; echo $?
