#!/bin/bash
# Revert index.html to default
cd /tmp/Hans-Tools
git checkout index.html

# Apply tailwind classes for the overlay and sidebar behavior
sed -i 's|class="fixed left-0 top-16 z-30 h-\[calc(100vh-4rem)\] w-56 bg-slate-950/90 backdrop-blur-lg border-r border-blue-500/10 overflow-y-auto hidden lg:block"|class="fixed left-0 top-16 z-30 w-full lg:w-56 bg-slate-950/90 backdrop-blur-lg border-b lg:border-b-0 lg:border-r border-blue-500/10 overflow-y-auto transform -translate-y-full lg:translate-y-0 transition-transform duration-300 pointer-events-none lg:pointer-events-auto max-h-[60vh] lg:h-[calc(100vh-4rem)] lg:max-h-none hidden lg:block"|' index.html

sed -i 's|class="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm hidden lg:hidden"|class="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 hidden lg:hidden"|' index.html
