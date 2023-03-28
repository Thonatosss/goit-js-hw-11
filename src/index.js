import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';



const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),

}

refs.form.addEventListener('submit', onSubmitForm);


function onSubmitForm(event) {
  event.preventDefault();
  const {
    elements: { searchQuery }
  } = event.currentTarget;
  clearElement(refs.gallery);
  fetchPhotos(searchQuery.value).then(filterData).catch(error => console.log(error));
  
}

async function fetchPhotos(toSearch) {
  const response = await axios.get(`https://pixabay.com/api/?key=34587378-1709a2c174b77a7efdbc7c71b&q=${toSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`);
  
  return response.data;
}

function filterData(data) {
  const filteredData = data.hits.map(photo => ({
    webformatURL: photo.webformatURL,
    largeImageURL: photo.largeImageURL,
    tags: photo.tags,
    likes: photo.likes,
    views: photo.views,
    comments: photo.comments,
    downloads: photo.downloads,

  }))
  if (data.hits.length === 0) {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
  Notify.success(`Hooray! We found ${data.totalHits} images`)

  console.log(filteredData);

  fillElementWithContent(refs.gallery, createPhotoMarkup, filteredData);

  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    behavior: "smooth",
  });
  new SimpleLightbox(".photo-card a", {
    scrollZoom: false,
  });
  

  return filteredData;
}
function clearElement(element) {
  return element.innerHTML = '';
}
function fillElementWithContent(element, markup, data) {
  return element.insertAdjacentHTML('afterbegin', markup(data));
}
function createPhotoMarkup(items) {
  return items.reduce((acc, item) => {
    return acc + `
    <div class="photo-card">
    <a href="${item.largeImageURL}" class="photo-link">
    <img src="${item.webformatURL}" alt="" loading="lazy" width='350' height='300' />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`;
  }, '');
}


