if (document.readyState !== 'loading') {
    checkLoginState()
} else {
    document.addEventListener('DOMContentLoaded', () => {
        checkLoginState()
    })
}

const registeredDiv = document.getElementById('registered')
const unregisteredDiv = document.getElementById('unregistered')
const userEmail = document.getElementById('email')
const addItem = document.getElementById('add-item')
const itemList = document.getElementById('todo-list')

const checkLoginState = async () => {
    const authToken = localStorage.getItem('auth_token')

    if (authToken) {
        unregisteredDiv.style = 'display: none'
        registeredDiv.style = 'display: block'
        
        try {
            createLogoutButton()
            addTodo()

            const response = await fetch('/auth', {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`)
            }
            const data = await response.json()
            userEmail.textContent = data.email

            const existingTodos = await getTodos(authToken)

            for(let i = 0; i < existingTodos.items.length; i++) {
                const newLi = document.createElement('li')
                newLi.textContent = existingTodos.items[i]
                newLi.classList = 'list-item'
                itemList.appendChild(newLi)
            }
        } catch (error) {
            console.log(`Error when trying to fetch data from the server: ${error.message}`)
        }
    }
}

const addTodo = () => {
    addItem.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            try {
                const response = await fetch('/api/todos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    },
                    body: JSON.stringify({ items: [addItem.value] })
                })
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`)
                }
                const newListItem = document.createElement('li')
                newListItem.textContent = addItem.value
                newListItem.className = 'list-item'
                itemList.appendChild(newListItem)
                addItem.value = '' 
            } catch (error) {
                console.log(`Error when trying to add items to Todo list: ${error.message}`)
            }
        }
    })
}

const getTodos = async (authToken) => {
    try {
        const response = await fetch('/api/todos', {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${authToken}`
            }
        })
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        console.log(`Error when trying to get todo list from the server: ${error.message}`)
    }
}

const createLogoutButton = () => {
    const logoutBtn = document.createElement('a')
    logoutBtn.id = 'logout'
    logoutBtn.className = 'btn'
    logoutBtn.textContent = 'logout'
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('auth_token')
        window.location.href = '/'
    })
    registeredDiv.appendChild(logoutBtn)
}