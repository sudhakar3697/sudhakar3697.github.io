const TD_SI_URL = `https://sudhakar3697.cyclic.app/api/td-data/sign-in`;
const TD_API_URL = `https://sudhakar3697.cyclic.app/api/td-data`;
const out = document.getElementById('tdta');

function addStyleSheet(file) {
    const stylesheet = document.getElementById('theme-stylesheet');
    if (stylesheet) {
        stylesheet.href = file;
    }
    else {
        const head = document.head;
        const link = document.createElement('link');
        link.id = 'theme-stylesheet';
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = file;
        head.appendChild(link);
    }
}

function applyTheme(theme) {
    if (theme === 'dark') {
        addStyleSheet('dark.css');
        localStorage.setItem('theme', 'dark');
    }
    else {
        addStyleSheet('light.css');
        localStorage.setItem('theme', 'light');
    }
}

document.getElementById('pwd').addEventListener('keyup', (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
        document.getElementById('sib').click();
    }
});

function showSignInOrContent() {
    const theme = (localStorage.getItem('theme') === 'dark') ? 'dark' : 'light';
    applyTheme(theme);

    google.accounts.id.initialize({
        client_id:
          "244780050095-9ccg4opqdf7eimdi36h1toi232la4ecv.apps.googleusercontent.com",
        callback: onSignIn,
      });
      google.accounts.id.renderButton(
        document.getElementById("gsButtonDiv"),
        {
          theme: "filled_black",
          size: "medium",
        }
      );
    document.getElementById('tdta').value = '';
    document.getElementById('id').value = '';
    document.getElementById('pwd').value = '';
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('si-section').style.display = 'none';
        document.getElementById('td-section').style.display = 'block';
        loadToDOs(token, localStorage.getItem('token_type'));
    }
    else {
        document.getElementById('td-section').style.display = 'none';
        document.getElementById('si-section').style.display = 'block';
    }
}

async function signIn() {
    const id = document.getElementById('id').value;
    const password = document.getElementById('pwd').value;
    const res = await fetch(TD_SI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password })
    });
    const result = await res.text();
    if (res.status === 200) {
        localStorage.setItem('token', result);
        showSignInOrContent();
    }
    else {
        alert(result);
    }
}

async function signOut() {
    localStorage.removeItem('td_data');
    localStorage.removeItem('token_type');
    localStorage.removeItem('token');
    signOutGoogle();
    showSignInOrContent();
}

async function loadToDOs(token, type) {
    try {
        out.value = '';
        let doc = await fetch(`${TD_API_URL}${type ? `?type=${type}` : ''}`, {
            headers: {
                'Authorization': `BEARER ${token}`
            }
        });
        doc = await doc.text();
        if (doc) {
            out.value = doc;
            localStorage.setItem('td_data', out.value);
        }
    } catch (err) {
        console.log(err);
        out.value = localStorage.getItem('td_data');
        console.log('value taken from local storage');
        document.getElementById('update-button').style.display = 'none';
        const p = document.createElement('p');
        p.innerHTML = 'You are offline!';
        document.getElementById('td-section').appendChild(p);
    }
}

async function updateToDOs() {
    try {
        const type = localStorage.getItem('token_type');
        const res = await fetch(`${TD_API_URL}${type ? `?type=${type}` : ''}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `BEARER ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ data: out.value })
        });
        if (res.status === 200) {
            document.getElementById('td-status').style.display = 'block';
            document.getElementById('td-status').classList.remove('td-status-success', 'td-status-danger');
            document.getElementById('td-status').classList.add('td-status-success');
            document.getElementById('td-status-text').innerHTML = 'Updated Successfully';
            localStorage.setItem('td_data', out.value);
        }
        else {
            document.getElementById('td-status').style.display = 'block';
            document.getElementById('td-status').classList.remove('td-status-success', 'td-status-danger');
            document.getElementById('td-status').classList.add('td-status-danger');
            document.getElementById('td-status-text').innerHTML = 'Updation failed';
        }
    } catch (err) {
        console.log(err);
        document.getElementById('td-status').style.display = 'block';
        document.getElementById('td-status').classList.remove('td-status-success', 'td-status-danger');
        document.getElementById('td-status').classList.add('td-status-danger');
        document.getElementById('td-status-text').innerHTML = 'Updation failed';
    }
}

document.querySelector('#td-status-close').addEventListener('click', () => {
    document.getElementById('td-status').style.display = 'none';
});

function onSignIn(googleUser) {
    localStorage.setItem('token', googleUser.credential);
    localStorage.setItem('token_type', 'google');
    showSignInOrContent();
}

function signOutGoogle() {
    google.accounts.id.disableAutoSelect();
}
