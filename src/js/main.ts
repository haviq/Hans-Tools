import { categories } from './config/tools.js';
import { dom, switchView, hideAlert } from './ui.js';
import { setupToolInterface } from './handlers/toolSelectionHandler.js';
import { createIcons, icons } from 'lucide';
import * as pdfjsLib from 'pdfjs-dist';
import "../css/styles.css";

import { initRandomLetterSwap } from './randomLetterSwap.js';
import { initDitherEffect } from './ditherEffect.js';
import { initScroll3D } from './scroll3d.js';

const init = () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
    ).toString();

    dom.toolGrid.textContent = '';

    // Sidebar kategori — klik scroll ke category group
    const sidebarCat = document.getElementById('sidebar-categories');
    if (sidebarCat) {
        categories.forEach(cat => {
            const a = document.createElement('a');
            a.href = '#tools-header';
            a.textContent = cat.name;
            a.addEventListener('click', () => {
                const groups = dom.toolGrid.querySelectorAll('.category-group');
                const target = [...groups].find(g => g.querySelector('h2')?.textContent === cat.name);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('sidebar')?.classList.remove('mobile-show');
                document.getElementById('sidebar-overlay')?.classList.remove('show');
            });
            sidebarCat.appendChild(a);
        });
    }

    // Sembunyikan skeleton loader setelah grid siap
    const skeleton = document.getElementById('skeleton-loader');
    if (skeleton) skeleton.classList.add('hidden');

    categories.forEach(category => {
        const categoryGroup = document.createElement('div');
        categoryGroup.className = 'category-group col-span-full';

        const title = document.createElement('h2');
        title.className = 'text-xl font-bold text-sky-400 mb-4 mt-8 first:mt-0';
        title.textContent = category.name; 

        const toolsContainer = document.createElement('div');
        toolsContainer.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6';

        category.tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card group rounded-2xl bg-slate-900/60 border border-slate-800 p-4 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-sky-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/10';
            toolCard.dataset.toolId = tool.id; 
            // @ts-expect-error dynamic url
            if (tool.url) toolCard.dataset.url = tool.url;

                        const iconWrap = document.createElement('div');
            iconWrap.className = 'icon-tile w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 to-blue-600/20 border border-sky-500/20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110';
            const icon = document.createElement('i');
            icon.className = 'w-6 h-6 text-sky-300';
            icon.setAttribute('data-lucide', tool.icon);
            iconWrap.appendChild(icon);

            const toolName = document.createElement('h3');
            toolName.className = 'font-semibold text-white';
            toolName.textContent = tool.name;

            toolCard.append(iconWrap, toolName);

            if (tool.subtitle) {
                const toolSubtitle = document.createElement('p');
                toolSubtitle.className = 'text-xs text-gray-400 mt-1 px-2';
                toolSubtitle.textContent = tool.subtitle; 
                toolCard.appendChild(toolSubtitle);
            }

            toolsContainer.appendChild(toolCard);
        });

        categoryGroup.append(title, toolsContainer);
        dom.toolGrid.appendChild(categoryGroup);
    });

    // ===== Filter kategori agar tidak cape scroll =====
    const toolsHeader = document.getElementById('tools-header');
    const filterWrap = document.createElement('div');
    filterWrap.className = 'flex flex-wrap justify-center gap-2 mt-4';
    filterWrap.id = 'category-chips';
    const makeChip = (name: string, active = false) => {
        const chip = document.createElement('button');
        chip.textContent = name;
        chip.className = 'chip-filter' + (active ? ' active' : '');
        chip.dataset.cat = name;
        return chip;
    };
    filterWrap.appendChild(makeChip('Semua', true));
    categories.forEach(cat => filterWrap.appendChild(makeChip(cat.name)));
    if (toolsHeader) toolsHeader.appendChild(filterWrap);

    const applyFilter = (catName: string) => {
        filterWrap.querySelectorAll('.chip-filter').forEach(c => c.classList.toggle('active', (c as HTMLElement).dataset.cat === catName));
        dom.toolGrid.querySelectorAll('.category-group').forEach(group => {
            const titleEl = group.querySelector('h2');
            const name = titleEl ? titleEl.textContent || '' : '';
            group.classList.toggle('hidden', catName !== 'Semua' && name !== catName);
        });
    };
    filterWrap.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('.chip-filter') as HTMLElement | null;
        if (target && target.dataset.cat) applyFilter(target.dataset.cat);
    });
    if (sidebarCat) {
        sidebarCat.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                const name = a.textContent || '';
                applyFilter(name);
                const groups = dom.toolGrid.querySelectorAll('.category-group');
                const target = [...groups].find(g => g.querySelector('h2')?.textContent === name);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    const searchBar = document.getElementById('search-bar');
    const categoryGroups = dom.toolGrid.querySelectorAll('.category-group');

    searchBar.addEventListener('input', () => {
        // @ts-expect-error TS(2339) FIXME: Property 'value' does not exist on type 'HTMLEleme... Remove this comment to see the full error message
        const searchTerm = searchBar.value.toLowerCase().trim();

        categoryGroups.forEach(group => {
            const toolCards = group.querySelectorAll('.tool-card');
            let visibleToolsInCategory = 0;

            toolCards.forEach(card => {
                const toolName = card.querySelector('h3').textContent.toLowerCase();
                const toolSubtitle = card.querySelector('p')?.textContent.toLowerCase() || '';
                const isMatch = toolName.includes(searchTerm) || toolSubtitle.includes(searchTerm);

                card.classList.toggle('hidden', !isMatch);
                if (isMatch) {
                    visibleToolsInCategory++;
                }
            });

            group.classList.toggle('hidden', visibleToolsInCategory === 0);
        });
    });

    dom.toolGrid.addEventListener('click', (e) => {
        // @ts-expect-error TS(2339) FIXME: Property 'closest' does not exist on type 'EventTa... Remove this comment to see the full error message
        const card = e.target.closest('.tool-card') as HTMLElement | null;
        if (card) {
            const url = card.dataset.url;
            if (url) {
                window.open(url, '_blank', 'noopener');
                return;
            }
            const toolId = card.dataset.toolId;
            setupToolInterface(toolId);
        }
    });
    dom.backToGridBtn.addEventListener('click', () => switchView('grid'));
    dom.alertOkBtn.addEventListener('click', hideAlert);

    const faqAccordion = document.getElementById('faq-accordion');
    if (faqAccordion) {
        faqAccordion.addEventListener('click', (e) => {
            // @ts-expect-error TS(2339) FIXME: Property 'closest' does not exist on type 'EventTa... Remove this comment to see the full error message
            const questionButton = e.target.closest('.faq-question');
            if (!questionButton) return;

            const faqItem = questionButton.parentElement;
            const answer = faqItem.querySelector('.faq-answer');

            faqItem.classList.toggle('open');

            if (faqItem.classList.contains('open')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0px';
            }
        });
    }

    createIcons({ icons });

    // Hans-Tools branding effects
    initDitherEffect('#dither-canvas');
    initRandomLetterSwap('.rls-title');
    initScroll3D(document);

    // Mobile sidebar toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebarEl = document.getElementById('sidebar');
    const overlayEl = document.getElementById('sidebar-overlay');
    if (menuBtn && sidebarEl && overlayEl) {
        menuBtn.addEventListener('click', () => {
            sidebarEl.classList.toggle('mobile-show');
            overlayEl.classList.toggle('show');
        });
        overlayEl.addEventListener('click', () => {
            sidebarEl.classList.remove('mobile-show');
            overlayEl.classList.remove('show');
        });
    }

    console.log('Please share our tool and share the love!');
};

document.addEventListener('DOMContentLoaded', init);
// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
