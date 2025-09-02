/**
 * Layout Component - Base layout with header and footer
 * Wraps page content with consistent navigation and footer
 */

import { renderHeader, initializeHeader } from './Header.js';
import { renderFooter } from './Footer.js';

/**
 * Render a page with header and footer
 * @param {string} content - The main page content
 * @param {Object} options - Layout options
 */
export function renderWithLayout(content, options = {}) {
  const {
    showHeader = true,
    showFooter = true,
    containerClass = 'min-h-screen flex flex-col'
  } = options;

  return `
    <div class="${containerClass}">
      ${showHeader ? renderHeader() : ''}
      <main class="flex-1">
        ${content}
      </main>
      ${showFooter ? renderFooter() : ''}
    </div>
  `;
}

/**
 * Initialize layout interactions
 */
export function initializeLayout() {
  console.log('🏗️ Initializing layout...');
  
  // Always reinitialize header after layout render
  // Reset the mounted flag to ensure proper reinitialization
  window.__headerMounted = false;
  
  initializeHeader().then(() => {
    console.log('🏗️ Layout initialized successfully');
  }).catch(error => {
    console.error('🏗️ Layout initialization error:', error);
  });
}

export default renderWithLayout;