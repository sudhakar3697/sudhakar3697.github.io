const out = document.getElementById('outc');

const OC_API_URL = `https://determined-worm-dress.cyclic.app/api/oc-data`;

async function loadData() {
    const theme = (localStorage.getItem('theme') === 'dark') ? 'dark' : 'light';
    applyTheme(theme); // invokes addTwitterTimeline(theme)
    showClips();
    getArticles();
    getProjects();
}

async function showClips() {
    try {
        out.value = '';
        let doc = await fetch(OC_API_URL);
        doc = await doc.text();
        if (doc) {
            out.value = doc;
            localStorage.setItem('oc_data', out.value);
        }
    } catch (err) {
        console.log(err);
        out.value = localStorage.getItem('oc_data');
        console.log('value taken from local storage');
        document.getElementById('updatetop').style.display = 'none';
        document.getElementById('updatebottom').style.display = 'none';
        const p = document.createElement('p');
        p.innerHTML = 'You are offline!';
        document.getElementById('oc-section').appendChild(p);
    }
}

async function getArticles() {
    try {
        const res = await fetch(`https://dev.to/api/articles?username=sudhakar3697`);
        const articles = await res.json();
        for (const article of articles) {
            const { title, url, comments_count, positive_reactions_count, readable_publish_date, tag_list } = article;
            const ar = document.createElement('li');
            const d = document.createElement('div');
            const a = document.createElement('a');
            a.href = url;
            a.innerHTML = title;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            const h = document.createElement('h4');
            h.appendChild(a);
            const p1 = document.createElement('p');
            p1.innerHTML = `<strong>Published:</strong> ${readable_publish_date} ${tag_list.map(i => `#${i}`).join(' ')}`;
            d.appendChild(h);
            d.appendChild(p1);
            ar.appendChild(d);
            document.getElementById('articles').appendChild(ar);
        }
    } catch (err) {
        console.log(err);
    }
}

async function getProjects() {
    try {
        const res = await fetch(`https://api.github.com/users/sudhakar3697/repos`);
        const repos = await res.json();
        repos.sort((a, b) => {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        for (const repo of repos) {
            const { full_name, html_url, description, stargazers_count } = repo;
            const ar = document.createElement('li');
            const d = document.createElement('div');
            const a = document.createElement('a');
            a.href = html_url;
            a.innerHTML = full_name;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            const h = document.createElement('h4');
            h.appendChild(a);
            const p1 = document.createElement('p');
            p1.innerHTML = `${description}`;
            d.appendChild(h);
            d.appendChild(p1);
            ar.appendChild(d);
            document.getElementById('repos').appendChild(ar);
        }
    } catch (err) {
        console.log(err);
    }
}

async function addTwitterTimeline(theme) {
    const holder = document.getElementById('tw-tl');
    holder.innerHTML = null;
    twttr.widgets.createTimeline(
        {
            sourceType: 'profile',
            screenName: 'sudhakar3697'
        },
        holder,
        {
            theme,
            tweetLimit: 3,
            chrome: 'noheader'
        }
    );
}

async function update() {
    try {
        await fetch(OC_API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: out.value })
        });
        document.getElementById('oc-status').style.display = 'block';
        document.getElementById('oc-status').classList.remove('oc-status-success', 'oc-status-danger');
        document.getElementById('oc-status').classList.add('oc-status-success');
        document.getElementById('oc-status-text').innerHTML = 'Updated Successfully';
        localStorage.setItem('oc_data', out.value);
    } catch (err) {
        console.log(err);
        document.getElementById('oc-status').style.display = 'block';
        document.getElementById('oc-status').classList.remove('oc-status-success', 'oc-status-danger');
        document.getElementById('oc-status').classList.add('oc-status-danger');
        document.getElementById('oc-status-text').innerHTML = 'Updation failed';
    }
}

document.querySelector('#oc-status-close').addEventListener('click', () => {
    document.getElementById('oc-status').style.display = 'none';
});

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
        addStyleSheet('css/dark.css');
        document.getElementById('night').innerHTML = 'Light Theme';
        addTwitterTimeline('dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        addStyleSheet('css/light.css');
        document.getElementById('night').innerHTML = 'Dark Theme';
        addTwitterTimeline('light');
        localStorage.setItem('theme', 'light');
    }
}

document.querySelector('#night').addEventListener('click', () => {
    applyTheme(localStorage.getItem('theme') === 'light' ? 'dark' : 'light');
});
