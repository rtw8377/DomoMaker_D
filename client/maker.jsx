const helper = require('./helper.js');

const handleNote = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#noteName').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name) {
        helper.handleError('All fields are required!');
        return false;
    }

    sendPost(e.target.action, {name, _csrf}, loadNotesFromServer);
    return false;
}

const NoteForm = (props) => {
    return (
        <form id="noteForm"
            onSubmit={handleNote}
            name="noteForm"
            action="/maker"
            method="POST"
            className="noteForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="noteName" type="text" name="name" placeholder="Note Name" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeNoteSubmit" type="submit" value="Make Note" />
        </form>
    );
};

const NoteList = (props) => {
    if(props.notes.length === 0) {
        return (
            <div className="noteList">
                <h3 className="emptyNote">No Notes Yet!</h3>
            </div>
        );
    }

    const noteNodes = props.notes.map(note => {
        return (
            <div key={note._id} className="note">
                <img src="/assets/img/placeholder.png" alt="placeholder" className="placeholder" />
                <h3 className="noteName">Name: {note.name} </h3>
            </div>
        );
    });

    return (
        <div className="noteList">
            {noteNodes}
        </div>
    );
}

const loadNotesFromServer = async () => {
    const response = await fetch('/getNotes');
    const data = await response.json();
    ReactDOM.render(
        <NoteList notes={data.notes} />,
        document.getElementById('notes')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <NoteForm csrf={data.csrfToken} />,
        document.getElementById('makeNote')
    );

    ReactDOM.render(
        <NoteList notes={[]} />,
        document.getElementById('notes')
    );

    loadNotesFromServer();
};

window.onload = init;