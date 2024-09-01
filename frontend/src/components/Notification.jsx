const Notification = ({ message, style }) => {
    if (message === null) {
        return null
    }

    const boxStyle = {
        ...style,
        fontSize: 20,
        background: 'lightgrey',
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    return (
        <div style={boxStyle}>
            {message}
        </div>
    )
}

export default Notification
