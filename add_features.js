const fs = require('fs');

let content = fs.readFileSync('code.html', 'utf8');

// 1. Add CSS
const cssToAdd = `
/* ================================================================
   PRICE PSYCHOLOGY
   ================================================================ */
.product-price {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
}
.price-old {
    font-size: 0.9rem;
    text-decoration: line-through;
    color: rgba(255, 255, 255, 0.4);
    font-family: var(--font-sans);
}
.price-new {
    font-size: 1.4rem;
    color: var(--color-gold);
    font-weight: 600;
    font-family: var(--font-sans);
}
.price-badge {
    background: rgba(196, 162, 101, 0.15);
    color: var(--color-gold-light);
    padding: 0.2rem 0.5rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 1px solid rgba(196, 162, 101, 0.3);
    border-radius: 2px;
}

/* ================================================================
   TRUST BAR
   ================================================================ */
.trust-bar {
    background: #0f0d0b;
    border-top: 1px solid rgba(196, 162, 101, 0.15);
    border-bottom: 1px solid rgba(196, 162, 101, 0.15);
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 10;
}
.trust-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-family: var(--font-sans);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
}
.trust-item .icon {
    font-size: 1.2rem;
    color: var(--color-gold);
}

/* ================================================================
   REVIEWS SECTION
   ================================================================ */
.reviews {
    padding: 8rem 2rem;
    background: var(--color-parchment-light);
    text-align: center;
}
.reviews__title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 400;
    margin-bottom: 4rem;
    color: var(--color-ink);
}
.reviews__title em {
    font-style: italic;
    color: var(--color-amber);
}
.reviews__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
}
.review-card {
    background: #fff;
    padding: 3rem 2rem;
    border: 1px solid var(--color-parchment-dark);
    position: relative;
    transition: transform 0.4s var(--ease-out-expo), box-shadow 0.4s;
    text-align: left;
}
.review-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.05);
}
.review-quote-icon {
    font-size: 4rem;
    color: var(--color-gold);
    opacity: 0.2;
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-family: var(--font-display);
    line-height: 1;
}
.review-text {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-style: italic;
    color: var(--color-charcoal);
    line-height: 1.7;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
    padding-top: 2rem;
}
.review-author {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 600;
    color: var(--color-ink);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.review-author span {
    font-size: 0.6rem;
    color: var(--color-warm-gray);
    letter-spacing: 0.1em;
}

/* ================================================================
   WHY CHOOSE US
   ================================================================ */
.why-choose-us {
    padding: 8rem 2rem;
    background: var(--color-parchment);
    max-width: 1400px;
    margin: 0 auto;
}
.why-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
}
.why-content h2 {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 400;
    margin-bottom: 2.5rem;
    line-height: 1.1;
    color: var(--color-ink);
}
.why-content h2 em {
    display: block;
    font-style: italic;
    color: var(--color-amber);
}
.why-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
.why-item {
    display: flex;
    gap: 1.5rem;
}
.why-item-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-gold);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.why-item-icon .material-symbols-outlined {
    font-size: 1.2rem;
}
.why-item-text h4 {
    font-family: var(--font-sans);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 0.5rem;
    color: var(--color-ink);
}
.why-item-text p {
    font-family: var(--font-serif);
    font-size: 1.05rem;
    color: var(--color-charcoal);
    line-height: 1.6;
}
.why-image {
    position: relative;
    border-radius: 2px;
    overflow: hidden;
}
.why-image img {
    width: 100%;
    aspect-ratio: 4/5;
    object-fit: cover;
}
@media (max-width: 1024px) {
    .why-grid { grid-template-columns: 1fr; gap: 4rem; }
}
@media (max-width: 768px) {
    .trust-bar { gap: 1.5rem; flex-direction: column; align-items: flex-start; }
}
`;
if (!content.includes('.product-price')) {
    content = content.replace('</style>', cssToAdd + '\n    </style>');
}

// 2. Add Trust Bar after Marquee
const trustBarHtml = `
    <!-- ═══════════════════════════════════════════
         TRUST BLOCK
         ═══════════════════════════════════════════ -->
    <div class="trust-bar">
        <div class="trust-item"><span class="icon">🌿</span> 100% Natural</div>
        <div class="trust-item"><span class="icon">✨</span> Heritage Recipes</div>
        <div class="trust-item"><span class="icon">👨‍👩‍👧</span> 5000+ Happy Families</div>
        <div class="trust-item"><span class="icon">📜</span> FSSAI Certified</div>
    </div>
`;
const marqueeEnd = '</div>\n    </div>';
if (!content.includes('class="trust-bar"')) {
    content = content.replace(marqueeEnd, marqueeEnd + '\n' + trustBarHtml);
}

