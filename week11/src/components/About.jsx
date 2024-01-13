import { useEffect, useState } from "react"

function About() {
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts')
                const data = await response.json()
                
                setDataList(data)
                if (mounted) {
                    setDataList(data)
                }
            } catch (error) {
             console.log(`Error when trying to fetch data from the server: ${error.message}`)
            } 
            finally {
                mounted = false
            }
        }
        fetchData()
    }, [])

    return (
        <div>
            <h1>This is About jsx!</h1>
            <ul>
                {dataList.map((element) =>
                    <li key={element.id}> {element.title} </li>
                )}
            </ul>
        </div>
    )
}

export default About