// Post-build script to embed reviews directly in HTML files
import fs from 'fs';
import path from 'path';
import { REVIEWS } from './src/lib/data/reviews.ts';

// This runs after SSG generation
export async function embedReviewsPostBuild() {
  const outDir = './out';
  
  if (!fs.existsSync(outDir)) {
    console.log('✗ Output directory not found');
    return;
  }

  // Find all product HTML files
  const productDir = path.join(outDir, 'produit');
  if (!fs.existsSync(productDir)) {
    console.log('✗ No product directory');
    return;
  }

  let embedded = 0;

  // Scan for product folders
  const files = fs.readdirSync(productDir);
  for (const file of files) {
    const filePath = path.join(productDir, file);
    const indexPath = path.join(filePath, 'index.html');

    if (!fs.existsSync(indexPath)) continue;

    let html = fs.readFileSync(indexPath, 'utf-8');

    // Extract product ID from filename
    // Example: boite-activites-hape -> p-009 (need mapping)
    // For now, extract from product slug and map to ID
    const productId = extractProductIdFromSlug(file);
    
    if (!productId) continue;

    const productNum = productId.replace('p-', '');
    const reviews = REVIEWS.filter(r => r.id.startsWith(`r-${productNum}`));

    if (reviews.length === 0) continue;

    // Generate reviews HTML
    const reviewsHTML = generateReviewsHTML(reviews);

    // Insert after the tabs section (look for distinctive marker)
    const marker = '<!-- Sticky mobile CTA -->';
    const idx = html.indexOf(marker);

    if (idx !== -1) {
      html = html.slice(0, idx) + reviewsHTML + '\n' + html.slice(idx);
      fs.writeFileSync(indexPath, html, 'utf-8');
      embedded++;
      console.log(`  ✓ ${file} - ${reviews.length} reviews`);
    }
  }

  console.log(`✓ Embedded reviews in ${embedded} product pages`);
}

function extractProductIdFromSlug(slug) {
  // Map slugs to product IDs based on our data
  const slugToId = {
    'boite-activites-hape': 'p-009',
    'balle-prehension-multicolore': 'p-015',
    'actiroller-rouleau-musical': 'p-017',
    // Add more mappings as needed
  };
  return slugToId[slug] || null;
}

function generateReviewsHTML(reviews) {
  let html = `
    <!-- Customer Reviews Section (Embedded at build-time) -->
    <div class="mt-16 lg:mt-24">
      <h2 class="font-display font-bold text-navy text-2xl md:text-3xl mb-8">
        Avis clients (${reviews.length})
      </h2>
      <div class="space-y-6">
`;

  for (const review of reviews) {
    const starHTML = [1, 2, 3, 4, 5]
      .map(i => {
        const filled = i <= review.rating ? 'fill-sunflower text-sunflower' : 'fill-navy/10 text-navy/20';
        return `<svg key="${i}" class="w-4 h-4 ${filled}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`;
      })
      .join('');

    html += `
        <div class="p-6 rounded-2xl bg-cream-soft border border-navy/5 hover:border-navy/10 transition-colors">
          <div class="flex items-start gap-4 mb-3">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-navy flex-shrink-0 ${review.avatarColor || 'bg-blue-100'}">
              ${review.author[0]}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p class="font-semibold text-navy">${review.author}</p>
                  <p class="text-xs text-navy/60">${review.date}</p>
                </div>
                <div class="flex items-center gap-0.5">
                  ${starHTML}
                </div>
              </div>
            </div>
          </div>
          <p class="text-navy/80 leading-relaxed">${review.content}</p>
        </div>
`;
  }

  html += `
      </div>
    </div>
`;

  return html;
}
