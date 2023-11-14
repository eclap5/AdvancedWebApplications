let currentUser = ''

document.getElementById('submit-data').addEventListener('click', async () => {
    const nameInput = document.getElementById('input-name')
    const taskInput = document.getElementById('input-task')

    const nameData = nameInput.value
    const taskData = taskInput.value

    let data = {
        name: nameData,
        todos: [taskData]
    }

    const response = await fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const responseData = await response.json()

    document.getElementById('status').innerText = responseData.userActionStatus

    nameInput.value = ''
    taskInput.value = ''
})

document.getElementById('search').addEventListener('click', async () => {
    const searchInput = document.getElementById('search-name')
    const taskList = document.getElementById('tasks')
    const nameElement = document.getElementById('result-text')
    const deleteBtn = document.getElementById('delete-user')

    let userFound = false

    clearList(taskList)

    const response = await fetch(`/user/${searchInput.value}`)
    
    if (response.ok) {
        const userData = await response.json()

        if ('searchStatus' in userData) {
            nameElement.innerText = userData.searchStatus
        } else {
            currentUser = userData.name
            nameElement.innerHTML = userData.name
            appendList(userData, taskList) 
            userFound = true
        }
    }
    if (userFound) {
        deleteBtn.style.display = 'block'
    } else {
        deleteBtn.style.display = 'none'
    }
    searchInput.value = ''
})

document.getElementById('delete-user').addEventListener('click', async () => {
    const taskList = document.getElementById('tasks')
    const nameElement = document.getElementById('result-text')
    const statusMsg = document.getElementById('status')
    const deleteBtn = document.getElementById('delete-user')
    
    const response = await fetch(`/user/${currentUser}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const data = await response.json()
        clearList(taskList)
        statusMsg.innerText = data.message
        nameElement.innerText = ''
    }
    deleteBtn.style.display = 'none'
})

const clearList = (taskList) => {
    if (taskList.hasChildNodes()) {
        while (taskList.hasChildNodes()) {
            taskList.removeChild(taskList.firstChild)
        }
    }
}

const appendList = (userData, taskList) => {
    for (let i = 0; i < userData.todos.length; i++) {
        let newLi = document.createElement('li')
        let linkItem = document.createElement('a')

        linkItem.className = 'delete-task'
        linkItem.href = '#'
        linkItem.onclick = () => {
            deleteTask(userData.name, userData.todos[i])
        }
        linkItem.textContent = userData.todos[i]

        newLi.appendChild(linkItem)
        taskList.appendChild(newLi)
    }
}

const deleteTask = async (name, task) => {
    const taskList = document.getElementById('tasks')
    const response = await fetch('/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            'name': name,
            'task': task
        })
    })

    if (response.ok) {
        const data = await response.json()
        console.log(data)
        document.getElementById('status').innerText = data.message
        clearList(taskList)
        appendList(data.userData, taskList)
    }
}