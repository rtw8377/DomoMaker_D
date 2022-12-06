const { result } = require('underscore');
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

    helper.sendPost(e.target.action, {name, _csrf}, loadNotesFromServer);
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

    const saveNote = (e, note) => {
        e.preventDefault();
        const inputText = e.target.querySelector('#input').value;
        helper.sendPost('/maker', {inputText, _csrf})
    }

    const noteNodes = props.notes.map(note => {
        return (
            <div key={note._id} className="note">
                <form onSubmit={(e) => { saveNote(e, note); }}>
                    <h3 className="noteName">Name: {note.name} </h3>
                    <textarea id="input" type="text" name='note' placeholder="Type Note here"/>
                    <input type="submit" id="saveButton" value="Save"/>
                </form>
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

//has the user input their password to check if it is the same
const handleCheckPassword = async (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    //if nothing is entered this error occurs
    if(!pass){
        helper.handleError({message:'No password is typed!'});
        return false;
    }
    
    helper.sendPost(e.target.action, {pass, _csrf}, checkPassFromServer)
    return false;
}

//form for the check password
const CheckPasswordForm = (props) => {
    return (
        <div>
            <h2>Confirm your password to continue</h2>
            <form id="checkPassForm"
            name="checkPassForm"
            onSubmit={handleCheckPassword}
            action="/checkPassword"
            method="POST"
            className="passForm"
            >
                <label htmlFor="pass">Current Password: </label>
                <input id="pass" type="password" name="pass" placeholder="Password"/>
                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Submit"/>
            </form>
        </div>

    );
};

//if the password matches, switch to the change password portion
const checkPassFromServer = async (result) => {
    if(result.canChange){
        ReactDOM.render(
            <ChangePasswordForm csrf={data.csrfToken} />,
            document.getElementById('changePassword')
        )
    } else {
        helper.handleError(result);
    }
}

//allows the user to enter a new password
const handleChangePassword = async (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!pass || !pass2){
        helper.handleError({message:'All fields must be filled out'});
        return false;
    }
    
    helper.sendPost('/changePassword', {pass, pass2, _csrf}, (result) => {
        helper.handleError(result);
    });
    
    return false;
}

//form for the new password
const ChangePasswordForm = (props) => {
    return (
        <form id="changePassForm"
            name="changePassForm"
            onSubmit={handleChangePassword}
            action="/changePassword"
            method="POST"
            className="changePassForm"
        >
            <label htmlFor="pass">New Pasword: </label>
            <input id="pass" type="password" name="pass" placeholder="New password"/>
            <label htmlFor="pass2">Retype Pasword: </label>
            <input id="pass2" type="password" name="pass2" placeholder="Retype password"/>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Change"/>
        </form>
    );
};


const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    passwordButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<CheckPasswordForm csrf={data.csrfToken} />,
            document.getElementById('changePassword'));
            return false;
    });

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