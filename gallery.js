const viewer = document.querySelector('.viewer');
if (viewer && typeof viewer.showModal === 'function') {
  const shots = Array.from(document.querySelectorAll('.shot'));
  const image = viewer.querySelector('img');
  const counter = viewer.querySelector('.counter');
  const previous = viewer.querySelector('.prev');
  const next = viewer.querySelector('.next');
  const close = viewer.querySelector('.close');
  let current = 0;

  function show(index) {
    current = (index + shots.length) % shots.length;
    image.src = shots[current].href;
    image.alt = shots[current].querySelector('img').alt;
    counter.textContent = (current + 1) + ' / ' + shots.length;
  }

  previous.hidden = next.hidden = shots.length < 2;
  shots.forEach((shot, index) => shot.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    show(index);
    viewer.showModal();
    close.focus();
  }));
  close.addEventListener('click', () => viewer.close());
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  viewer.addEventListener('click', (event) => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
}
