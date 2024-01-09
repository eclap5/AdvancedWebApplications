import { useState } from "react"
import MyList from "./MyList"

function MyContainer() {
    const header = 'this is list header'
    const [items, setItems] = useState([
        {id: '1', text: 'This is first task', clicked: false},
        {id: '2', text: 'This is second task', clicked: false}
    ])

    const [newTextItem, setNewTextItem] = useState('')

    const addTextValue = (event) => {
        setNewTextItem(event.target.value)
    }

    const updateItems = () => {
        const newItem = { id: (items.length + 1).toString(), text: newTextItem, clicked: false }
        setItems([...items, newItem])

        setNewTextItem('')
    }

    const updateClickedItem = (id) => {
        setItems((prevItem) =>
            prevItem.map((item) => 
                item.id === id ? { ...item, clicked: !item.clicked } : item
            )
        )
    }

    let props = {header: header, items: items, updateList: updateClickedItem}

    return (
        <>
            <h2>This is list inside container</h2>
            <MyList {...props}/>
            <div>
                <textarea
                    value={newTextItem}
                    onChange={addTextValue}>
                </textarea>
                <button onClick={updateItems}>Update Items</button>
            </div>
        </>
    )
}

export default MyContainer
