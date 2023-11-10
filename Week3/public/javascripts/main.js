document.getElementById("submit-data").addEventListener("click", async () => {
    const nameInput = document.getElementById("input-name")
    const taskInput = document.getElementById("input-task")

    const nameData = nameInput.value
    const taskData = taskInput.value

    let data = {
        name: nameData,
        todos: [taskData]
    }

    const response = await fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const responseData = await response.json()

    document.getElementById('status').innerText = responseData.userActionStatus

    console.log(data)
    console.log(responseData.userActionStatus)

    nameInput.value = ""
    taskInput.value = ""
})