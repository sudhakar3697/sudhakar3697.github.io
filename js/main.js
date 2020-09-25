const out = document.getElementById('outc');

const OC_API_URL = `https://our-clipboard.herokuapp.com/api/oc-data`;
// const OC_API_URL = `http://localhost:5000/api/oc-data`;

async function loadData() {
    applyTheme(true);
    showClips();
    getArticles();
    getProjects();
    addTwitterTimeline('light');
}

async function showClips() {
    try {
        let doc = await fetch(OC_API_URL);
        doc = await doc.text();
        if (doc)
            out.value += doc + '\n';
    } catch (err) {
        console.log(err);
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
            // const p2 = document.createElement('p');
            // p2.innerHTML = `${positive_reactions_count} reaction(s) | ${comments_count} comment(s)`;
            d.appendChild(h);
            d.appendChild(p1);
            // d.appendChild(p2);
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
            // const p2 = document.createElement('p');
            // p2.innerHTML = `${stargazers_count} stargazer(s)`;
            d.appendChild(h);
            d.appendChild(p1);
            // d.appendChild(p2);
            ar.appendChild(d);
            document.getElementById('repos').appendChild(ar);
        }
    } catch (err) {
        console.log(err);
    }
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
    } catch (err) {
        console.log(err);
        document.getElementById('oc-status').style.display = 'block';
        document.getElementById('oc-status').classList.remove('oc-status-success', 'oc-status-danger');
        document.getElementById('oc-status').classList.add('oc-status-danger');
        document.getElementById('oc-status-text').innerHTML = 'Updation failed';
    }
}

document.querySelector('#show-oc-button').addEventListener('click', () => {
    document.getElementById('about-me').style.display = 'none';
    document.getElementById('oc-section').style.display = 'block';
});

document.querySelector('#oc-status-close').addEventListener('click', () => {
    document.getElementById('oc-status').style.display = 'none';
});

document.querySelector('#about-me-button').addEventListener('click', () => {
    document.getElementById('oc-section').style.display = 'none';
    document.getElementById('about-me').style.display = 'block';
});

// toggle skills & personal in About me

let skillOpen = false;
document.querySelector('#skills-expander').addEventListener('click', () => {
    if (skillOpen) {
        document.getElementById('skills').style.display = 'none';
        document.getElementById('skills-expander').innerHTML = '&#709;';
        skillOpen = false;
    }
    else {
        document.getElementById('skills').style.display = 'block';
        document.getElementById('skills-expander').innerHTML = '&#708;';
        skillOpen = true;
    }
});


let persOpen = true;
document.querySelector('#personal-expander').addEventListener('click', () => {
    if (persOpen) {
        document.getElementById('personal').style.display = 'none';
        document.getElementById('personal-expander').innerHTML = '&#709;';
        persOpen = false;
    }
    else {
        document.getElementById('personal').style.display = 'block';
        document.getElementById('personal-expander').innerHTML = '&#708;';
        persOpen = true;
    }
});

// Dark theme
let isDark = localStorage.getItem('dark');

function applyTheme(noToggle = false) {
    if (isDark && noToggle) {
        const secColor = '#fafafa';
        document.body.style.backgroundColor = 'black';
        document.body.style.color = secColor;
        document.getElementsByTagName('header')[0].style.backgroundColor = '#282828';
        document.getElementById('outc').style.backgroundColor = 'black';
        document.getElementById('outc').style.color = secColor;
        document.getElementById('night').innerHTML = 'Light Theme';
        document.getElementsByTagName('button')[0].style.color = 'black';
        document.getElementsByTagName('button')[0].style.backgroundColor = secColor;
        document.getElementsByTagName('button')[0].style.borderColor = secColor;
        document.getElementsByTagName('button')[1].style.color = 'black';
        document.getElementsByTagName('button')[1].style.backgroundColor = secColor;
        document.getElementsByTagName('button')[1].style.borderColor = secColor;
        document.getElementsByTagName('button')[2].style.color = 'black';
        document.getElementsByTagName('button')[2].style.backgroundColor = secColor;
        document.getElementsByTagName('button')[2].style.borderColor = secColor;
        for (const a of document.getElementsByTagName('a')) {
            a.style.color = '#34e2eb';
        }
        addTwitterTimeline('dark');
        for (const tr of document.getElementsByTagName('tr')) {
            tr.style.backgroundColor = 'black';
        }
        for (const tr of document.getElementsByTagName('tr')) {
            tr.addEventListener('mouseover', () => {
                tr.style.backgroundColor = '#282828';
            });
            tr.addEventListener('mouseout', () => {
                tr.style.backgroundColor = 'black';
            });
        }
        localStorage.setItem('dark', true);
    }
    else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        document.getElementsByTagName('header')[0].style.backgroundColor = 'white';
        document.getElementById('outc').style.backgroundColor = 'white';
        document.getElementById('outc').style.color = 'black';
        document.getElementById('night').innerHTML = 'Dark Theme';
        document.getElementsByTagName('button')[0].style.color = 'white';
        document.getElementsByTagName('button')[0].style.backgroundColor = 'black';
        document.getElementsByTagName('button')[0].style.borderColor = 'black';
        document.getElementsByTagName('button')[1].style.color = 'white';
        document.getElementsByTagName('button')[1].style.backgroundColor = 'black';
        document.getElementsByTagName('button')[1].style.borderColor = 'black';
        document.getElementsByTagName('button')[2].style.color = 'white';
        document.getElementsByTagName('button')[2].style.backgroundColor = 'black';
        document.getElementsByTagName('button')[2].style.borderColor = 'black';
        for (const a of document.getElementsByTagName('a')) {
            a.style.color = 'blue';
        }
        addTwitterTimeline('light');
        for (const tr of document.getElementsByTagName('tr')) {
            tr.style.backgroundColor = 'white';
        }
        for (const tr of document.getElementsByTagName('tr')) {
            tr.addEventListener('mouseover', () => {
                tr.style.backgroundColor = '#f5f5f5';
            });
            tr.addEventListener('mouseout', () => {
                tr.style.backgroundColor = 'white';
            });
        }
        localStorage.setItem('dark', false);
    }
}

document.querySelector('#night').addEventListener('click', () => {
    applyTheme();
});

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