const refs = {
    gallery: document.querySelector('.gallery'),
    asd: 'gfds',

}


    function fetchPhotos(toSearch) {
        return fetch(`https://pixabay.com/api/?key=34587378-1709a2c174b77a7efdbc7c71b&q=${toSearch}&image_type=photo&orientation=horizontal&safesearch=true`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
}
    
fetchPhotos('lion').then(filterData).catch(error => console.log(error));

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
    console.log(filteredData);
    return filteredData;
}