// 3. Update Product Cards
// Kela Namkeen
const kelaOld = `<div class="origin__product-card">
                    <h3>Kela Namkeen</h3>
                    <p>“Made the traditional way with crispy banana Namkeen, perfectly salted and spiced for everyday
                        Snacking”</p>
                    <span class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </span>
                </div>`;
const kelaNew = `<div class="origin__product-card">
                    <h3>Kela Namkeen</h3>
                    <div class="product-price">
                        <span class="price-old">₹249</span>
                        <span class="price-new">₹199</span>
                        <span class="price-badge">Save 20%</span>
                    </div>
                    <p>“Made the traditional way with crispy banana Namkeen, perfectly salted and spiced for everyday Snacking”</p>
                    <a href="https://wa.me/919244733168?text=Hi%20Jars%20of%20Jain!%20I%20would%20like%20to%20order%20the%20Kela%20Namkeen%20at%20the%20offer%20price%20of%20%E2%82%B9199." class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </a>
                </div>`;
content = content.replace(kelaOld, kelaNew);

// Gol Mathri
const golOld = `<div class="origin__product-card">
                    <h3>Gol Mathri</h3>
                    <p>"Hand-rolled and slow-fried, crisp, flaky, and full of that familiar crunch we've all grown up loving"</p>
                    <a href="https://wa.me/919244733168?text=Hi%2C%20I%20would%20like%20to%20order%20Gol%20Mathri" class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </a>
                </div>`;
const golNew = `<div class="origin__product-card">
                    <h3>Gol Mathri</h3>
                    <div class="product-price">
                        <span class="price-old">₹299</span>
                        <span class="price-new">₹229</span>
                        <span class="price-badge">Save 23%</span>
                    </div>
                    <p>"Hand-rolled and slow-fried, crisp, flaky, and full of that familiar crunch we've all grown up loving"</p>
                    <a href="https://wa.me/919244733168?text=Hi%20Jars%20of%20Jain!%20I%20would%20like%20to%20order%20the%20Gol%20Mathri%20at%20the%20offer%20price%20of%20%E2%82%B9229." class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </a>
                </div>`;
content = content.replace(golOld, golNew);

// Mathri
const mathriOld = `<div class="origin__product-card">
                    <h3>Mathri</h3>
                    <p>"A timeless classic, hand-crafted with love — crisp, flaky, and seasoned to perfection"</p>
                    <a href="https://wa.me/919244733168?text=Hi%2C%20I%20would%20like%20to%20order%20Mathri" class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </a>
                </div>`;
const mathriNew = `<div class="origin__product-card">
                    <h3>Mathri</h3>
                    <div class="product-price">
                        <span class="price-old">₹349</span>
                        <span class="price-new">₹249</span>
                        <span class="price-badge">Save 28%</span>
                    </div>
                    <p>"A timeless classic, hand-crafted with love — crisp, flaky, and seasoned to perfection"</p>
                    <a href="https://wa.me/919244733168?text=Hi%20Jars%20of%20Jain!%20I%20would%20like%20to%20order%20the%20classic%20Mathri%20at%20the%20offer%20price%20of%20%E2%82%B9249." class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </a>
                </div>`;
content = content.replace(mathriOld, mathriNew);

// Jiravan
const jiravanOld = `<div class="origin__product-card">
                    <h3>Jiravan</h3>
                    <p>"A heritage spice blend, slow-roasted and stone-ground — the soul of every chaat and snack"</p>
                    <a href="https://wa.me/919244733168?text=Hi%2C%20I%20would%20like%20to%20order%20Jiravan" class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </a>
                </div>`;
const jiravanNew = `<div class="origin__product-card">
                    <h3>Jiravan</h3>
                    <div class="product-price">
                        <span class="price-old">₹199</span>
                        <span class="price-new">₹149</span>
                        <span class="price-badge">Save 25%</span>
                    </div>
                    <p>"A heritage spice blend, slow-roasted and stone-ground — the soul of every chaat and snack"</p>
                    <a href="https://wa.me/919244733168?text=Hi%20Jars%20of%20Jain!%20I%20would%20like%20to%20order%20the%20Jiravan%20spice%20blend%20at%20the%20offer%20price%20of%20%E2%82%B9149." class="card-cta">
                        Buy Your Jar
                        <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_forward</span>
                    </a>
                </div>`;
content = content.replace(jiravanOld, jiravanNew);


