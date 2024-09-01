const Filter = ({ value, handler }) => {
    return (
        <>
            filter shown with <input value={value} onChange={handler} />
        </>
    )
}

export default Filter
