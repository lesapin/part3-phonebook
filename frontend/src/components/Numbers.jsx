const Numbers = ({ persons, filter, handleDelete }) =>
        persons.filter(person => 
            filter === '' || person.name.toLowerCase().includes(filter.toLowerCase())
        ).map(({name, number, id}) =>
            <p key={String(name)}>
                {name} {number} {" "}
                <button onClick={() => handleDelete(id, name)}>delete</button>
            </p>
        )

export default Numbers
