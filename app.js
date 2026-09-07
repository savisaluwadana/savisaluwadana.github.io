(() => {
  const revealEverything = () => {
    document.querySelectorAll('.reveal').forEach((element) => {
      element.classList.add('is-visible');
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  };

  revealEverything();

  import('/docs/app.js').catch(() => {
    revealEverything();
  });
})();
