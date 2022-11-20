const API_URL = `https://determined-worm-dress.cyclic.app/api/ob-data`;

async function init() {
    showFileList(true);
    showUploadsList(true);
}

async function showFileList(init = false) {
    try {
        const fileTable = document.getElementById('file-table');

        if (!init) {
            while (fileTable.firstChild) {
                fileTable.removeChild(fileTable.lastChild);
            }
            fileTable.insertAdjacentHTML('beforeend', `                
            <tr>
            <th>File</th>
            <th>Size (MB)</th>
            <th>Updated At</th>
            <th>Controls</th>
        </tr>`);
        }

        let result = await fetch(API_URL);
        result = await result.json();

        for (const file of result) {

            const row = document.createElement('tr');

            const nameCol = document.createElement('td');
            const downloadAnchor = document.createElement('a');
            downloadAnchor.download = file.fullPath;
            getDownloadUrl(file.fullPath, downloadAnchor);
            downloadAnchor.innerHTML = file.fullPath;
            nameCol.appendChild(downloadAnchor);

            const sizeCol = document.createElement('td');
            sizeCol.innerHTML = (file.size / 1048576).toFixed(2);

            const updatedCol = document.createElement('td');
            const dateStr = new Intl.DateTimeFormat(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
            }).format(new Date(file.updated));
            updatedCol.innerHTML = dateStr;

            const delButtonCol = document.createElement('td');
            const deleteButton = document.createElement('span');
            deleteButton.setAttribute('class', 'u-button');
            deleteButton.innerHTML = '&#x2718;';
            deleteButton.title = `Delete ${file.fullPath}`;
            deleteButton.onclick = () => { deleteItem(file.fullPath) };
            delButtonCol.appendChild(deleteButton);

            row.appendChild(nameCol);
            row.appendChild(sizeCol);
            row.appendChild(updatedCol);
            row.appendChild(delButtonCol);

            fileTable.appendChild(row);
        }
    } catch (err) {
        console.log(err);
        alert('File listing failed');
    }
}


async function showUploadsList(init = false) {
    try {
        const uploadsTable = document.getElementById('upload-progress-table');

        if (!init) {
            while (uploadsTable.firstChild) {
                uploadsTable.removeChild(uploadsTable.lastChild);
            }
            uploadsTable.insertAdjacentHTML('beforeend', `<tr>
            <th>File</th>
            <th>Progress</th>
            <th>Pause/Resume</th>
            <th>Cancel</th></tr>`);
        }

        let result = await fetch(`${API_URL}/uploads`, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        result = await result.json();

        for (const uploadTask of result) {

            const { file, progress, bytesTransferred, totalBytes, state } = uploadTask;

            const row = document.createElement('tr');

            const nameCol = document.createElement('td');
            nameCol.innerHTML = file;

            const progressCol = document.createElement('td');
            progressCol.innerHTML = (state) ? `${progress} % (${bytesTransferred} / ${totalBytes} - ${state})` : 'Yet to start';

            const pauseOrResumeCol = document.createElement('td');
            const pauseOrResumeButton = document.createElement('button');
            pauseOrResumeButton.innerHTML = (state === 'running') ? 'Pause' : 'Resume';
            pauseOrResumeButton.onclick = () => { pauseOrResumeUpload(file) };
            pauseOrResumeCol.appendChild(pauseOrResumeButton);

            const cancelCol = document.createElement('td');
            const cancelButton = document.createElement('button');
            cancelButton.innerHTML = 'Cancel';
            cancelButton.onclick = () => { cancelUpload(file) };
            cancelCol.appendChild(cancelButton);

            row.appendChild(nameCol);
            row.appendChild(progressCol);
            if (state) {
                row.appendChild(pauseOrResumeCol);
                row.appendChild(cancelCol);
            }

            uploadsTable.appendChild(row);
        }
    } catch (err) {
        console.log(err);
        alert('Ongoing Uploads listing failed');
    }
}

function validateSize(data) {
    if (data.files.length > 4) {
        alert('You can only upload 4 files at a time');
    }
    else {
        for (const file of data.files) {
            const fileSize = file.size / (1024 * 1024);
            if (fileSize > 250) {
                alert(`${file.name} is ${fileSize.toFixed(2)} MB.File should be less than 250 MB`);
            }
        }
    }
}

async function deleteItem(path) {
    try {
        const result = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path
            })
        });
        if (result.status === 200)
            alert('Deleted Successfully. Refresh to update the UI.');
        else
            alert('Delete failed');
    } catch (err) {
        console.log(err);
        alert('Delete failed');
    }
}

async function getDownloadUrl(path, downloadAnchor) {
    try {
        const result = await fetch(`${API_URL}/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path
            })
        });
        downloadAnchor.href = await result.text();
    } catch (err) {
        console.log(err);
    }
}

async function upload() {
    try {
        const uploader = document.getElementById('file-uploader');
        let result = await fetch(API_URL, {
            method: 'POST',
            body: new FormData(uploader)
        });
        result = await result.json();
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

async function cancelUpload(file) {
    try {
        let result = await fetch(`${API_URL}/uploads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operation: 'cancel',
                file
            })
        });
        result = await result.text();
        alert(result);
    } catch (err) {
        console.log(err);
    }
}

async function pauseOrResumeUpload(file) {
    try {
        let result = await fetch(`${API_URL}/uploads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operation: 'pause-or-resume',
                file
            })
        });
        result = await result.text();
        alert(result);
    } catch (err) {
        console.log(err);
    }
}