// 4. Insert Why Choose Us before Manifesto
const whyChooseUsHtml = `
    <!-- ═══════════════════════════════════════════
         WHY CHOOSE US
         ═══════════════════════════════════════════ -->
    <section class="why-choose-us" id="why-choose-us">
        <div class="why-grid">
            <div class="why-image reveal-left">
                <img src="images/hero.png" alt="Handcrafted Indian Spices">
            </div>
            <div class="why-content reveal-right">
                <h2>Why Choose Us <em>The Artisan Difference</em></h2>
                <div class="why-list">
                    <div class="why-item">
                        <div class="why-item-icon"><span class="material-symbols-outlined" style="font-size: 1.2rem;">verified</span></div>
                        <div class="why-item-text">
                            <h4>Authentic Marwari Taste</h4>
                            <p>Every bite transports you back to the authentic flavors of Rajasthan, uncompromised and pure.</p>
                        </div>
                    </div>
                    <div class="why-item">
                        <div class="why-item-icon"><span class="material-symbols-outlined" style="font-size: 1.2rem;">nutrition</span></div>
                        <div class="why-item-text">
                            <h4>100% Preservative Free</h4>
                            <p>We use zero chemicals, colors, or artificial additives. Nature's ingredients, preserved naturally.</p>
                        </div>
                    </div>
                    <div class="why-item">
                        <div class="why-item-icon"><span class="material-symbols-outlined" style="font-size: 1.2rem;">local_shipping</span></div>
                        <div class="why-item-text">
                            <h4>Direct from our Kitchen</h4>
                            <p>Shipped fresh in small batches to ensure you receive the maximum flavor and crispness.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;
const manifestoMarker = `    <!-- ═══════════════════════════════════════════\n         MANIFESTO\n         ═══════════════════════════════════════════ -->`;
if (!content.includes('class="why-choose-us"')) {
    content = content.replace(manifestoMarker, whyChooseUsHtml + '\n' + manifestoMarker);
}

// 5. Insert Reviews before Process
const reviewsHtml = `
    <!-- ═══════════════════════════════════════════
         REAL CUSTOMER REVIEWS
         ═══════════════════════════════════════════ -->
    <section class="reviews" id="reviews">
        <h2 class="reviews__title reveal">Voices of <em>Tradition</em></h2>
        <div class="reviews__grid stagger-children">
            <div class="review-card reveal" style="--i: 0">
                <div class="review-quote-icon">“</div>
                <p class="review-text">"I haven't tasted Mathri this authentic since my grandmother passed away. The Jiravan spice blend is absolutely incredible. It brings back so many childhood memories."</p>
                <div class="review-author">
                    Priya Sharma
                    <span>Verified Buyer • Mumbai</span>
                </div>
            </div>
            <div class="review-card reveal" style="--i: 1">
                <div class="review-quote-icon">“</div>
                <p class="review-text">"The Kela Namkeen is dangerously addictive! You can instantly tell it's made in fresh, high-quality oil. It feels very light on the stomach. 10/10 highly recommended!"</p>
                <div class="review-author">
                    Rahul Mehta
                    <span>Verified Buyer • Delhi</span>
                </div>
            </div>
            <div class="review-card reveal" style="--i: 2">
                <div class="review-quote-icon">“</div>
                <p class="review-text">"Finally a brand that actually delivers on 'preservative-free'. The packaging is beautiful, but the taste is what will keep me coming back for more. Simply outstanding."</p>
                <div class="review-author">
                    Anita Desai
                    <span>Verified Buyer • Bangalore</span>
                </div>
            </div>
        </div>
    </section>
`;
const processMarker = `    <!-- ═══════════════════════════════════════════\n         PROCESS / EPILOGUE\n         ═══════════════════════════════════════════ -->`;
if (!content.includes('class="reviews"')) {
    content = content.replace(processMarker, reviewsHtml + '\n' + processMarker);
}

// 6. Update general WhatsApp links
content = content.replace(
    '<a href="https://wa.me/919244733168" class="navbar__cta magnetic-btn">',
    '<a href="https://wa.me/919244733168?text=Hi%20Jars%20of%20Jain!%20I%20would%20like%20to%20explore%20your%20artisanal%20collection." class="navbar__cta magnetic-btn">'
);
content = content.replace(
    '<a href="https://wa.me/919244733168" class="mobile-menu__cta">',
    '<a href="https://wa.me/919244733168?text=Hi%20Jars%20of%20Jain!%20I%20would%20like%20to%20explore%20your%20artisanal%20collection." class="mobile-menu__cta">'
);

fs.writeFileSync('code.html', content, 'utf8');
console.log("Features successfully added!");
