if (document.readyState !== 'loading') {
    initializeRegister()
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initializeRegister()
    })
}

const initializeRegister = () => {
    document.getElementById('registerForm').addEventListener('submit', (event) => {
        fetchData(event)
    })
} 

const fetchData = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        })
        if (response.status === 403) {
            document.getElementById('register-error').textContent = 'Email already in use'
        } else if (response.status === 400) {
            document.getElementById('register-error').textContent = 'Password is not strong enough'
        } else if (response.status === 200) {
            window.location.href = '/login.html'
        }
    } catch (error) {
        console.log(`Error when trying to register: ${error.message}`)
    }
}