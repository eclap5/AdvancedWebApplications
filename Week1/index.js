document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 5; i++) {
        createWikiItem(breeds[i])
    }
})

const breeds = [
    'poodle',
    'labrador',
    'husky',
    'vizsla',
    'beagle'
]

const createWikiItem = async (breed) => {
    const container = document.querySelector('.container')
    
    const wikiItem = document.createElement('div')
    const header = document.createElement('h1')
    const wikiContent = document.createElement('div')
    const wikiText = document.createElement('p')
    const imageContainer = document.createElement('div')
    const image = document.createElement('img')
    
    wikiItem.className = 'wiki-item'
    header.className = 'wiki-header'
    wikiContent.className = 'wiki-content'
    wikiText.className = 'wiki-text'
    imageContainer.className = 'img-container'
    image.className = 'wiki-img'

    header.innerText = breed
    wikiText.innerText = await getBreedWikiContent(breed)
    image.src = await getBreedImage(breed)

    imageContainer.appendChild(image)
    wikiContent.appendChild(imageContainer)
    wikiContent.appendChild(wikiText)
    wikiItem.appendChild(header)
    wikiItem.appendChild(wikiContent)
    container.appendChild(wikiItem)
}


const getBreedImage = async (breed) => {
    const url = `https://dog.ceo/api/breed/${breed}/images/random`
    try {
        const response = await fetch(url)
        if (response.ok) {
            const data = await response.json()
            return data.message
        }
    } catch (error) {
        console.log(error)
    }
}


const getBreedWikiContent = async (breed) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${breed}`
    try {
        const response = await fetch(url)

        if (response.ok) {
            const data = await response.json()
            return data.extract
        }
    } catch (error) {
        console.log(error)
    }
}