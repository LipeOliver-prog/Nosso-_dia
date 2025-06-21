let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;
  pointerId = null;
  startX = 0;
  startY = 0;
  offsetX = 0;
  offsetY = 0;
  rotation = Math.random() * 30 - 15;

  init(paper) {
    // Use pointer events for both mouse and touch
    paper.style.touchAction = 'none';

    paper.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      this.pointerId = e.pointerId;
      paper.setPointerCapture(this.pointerId);
      paper.style.zIndex = highestZ++;

      // record start positions
      this.startX = e.clientX;
      this.startY = e.clientY;
      const transform = getComputedStyle(paper).transform;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        this.offsetX = matrix.m41;
        this.offsetY = matrix.m42;
      } else {
        this.offsetX = 0;
        this.offsetY = 0;
      }
    });

    paper.addEventListener('pointermove', e => {
      if (!this.holdingPaper || e.pointerId !== this.pointerId) return;
      e.preventDefault();
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      paper.style.transform = `translate(${this.offsetX + dx}px, ${this.offsetY + dy}px) rotateZ(${this.rotation}deg)`;
    });

    paper.addEventListener('pointerup', e => {
      if (e.pointerId !== this.pointerId) return;
      this.holdingPaper = false;
      paper.releasePointerCapture(this.pointerId);
      this.pointerId = null;
    });

    paper.addEventListener('pointercancel', e => {
      if (e.pointerId !== this.pointerId) return;
      this.holdingPaper = false;
      this.pointerId = null;
    });
  }
}

// Initialize all papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
