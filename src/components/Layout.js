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
  initializeHeader();
}

export default renderWithLayout;