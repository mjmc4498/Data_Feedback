document.addEventListener('DOMContentLoaded', () => {
    loadFeedback();
    populateCollaboratorFilter();
});

function addChecklistItem(button) {
    const container = document.getElementById('checklist-container');
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group mb-2';
    inputGroup.innerHTML = `
        <input type="text" class="form-control" placeholder="Añadir mejora">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" onclick="addChecklistItem(this)">Añadir</button>
        </div>
    `;
    if (button) {
        const input = button.parentElement.previousElementSibling;
        if (input.value.trim() !== '') {
            button.parentElement.parentElement.insertAdjacentElement('afterend', inputGroup);
            input.value = '';
        }
    } else {
        container.appendChild(inputGroup);
    }
}

document.getElementById('feedback-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const feedback = {
        id: Date.now(),
        collaborator: document.getElementById('collaborator-name').value,
        po: document.getElementById('po-assigned').value,
        comments: document.getElementById('feedback-comments').value,
        date: document.getElementById('feedback-date').value,
        checklist: []
    };

    const checklistItems = document.querySelectorAll('#checklist-container .input-group');
    checklistItems.forEach(item => {
        const text = item.querySelector('input[type="text"]').value;
        if (text) {
            feedback.checklist.push({ text: text, done: false });
        }
    });

    saveFeedback(feedback);
    this.reset();
    document.getElementById('checklist-container').innerHTML = `
        <div class="input-group mb-2">
            <input type="text" class="form-control" placeholder="Añadir mejora">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" onclick="addChecklistItem(this)">Añadir</button>
            </div>
        </div>
    `;
    loadFeedback();
    populateCollaboratorFilter();
});

function saveFeedback(feedback) {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

function loadFeedback() {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    displayFeedback(feedbacks);
}

function deleteFeedback(id) {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks = feedbacks.filter(fb => fb.id !== id);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    loadFeedback();
    populateCollaboratorFilter();
}

function toggleChecklistItem(id, text) {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const feedback = feedbacks.find(fb => fb.id === id);
    if (feedback) {
        const item = feedback.checklist.find(item => item.text === text);
        if (item) {
            item.done = !item.done;
        }
    }
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    loadFeedback();
}

function populateCollaboratorFilter() {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const collaborators = [...new Set(feedbacks.map(fb => fb.collaborator))];
    const filterSelect = document.getElementById('filter-collaborator');
    filterSelect.innerHTML = '<option value="">Todos</option>';
    collaborators.forEach(c => {
        const option = document.createElement('option');
        option.value = c;
        option.textContent = c;
        filterSelect.appendChild(option);
    });
}

function filterFeedback() {
    const collaborator = document.getElementById('filter-collaborator').value;
    const period = document.getElementById('filter-period').value;

    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

    if (collaborator) {
        feedbacks = feedbacks.filter(fb => fb.collaborator === collaborator);
    }

    if (period) {
        const months = parseInt(period);
        const limitDate = new Date();
        limitDate.setMonth(limitDate.getMonth() - months);
        feedbacks = feedbacks.filter(fb => new Date(fb.date) >= limitDate);
    }

    displayFeedback(feedbacks);
    displaySummary(feedbacks, collaborator);
}

function displayFeedback(feedbacks) {
    const historyContainer = document.getElementById('feedback-history');
    historyContainer.innerHTML = '';
    feedbacks.forEach(fb => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fb.collaborator}</td>
            <td>${fb.po}</td>
            <td>${fb.comments}</td>
            <td>${fb.date}</td>
            <td>${fb.checklist.map(item => `
                <div class="checklist-item">
                    <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleChecklistItem(${fb.id}, '${item.text}')">
                    <span>${item.text}</span>
                </div>
            `).join('')}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteFeedback(${fb.id})">Eliminar</button>
            </td>
        `;
        historyContainer.appendChild(row);
    });
}

function displaySummary(feedbacks, collaborator) {
    const summaryContainer = document.getElementById('summary-container');
    if (!summaryContainer) {
        const container = document.createElement('div');
        container.id = 'summary-container';
        container.className = 'card mt-4';
        document.querySelector('.container').insertBefore(container, document.querySelector('.card.mt-4'));
    }

    const container = document.getElementById('summary-container');
    container.innerHTML = '';

    if (collaborator) {
        const totalFeedbacks = feedbacks.length;
        let totalChecklistItems = 0;
        let completedChecklistItems = 0;

        feedbacks.forEach(fb => {
            totalChecklistItems += fb.checklist.length;
            completedChecklistItems += fb.checklist.filter(item => item.done).length;
        });

        const completionPercentage = totalChecklistItems > 0 ? (completedChecklistItems / totalChecklistItems) * 100 : 0;

        container.innerHTML = `
            <div class="card-header">Resumen de ${collaborator}</div>
            <div class="card-body">
                <p>Total de Feedbacks: ${totalFeedbacks}</p>
                <p>Total de Ítems de Checklist: ${totalChecklistItems}</p>
                <p>Ítems Completados: ${completedChecklistItems}</p>
                <p>Porcentaje de Mejora: ${completionPercentage.toFixed(2)}%</p>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${completionPercentage}%;" aria-valuenow="${completionPercentage}" aria-valuemin="0" aria-valuemax="100">${completionPercentage.toFixed(2)}%</div>
                </div>
            </div>
        `;
    }
}

function exportToExcel() {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const worksheet = XLSX.utils.json_to_sheet(feedbacks.map(fb => ({
        Colaborador: fb.collaborator,
        'PO Asignado': fb.po,
        Comentarios: fb.comments,
        Fecha: fb.date,
        Mejoras: fb.checklist.map(item => `${item.text} (${item.done ? 'Completado' : 'Pendiente'})`).join(', ')
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');
    XLSX.writeFile(workbook, 'feedback.xlsx');
}
