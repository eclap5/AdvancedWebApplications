document.addEventListener('DOMContentLoaded', () => { 
    loadPage() 
    addRecipe()
})


const recipeTitle = document.getElementById('recipe-name')
const recipeIngredients = document.getElementById('ingredient-list')
const recipeInstructions = document.getElementById('instructions-list')

const nameTxt = document.getElementById('name-text')
const ingredientTxt = document.getElementById('ingredients-text')
const ingredientBtn = document.getElementById('add-ingredient')
const instructionBtn = document.getElementById('add-instruction')
const instructionTxt = document.getElementById('instructions-text')
const submitBtn = document.getElementById('submit')

const fileInput = document.getElementById('image-input')


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


const loadPage = async () => {
    try {
        const response = await fetch('/recipe/pizza')
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }

        const data = await response.json()
        fillRecipeInfo(data)

    } catch (error) {
        console.log(`Error when trying to fetch data: ${error.message}`)
    }
}


const fillRecipeInfo = (data) => {
    recipeTitle.textContent = data.name

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