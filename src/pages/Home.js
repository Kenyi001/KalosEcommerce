/**
 * Home Page - Landing page for Kalos E-commerce
 */

import { renderWithLayout, initializeLayout } from '../components/Layout.js';

export function renderHomePage() {
  const content = `
    <div class="bg-kalos-white">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-brand to-deep-coral text-white py-20">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <h1 class="text-5xl md:text-6xl font-display font-semibold mb-6">
            Belleza a Domicilio
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-white/90">
            Conectamos profesionales de belleza con clientes en Bolivia
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              data-router-link 
              data-href="/buscar"
              class="bg-kalos-white text-brand px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Buscar Profesionales
            </button>
            <button 
              data-router-link 
              data-href="/auth/signup?role=professional"
              class="border-2 border-kalos-white text-kalos-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Soy Profesional
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-3xl font-display text-center mb-12 text-navy">
            ¿Cómo Funciona?
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🔍</span>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-navy">Busca</h3>
              <p class="text-gray-600">Encuentra profesionales cerca de ti</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">📅</span>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-navy">Reserva</h3>
              <p class="text-gray-600">Solicita tu cita preferida</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">✨</span>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-navy">Disfruta</h3>
              <p class="text-gray-600">Belleza en la comodidad de tu hogar</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-navy text-white">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-display mb-6">¿Listo para empezar?</h2>
          <p class="text-xl mb-8 text-white/90">
            Únete a la plataforma de belleza más confiable de Bolivia
          </p>
          <button 
            data-router-link 
            data-href="/auth/signup"
            class="bg-brand hover:bg-brand-hover text-kalos-white px-8 py-4 rounded-lg font-semibold transition-colors">
            Crear Cuenta Gratuita
          </button>
        </div>
      </section>
    </div>
  `;
  
  return renderWithLayout(content);
}

export function initializeHomePage() {
  initializeLayout();
}

export default renderHomePage;