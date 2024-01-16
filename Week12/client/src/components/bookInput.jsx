import React, { useState } from "react"

const AddBooks = () => {
    const [formData, setFormData] = useState({})

    const handleSubmit = (event) => {
        event.preventDefault()
        setFormData({
            name: event.target.elements.name.value,
            author: event.target.elements.author.value,
            pages: event.target.elements.pages.value
        })

        console.log(formData)
    }

    return (
        <>
            <form method="post" onSubmit={handleSubmit}>
                <input type="text" id='name' name="name" placeholder="name" />
                <input type="text" id='author' name='author' placeholder='author' />
                <input type="number" id="pages" name='pages' placeholder='pages' />
                <input type="submit" id='submit' name='submit' value='submit' />
            </form>
        </>
    )
}

export default AddBooks