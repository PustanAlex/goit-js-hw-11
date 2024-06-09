import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';

async function searchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '43501408-f2ca706ad0af36d7ba8bbed94',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 20,
        page: page
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images');
  }
}

function renderImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

function clearGallery() {
  gallery.innerHTML = '';
}

async function handleSearch(event) {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();
  currentPage = 1;

  if (!searchQuery) {
    Notiflix.Notify.failure('Please enter a search query');
    return;
  }

  try {
    clearGallery();
    const { hits, totalHits } = await searchImages(searchQuery, currentPage);

    if (hits.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } else {
      renderImages(hits);
      if (totalHits > 20) {
        loadMoreBtn.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Failed to search images. Please try again later.');
  }
}

async function loadMoreImages() {
  currentPage++;

  try {
    const { hits, totalHits } = await searchImages(searchQuery, currentPage);

    if (hits.length === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    } else {
      renderImages(hits);
    }
  } catch (error) {
    Notiflix.Notify.failure('Failed to load more images. Please try again later.');
  }
}

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', loadMoreImages);
