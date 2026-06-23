// ================================================================
// CUSTOMER REVIEWS LOGIC (GOOGLE SHEETS via Apps Script)
// ================================================================

const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxT3tBrhmx13f0RYQBm_lyvETpzuwvME8t4B4YkAGt3XCPJDro9c8PNaXpuxA8DyQ1hGw/exec';

// Products available on this page (used to filter reviews)
const PAGE_PRODUCTS = ['Mathri', 'Gol Mathri', 'Kela Namkeen', 'Jiravan'];

document.addEventListener('DOMContentLoaded', () => {
    initStarSelector();
    fetchAndRenderReviews();
});

// ==========================================
// 1. FETCH & DISPLAY REVIEWS
// ==========================================
async function fetchAndRenderReviews() {
    try {
        const response = await fetch(SHEETS_API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const allReviews = await response.json();

        // Filter reviews so visitors only see reviews matching the current page's product IDs
        const filteredReviews = Array.isArray(allReviews)
            ? allReviews.filter(r => {
                const pid = r.ProductID || r.productId || r.product || '';
                return PAGE_PRODUCTS.includes(pid);
            })
            : [];

        renderReviews(filteredReviews);
        calculateAndRenderProductRatings(filteredReviews);
        injectSEOSchema(filteredReviews);

    } catch (err) {
        console.error('Error fetching reviews:', err);
        document.getElementById('reviews-grid').innerHTML = '<div style="text-align: center; grid-column: 1 / -1; color: var(--color-warm-gray);">Unable to load customer stories right now.</div>';
    }
}

function renderReviews(reviews) {
    const grid = document.getElementById('reviews-grid');
    grid.innerHTML = '';

    if (!reviews || reviews.length === 0) {
        grid.innerHTML = '<div style="text-align: center; grid-column: 1 / -1; color: var(--color-warm-gray); font-style: italic;">No customer stories yet. Be the first to share your experience!</div>';
        return;
    }

    reviews.forEach((review, index) => {
        // Map fields from Google Sheets response
        const name = review.Name || review.customer_name || 'Customer';
        const rating = parseInt(review.StarRating || review.Rating || review.rating || 5);
        const comment = review.Comment || review.review_text || '';
        const product = review.ProductID || review.product || '';
        const timestamp = review.Timestamp || review.created_at || '';

        const dateStr = timestamp
            ? new Date(timestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
            : '';
        const initial = name.charAt(0).toUpperCase();

        const card = document.createElement('div');
        card.className = 'customer-review-card reveal';
        card.style.setProperty('--i', index);

        card.innerHTML = `
            <div class="review-card-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${initial}</div>
                    <div class="reviewer-details">
                        <h4>${name} <span class="material-symbols-outlined verified-badge" title="Verified Buyer">verified</span></h4>
                        ${dateStr ? `<div class="review-date">${dateStr}</div>` : ''}
                    </div>
                </div>
            </div>
            <div class="review-stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
            <div class="review-product-badge">${product}</div>
            <div class="review-body">${comment}</div>
        `;

        grid.appendChild(card);
    });

    // Re-trigger reveal animation if they exist
    setTimeout(() => {
        const reveals = grid.querySelectorAll('.reveal');
        reveals.forEach(r => r.classList.add('visible'));
    }, 100);
}

// ==========================================
// 2. RATING SUMMARY & PRODUCT CARDS
// ==========================================
function calculateAndRenderProductRatings(reviews) {
    let totalScore = 0;
    const productStats = {
        'Mathri': { total: 0, count: 0 },
        'Gol Mathri': { total: 0, count: 0 },
        'Kela Namkeen': { total: 0, count: 0 },
        'Jiravan': { total: 0, count: 0 },
    };

    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(r => {
        const rating = parseInt(r.StarRating || r.Rating || r.rating || 0);
        const product = r.ProductID || r.product || '';
        totalScore += rating;
        if (starCounts[rating] !== undefined) starCounts[rating]++;
        if (productStats[product]) {
            productStats[product].total += rating;
            productStats[product].count++;
        }
    });

    const totalReviews = reviews.length;
    const avgScore = totalReviews > 0 ? (totalScore / totalReviews).toFixed(1) : 0;

    // Update Overall Summary
    document.getElementById('overall-score').textContent = avgScore > 0 ? avgScore : '--';
    document.getElementById('total-reviews-count').textContent = totalReviews + ' Reviews';
    document.getElementById('overall-stars').textContent = '★'.repeat(Math.round(avgScore)) + '☆'.repeat(5 - Math.round(avgScore));

    // Update Rating Bars
    const barsContainer = document.getElementById('rating-bars');
    barsContainer.innerHTML = '';
    for (let i = 5; i >= 1; i--) {
        const count = starCounts[i];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        barsContainer.innerHTML += `
            <div class="rating-bar-row">
                <span>${i} Star</span>
                <div class="bar-container">
                    <div class="bar-fill" style="width: 0%"></div>
                </div>
                <span style="text-align: right;">${count}</span>
            </div>
        `;
        // Animate fill
        setTimeout(() => {
            const fills = barsContainer.querySelectorAll('.bar-fill');
            if(fills[5-i]) fills[5-i].style.width = percentage + '%';
        }, 100);
    }

    // Update individual product cards
    document.querySelectorAll('.product-rating').forEach(el => {
        const prod = el.getAttribute('data-product');
        if (productStats[prod]) {
            const stats = productStats[prod];
            const avg = stats.count > 0 ? (stats.total / stats.count).toFixed(1) : 0;
            const starsEl = el.querySelector('.stars');
            const scoreEl = el.querySelector('.rating-score');
            const countEl = el.querySelector('.review-count');

            if(avg > 0) {
                starsEl.textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
                scoreEl.textContent = avg;
                countEl.textContent = '(' + stats.count + ' Reviews)';
            }

            countEl.addEventListener('click', () => {
                document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
}

// ==========================================
// 3. SUBMIT REVIEW LOGIC
// ==========================================
const reviewForm = document.getElementById('reviewForm');
const reviewMessage = document.getElementById('reviewMessage');
const submitReviewBtn = document.getElementById('submitReviewBtn');

function openReviewModal() {
    document.getElementById('reviewModal').classList.add('active');
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('active');
    reviewForm.reset();
    document.getElementById('reviewRating').value = '';
    updateStarSelection(0);
    reviewMessage.textContent = '';
}

function initStarSelector() {
    const stars = document.querySelectorAll('#starSelector span');
    const hiddenInput = document.getElementById('reviewRating');

    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const val = e.target.getAttribute('data-value');
            hiddenInput.value = val;
            updateStarSelection(val);
        });
    });
}

function updateStarSelection(value) {
    const stars = document.querySelectorAll('#starSelector span');
    stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= value) {
            s.classList.add('active');
            s.textContent = '★';
        } else {
            s.classList.remove('active');
            s.textContent = '☆';
        }
    });
}

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rating = document.getElementById('reviewRating').value;
    if (!rating) {
        reviewMessage.style.color = 'red';
        reviewMessage.textContent = 'Please select a star rating.';
        return;
    }

    submitReviewBtn.disabled = true;
    submitReviewBtn.innerHTML = '<span class="loader-spinner"></span> Submitting...';
    reviewMessage.textContent = '';

    try {
        // Build the review payload — field names MUST match the Apps Script doPost():
        // params.name, params.rating, params.comment, params.productId, params.phone
        const reviewData = {
            name: document.getElementById('reviewName').value,
            rating: parseInt(rating),
            comment: document.getElementById('reviewText').value,
            productId: document.getElementById('reviewProduct').value
        };

        // Include phone number if provided (optional field)
        const phone = document.getElementById('reviewPhone').value;
        if (phone) {
            reviewData.phone = phone;
        }

        // POST JSON to Google Sheets via Apps Script
        // Content-Type: text/plain with mode: no-cors is a "simple request" so
        // the browser sends the body without a CORS preflight, and Apps Script
        // reads it via e.postData.contents → JSON.parse()
        await fetch(SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(reviewData)
        });

        // With mode: 'no-cors' we can't read the response, but if no error was thrown it went through
        reviewForm.reset();
        updateStarSelection(0);

        reviewMessage.style.color = 'green';
        reviewMessage.textContent = 'Thank you! Your review has been submitted successfully.';

        // Refresh the reviews list after a short delay
        setTimeout(() => {
            fetchAndRenderReviews();
        }, 2000);

        setTimeout(() => {
            closeReviewModal();
        }, 3000);

    } catch (err) {
        console.error('Submission error:', err);
        reviewMessage.style.color = 'red';
        reviewMessage.textContent = 'Failed to submit review. Please try again.';
    } finally {
        submitReviewBtn.disabled = false;
        submitReviewBtn.textContent = 'Submit Review';
    }
});

// ==========================================
// 4. SEO JSON-LD INJECTION
// ==========================================
function injectSEOSchema(reviews) {
    if (!reviews || reviews.length === 0) return;

    let totalScore = 0;
    reviews.forEach(r => totalScore += parseInt(r.StarRating || r.Rating || r.rating || 0));
    const avgScore = (totalScore / reviews.length).toFixed(1);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Jars of Jain Traditional Snacks",
        "image": "https://jarsofjain.com/images/hero.png",
        "description": "Premium handcrafted traditional Indian snacks and spices including Mathri, Kela Namkeen, and Jiravan.",
        "brand": {
            "@type": "Brand",
            "name": "Jars of Jain"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": avgScore,
            "reviewCount": reviews.length.toString(),
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": reviews.map(r => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": (r.StarRating || r.Rating || r.rating || 0).toString(),
                "bestRating": "5",
                "worstRating": "1"
            },
            "author": {
                "@type": "Person",
                "name": r.Name || r.customer_name || 'Customer'
            },
            "reviewBody": r.Comment || r.review_text || '',
            "datePublished": r.Timestamp || r.created_at || ''
        }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}
