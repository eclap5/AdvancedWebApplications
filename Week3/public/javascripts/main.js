document.getElementById("submit-data").addEventListener("click", () => {
    const nameInput = document.getElementById("input-name")
    const taskInput = document.getElementById("input-task")

    const nameData = nameInput.value
    const taskData = taskInput.value

    let data = {
        name: nameData,
        todos: [taskData]
    }

    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    console.log(data)

    nameInput.value = ""
    taskInput.value = ""
})