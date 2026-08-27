#!/bin/bash
sed -i 's/#sidebar.mobile-show {/#sidebar.mobile-show {\n  transform: translateY(0);\n  pointer-events: auto;\n}/' /tmp/Hans-Tools/src/css/styles.css
sed -i 's/#sidebar-overlay.show {/#sidebar-overlay.show {\n  opacity: 1;\n  pointer-events: auto;\n}/' /tmp/Hans-Tools/src/css/styles.css
