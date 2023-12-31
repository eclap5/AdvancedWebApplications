if (document.readyState !== 'loading') {
    initializeLogin()
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initializeLogin()
    })
}

const initializeLogin = () => {
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        fetchData(event)
    })
} 

const fetchData = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    try {
        const response = await fetch('/login', {
            method: 'POST',
            body: formData
        })      
        if (response.status === 401) {
            alert('Invalid password')
        } else {
            const data = await response.json()
            if (data.token) {
                localStorage.setItem('auth_token', data.token)
                window.location.href = '/'
            }
        }
    } catch (error) {
        console.log(`Error when trying to login: ${error.message}`)
    }
}