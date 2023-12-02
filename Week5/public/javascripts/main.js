document.addEventListener('DOMContentLoaded', () => { 
    loadPage() 
})


const searchInput = document.getElementById('search')
const recipeTitle = document.getElementById('recipe-name')
const ingredientTitle = document.getElementById('ingredient-title')
const instructionTitle = document.getElementById('instruction-title')
const recipeIngredients = document.getElementById('ingredient-list')
const recipeInstructions = document.getElementById('instructions-list')
const nameTxt = document.getElementById('name-text')
const ingredientTxt = document.getElementById('ingredients-text')
const ingredientBtn = document.getElementById('add-ingredient')
const instructionBtn = document.getElementById('add-instruction')
const instructionTxt = document.getElementById('instructions-text')
const categoriesElement = document.getElementById('categories')
const submitBtn = document.getElementById('submit')
const fileInput = document.getElementById('image-input')


const loadPage = async () => {
    await fetchCategories()
    addRecipe()
    searchInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter')
            await searchRecipe()
    })
}


const addRecipe = async () => {
    let ingredients = []
    let instructions =[]
    let categories = []
    let images = []
    let result = {}

    let categoryCount = categoriesElement.childElementCount

    instructionBtn.addEventListener('click', () => {
        instructions.push(instructionTxt.value)
        instructionTxt.value = ''
    })

    ingredientBtn.addEventListener('click', () => {
        ingredients.push(ingredientTxt.value)
        ingredientTxt.value = ''
    })

    submitBtn.addEventListener('click', async () => {
        
        for (let i = 0; i < categoryCount; i++) {
            let checkbox = document.getElementById(`category-${i}`)
            if (checkbox.checked){
                categories.push(checkbox.value)
            }
        }

        result.name = nameTxt.value
        result.ingredients = ingredients
        result.instructions = instructions
        result.categories = categories

        nameTxt.value = ''

        try {
            const imageData = await uploadImage()
            result.images = imageData

            const response = await fetch('/recipe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(result)
            })

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`)
            }

            const data = await response.json()
            fillRecipeInfo(data)

        } catch (error) {
            console.log(`Error when trying to fetch data: ${error.message}`)
        }
    })
}


const fetchCategories = async () => {
    try {
        const response = await fetch('/categories')
        
        if (!response.ok)
            throw new Error(`HTTP Error: ${response.status}`)
        
        const data = await response.json()
        loadCategoryElements(data)
    } catch (error) {
        console.log(`Error when trying to fetch data: ${error.message}`)
    }
}


const loadCategoryElements = (data) => {
    for (let i = 0; i < data.length; i++) {
        let inputElement = document.createElement('p')
        inputElement.id = 'category-element'
        inputElement.className = 'category-element'
        inputElement.innerHTML = 
            `<label>
            <input id='category-${i}' type='checkbox' class='filled-in' value=${data[i]._id} />
            <span>${data[i].name}</span>
            </label>`
        categoriesElement.appendChild(inputElement)
    }
}


const searchRecipe = async () => {
    const recipeName = searchInput.value
    searchInput.value = ''
    try {
        const response = await fetch(`/recipe/${recipeName}`)

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
        fillRecipeInfo(data)

    } catch (error) {
        console.log(`Error when trying to fetch data: ${error.message}`)
    }
}


const fillRecipeInfo = (data) => {
    recipeTitle.textContent = data.name
    ingredientTitle.style.display = 'block'
    instructionTitle.style.display = 'block'


    if (recipeIngredients.hasChildNodes()) {
        while (recipeIngredients.hasChildNodes()) {
            recipeIngredients.removeChild(recipeIngredients.firstChild)
        }
    }

    if (recipeInstructions.hasChildNodes()) {
        while (recipeInstructions.hasChildNodes()) {
            recipeInstructions.removeChild(recipeInstructions.firstChild)
        }
    }
        
    for (let i = 0; i < data.ingredients.length; i++) {
        const newLi = document.createElement('li')
        newLi.textContent = data.ingredients[i]
        newLi.style.listStyleType = 'disc'
        recipeIngredients.appendChild(newLi)
    }

    for (let i = 0; i < data.instructions.length; i++) {
        const newLi = document.createElement('li')
        newLi.textContent = data.instructions[i]
        recipeInstructions.appendChild(newLi)
    }
}


const uploadImage = async () => {
    const formData = new FormData()

    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('images', fileInput.files[i])
    }
    fileInput.value = null

    try {
        const response = await fetch('/images', {
            method: 'POST',
            body: formData
        })
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        console.log(`Error when trying to upload image: ${error.message}`)
    }
}