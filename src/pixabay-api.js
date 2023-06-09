
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class pixabayApiService {
    searchQuerry = '';
    #BASE_URL = 'https://pixabay.com/api/'
    page = 1;


    async fetchPhotos() {
        try {
            
            const response = await axios.get(`
            ${this.#BASE_URL}?key=34587378-1709a2c174b77a7efdbc7c71b&q=${this.searchQuerry}&image_type=photo
            &orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`);
            this.incrementPage();
            return response.data;

        } catch (error) {

            throw new Error(error.message);
        }

    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
}