/* Project cards, project photo stories and the accessible full-screen photo viewer. */
(function () {
  var projects = Array.isArray(window.CH_GALLERY_PROJECTS) ? window.CH_GALLERY_PROJECTS : [];
  var listView = document.getElementById('gallery-list-view');
  var cardList = document.getElementById('project-cards');
  var projectDetail = document.getElementById('project-detail');
  var detailHero = document.getElementById('project-detail-hero');
  var detailTitle = document.getElementById('project-detail-title');
  var detailCover = document.getElementById('project-detail-cover');
  var photoGrid = document.getElementById('project-photo-grid');
  var viewer = document.getElementById('photo-viewer');
  var viewerImage = document.getElementById('photo-viewer-image');
  var viewerTitle = document.getElementById('photo-viewer-title');
  var viewerCount = document.getElementById('photo-viewer-count');
  var viewerCaption = document.getElementById('photo-viewer-caption');
  var activeProject = null;
  var activePhotoIndex = 0;
  var renderedPhotoColumns = 0;
  var lastProjectButton = null;
  var lastListScrollY = 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function photoImage(photo, loading, priority, className) {
    var img = element('img', className);
    img.src = photo.thumbnail;
    img.width = photo.width;
    img.height = photo.height;
    img.alt = '';
    img.loading = loading;
    img.decoding = 'async';
    if (priority) img.fetchPriority = priority;
    img.addEventListener('error', function () {
      img.classList.add('is-missing');
      img.removeAttribute('src');
    }, { once: true });
    return img;
  }

  function renderCards() {
    cardList.replaceChildren();
    if (!projects.length) {
      cardList.appendChild(element('p', 'project-grid__empty', 'Project photographs will appear here soon.'));
      return;
    }

    projects.forEach(function (project, index) {
      var cover = project.photos.find(function (photo) { return photo.id === project.coverId; }) || project.photos[0];
      if (!cover) return;

      var article = element('article', 'project-card' + (cover.orientation === 'portrait' ? ' project-card--portrait' : ''));
      article.dataset.projectId = project.id;
      var button = element('button', 'project-card__button');
      button.type = 'button';
      button.dataset.projectId = project.id;
      button.setAttribute('aria-label', 'Open ' + project.title + ', ' + project.photos.length + ' photographs');

      var media = element('span', 'project-card__media');
      media.appendChild(photoImage(cover, index === 0 ? 'eager' : 'lazy', index === 0 ? 'high' : 'low', 'project-card__image'));
      media.appendChild(element('span', 'project-card__open', '↗'));
      button.appendChild(media);

      var overlay = element('span', 'project-card__overlay');
      var copy = element('span', 'project-card__copy');
      copy.appendChild(element('span', 'project-card__number', 'ALBUM ' + String(index + 1).padStart(2, '0')));
      copy.appendChild(element('span', 'project-card__title', project.albumTitle || project.title));
      overlay.appendChild(copy);
      overlay.appendChild(element('span', 'project-card__photos', project.photos.length + ' photographs'));
      media.appendChild(overlay);
      button.appendChild(element('span', 'project-card__description', project.description));
      article.appendChild(button);
      cardList.appendChild(article);
    });

    var cards = Array.from(cardList.querySelectorAll('.project-card'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      cards.forEach(function (card) { card.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '100px 0px' });
    cards.forEach(function (card) { observer.observe(card); });
  }

  function renderPhotos(project) {
    photoGrid.replaceChildren();
    var columnCount = window.matchMedia('(max-width: 900px)').matches ? 2 : 3;
    var columns = [];
    var columnHeights = [];
    renderedPhotoColumns = columnCount;
    for (var columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      var column = element('div', 'photo-grid__column');
      columns.push(column);
      columnHeights.push(0);
      photoGrid.appendChild(column);
    }

    project.photos.forEach(function (photo, index) {
      var button = element('button', 'photo-tile');
      button.type = 'button';
      button.dataset.photoIndex = String(index);
      button.setAttribute('aria-label', 'View photo ' + (index + 1) + ' of ' + project.photos.length + ': ' + photo.alt);
      button.appendChild(photoImage(photo, index < 4 ? 'eager' : 'lazy', index < 4 ? 'high' : 'low', 'photo-tile__image'));
      button.appendChild(element('span', 'photo-tile__caption', photo.alt));
      var shortestColumn = columnHeights.indexOf(Math.min.apply(Math, columnHeights));
      columns[shortestColumn].appendChild(button);
      columnHeights[shortestColumn] += photo.height / photo.width;
    });
  }

  function projectUrl(id) {
    var url = new URL(window.location.href);
    url.searchParams.set('project', id);
    return url.pathname + url.search + url.hash;
  }

  function showProject(project, options) {
    options = options || {};
    if (!project || !project.photos.length) return;
    activeProject = project;

    var cover = project.photos.find(function (photo) { return photo.id === project.coverId; }) || project.photos[0];

    if (options.pushHistory) {
      lastListScrollY = window.scrollY;
      window.history.pushState({ galleryProject: project.id }, '', projectUrl(project.id));
    }

    listView.hidden = true;
    projectDetail.hidden = false;
    projectDetail.classList.remove('is-open');
    detailHero.dataset.orientation = cover.orientation;

    detailTitle.textContent = project.albumTitle || project.title;
    document.getElementById('project-detail-description').textContent = project.description;
    document.getElementById('project-detail-index').textContent = 'ALBUM  ·  ' + String(projects.indexOf(project) + 1).padStart(2, '0') + ' / ' + String(projects.length).padStart(2, '0');
    document.getElementById('project-album-title').textContent = project.albumTitle || 'Selected views';
    document.getElementById('project-photo-count').textContent = String(project.photos.length).padStart(2, '0') + ' PHOTOGRAPHS';
    detailCover.src = cover.full;
    detailCover.alt = cover.alt;
    detailCover.width = cover.width;
    detailCover.height = cover.height;
    detailCover.loading = 'eager';

    var features = document.getElementById('project-detail-features');
    features.replaceChildren();
    project.features.forEach(function (feature) { features.appendChild(element('li', '', feature)); });
    renderPhotos(project);

    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    if (options.focus !== false) detailTitle.focus({ preventScroll: true });
    window.requestAnimationFrame(function () { projectDetail.classList.add('is-open'); });
  }

  function showList(options) {
    options = options || {};
    if (viewer.open) viewer.close();
    activeProject = null;
    projectDetail.classList.remove('is-open');
    projectDetail.hidden = true;
    listView.hidden = false;
    photoGrid.replaceChildren();
    detailCover.removeAttribute('src');
    var restoreList = !!(options.focus && lastProjectButton && document.contains(lastProjectButton));
    window.scrollTo({ top: restoreList ? lastListScrollY : 0, behavior: 'auto' });
    if (restoreList) lastProjectButton.focus({ preventScroll: true });
  }

  function routeFromLocation(options) {
    options = options || {};
    var id = new URLSearchParams(window.location.search).get('project');
    var project = projects.find(function (entry) { return entry.id === id || entry.legacyId === id; });
    if (project) {
      if (project.id !== id) {
        var canonicalUrl = new URL(window.location.href);
        canonicalUrl.searchParams.set('project', project.id);
        window.history.replaceState(window.history.state, '', canonicalUrl.pathname + canonicalUrl.search + canonicalUrl.hash);
      }
      showProject(project, { focus: options.focus === true });
      return;
    }
    if (id) {
      var url = new URL(window.location.href);
      url.searchParams.delete('project');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    showList({ focus: options.focus === true });
  }

  cardList.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-project-id]');
    if (!button) return;
    var project = projects.find(function (entry) { return entry.id === button.dataset.projectId; });
    if (!project) return;
    lastProjectButton = button;
    showProject(project, { pushHistory: true });
  });

  document.getElementById('back-to-projects').addEventListener('click', function () {
    if (window.history.state && window.history.state.galleryProject) {
      window.history.back();
      return;
    }
    var url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    showList();
  });

  photoGrid.addEventListener('click', function (event) {
    var tile = event.target.closest('button[data-photo-index]');
    if (!tile || !activeProject) return;
    openPhoto(parseInt(tile.dataset.photoIndex, 10));
  });

  function openPhoto(index) {
    if (!activeProject || !activeProject.photos.length) return;
    activePhotoIndex = (index + activeProject.photos.length) % activeProject.photos.length;
    var photo = activeProject.photos[activePhotoIndex];
    viewerImage.src = photo.full;
    viewerImage.alt = photo.alt;
    viewerTitle.textContent = activeProject.title;
    viewerCount.textContent = String(activePhotoIndex + 1).padStart(2, '0') + ' / ' + String(activeProject.photos.length).padStart(2, '0');
    viewerCaption.textContent = photo.alt;
    if (!viewer.open) viewer.showModal();
    document.body.classList.add('is-viewer-open');
  }

  document.getElementById('photo-viewer-close').addEventListener('click', function () { viewer.close(); });
  document.getElementById('photo-viewer-previous').addEventListener('click', function () { openPhoto(activePhotoIndex - 1); });
  document.getElementById('photo-viewer-next').addEventListener('click', function () { openPhoto(activePhotoIndex + 1); });
  viewer.addEventListener('close', function () {
    document.body.classList.remove('is-viewer-open');
    viewerImage.removeAttribute('src');
    viewerCaption.textContent = '';
  });
  viewer.addEventListener('click', function (event) {
    if (event.target === viewer) viewer.close();
  });
  document.addEventListener('keydown', function (event) {
    if (!viewer.open) return;
    if (event.key === 'ArrowLeft') openPhoto(activePhotoIndex - 1);
    if (event.key === 'ArrowRight') openPhoto(activePhotoIndex + 1);
  });
  window.addEventListener('popstate', function () { routeFromLocation({ focus: true }); });
  window.addEventListener('resize', function () {
    var columnCount = window.matchMedia('(max-width: 900px)').matches ? 2 : 3;
    if (activeProject && columnCount !== renderedPhotoColumns) renderPhotos(activeProject);
  });

  document.getElementById('project-total').textContent = String(projects.length).padStart(2, '0');
  renderCards();
  document.getElementById('year').textContent = new Date().getFullYear();
  routeFromLocation();
})();
