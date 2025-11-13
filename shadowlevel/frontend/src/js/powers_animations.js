document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const circle = document.getElementById('circle');
  const domainButton = document.querySelector('[data-window="dominio"]');
  const domainClose = document.querySelector('#dominio .close');
  if (domainButton && domainClose) {
    domainButton.addEventListener('click', () => {
      body.classList.add('domain-expanded');
    });

    domainClose.addEventListener('click', () => {
      body.classList.remove('domain-expanded');
    });
  }
  const shadowButton = document.querySelector('[data-window="sombras"]');
  const shadowClose = document.querySelector('#sombras .close');
  let shadowOverlay = document.getElementById('shadow-overlay');
  if (!shadowOverlay) {
    shadowOverlay = document.createElement('div');
    shadowOverlay.id = 'shadow-overlay';
    body.appendChild(shadowOverlay);
  }

  const shadowFigureContainer = document.querySelector('.shadow-figure-container');

  if (shadowButton && shadowClose && shadowOverlay && shadowFigureContainer) {
    shadowButton.addEventListener('click', () => {
      body.classList.add('shadows-active');
      shadowFigureContainer.classList.add('active');
    });

    shadowClose.addEventListener('click', () => {
      body.classList.remove('shadows-active');
      shadowFigureContainer.classList.remove('active');
    });
  }
  const manaButton = document.querySelector('[data-window="mana"]');

  if (manaButton) {
    manaButton.addEventListener('click', () => {
      const manaBurstEffect = document.createElement('div');
      manaBurstEffect.className = 'mana-burst-effect';
      body.appendChild(manaBurstEffect);
      setTimeout(() => {
        manaBurstEffect.remove();
      }, 2500);
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      body.classList.remove('domain-expanded');
      body.classList.remove('shadows-active');
      if (shadowFigureContainer) {
        shadowFigureContainer.classList.remove('active');
      }
    }
  });

});