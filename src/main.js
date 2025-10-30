import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

let lightbox;

// Pixabay API bilgileri
const API_KEY = '53016082-e520ad17d921b98237d23020b';
const BASE_URL = 'https://pixabay.com/api/';

form.addEventListener('submit', e => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  fetchImages(query);
});

async function fetchImages(query) {
  gallery.innerHTML = '';
  loader.classList.remove('hidden');

  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    const data = await response.json();

    loader.classList.add('hidden');

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);
  } catch (error) {
    loader.classList.add('hidden');
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  }
}

function renderGallery(images) {
  const markup = images
    .map(
      img => `
    <a class="card" href="${img.largeImageURL}">
      <img src="${img.webformatURL}" alt="${img.tags}" />
      <div class="card-info">
        <p>Likes: ${img.likes} | Views: ${img.views}</p>
        <p>Comments: ${img.comments} | Downloads: ${img.downloads}</p>
      </div>
    </a>
  `
    )
    .join('');

  gallery.innerHTML = markup;

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}
