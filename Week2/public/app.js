document.getElementById('submit-data').addEventListener('click', () => {
    const input = document.getElementById('input-text')
    let data = {
        'text': input.value
    }

    fetch('/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    input.value = ''
})
