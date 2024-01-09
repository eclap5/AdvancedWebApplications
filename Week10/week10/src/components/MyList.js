const MyList = (props) => {
    
    return (
        <>
            <h5>{props.header}</h5>
            <ol>
                {
                props.items.map((item) =>
                    <li 
                    key={item.id} 
                    onClick={() => props.updateList(item.id)}
                    style={{ textDecoration: item.clicked ? 'line-through' : '' }}
                    >
                        {item.text}
                    </li>
                )
                }
            </ol>
        </>
    )
}

export default MyList