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
const submitBtn = document.getElementById('submit')
const fileInput = document.getElementById('image-input')


const loadPage = async () => {
    addRecipe()
    searchInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter')
            await searchRecipe()
    })
}


const addRecipe = async () => {
    let ingredients = []
    let instructions =[]
    let result = {}

    instructionBtn.addEventListener('click', () => {
        instructions.push(instructionTxt.value)
        instructionTxt.value = ''
        console.log('instruction added', instructions)
    })

    ingredientBtn.addEventListener('click', () => {
        ingredients.push(ingredientTxt.value)
        ingredientTxt.value = ''
        console.log('ingredient added', ingredients)
    })

    submitBtn.addEventListener('click', async () => {
        result.name = nameTxt.value
        result.ingredients = ingredients
        result.instructions = instructions

        nameTxt.value = ''

        try {
            uploadImage()

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
    
    console.log(formData)

    try {
        const response = await fetch('/images', {
            method: 'POST',
            body: formData
        })
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }
    } catch (error) {
        console.log(`Error when trying to upload image: ${error.message}`)
    }
}