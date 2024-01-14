export default function addWrapper(OriginalComponent, {name}) {
    return (
        <div className='wrapper'>
            <OriginalComponent name={name} />
        </div>
    )
}