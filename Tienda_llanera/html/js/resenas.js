// ...existing code...

function attachReviewActionListeners() {
    // ...existing code...
    document.querySelectorAll('.review-item').forEach(item => {
        if (item && item.dataset && item.dataset.reviewId) { // valida existencia de dataset
            item.addEventListener('click', function() {
                const reviewId = this.dataset.reviewId;
                // ...existing code...
            });
        } else {
            console.warn('Elemento review-item sin dataset.reviewId encontrado.');
        }
    });
    // ...existing code...
}

// ...existing code...