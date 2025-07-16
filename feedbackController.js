class FeedbackController {
    constructor(model) {
        this.model = model;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadFeedback();
            this.populateCollaboratorFilter();
            document.getElementById('feedback-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.addFeedback();
            });
        });
    }

    addChecklistItem(button) {
        const container = document.getElementById('checklist-container');
        const newChecklistItem = document.createElement('div');
        newChecklistItem.className = 'flex items-center mb-2';
        newChecklistItem.innerHTML = `
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Añadir mejora">
            <button class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onclick="controller.addChecklistItem(this)">Añadir</button>
        `;
        container.appendChild(newChecklistItem);
    }

    addFeedback() {
        const feedback = {
            id: Date.now(),
            collaborator: document.getElementById('collaborator-name').value,
            po: document.getElementById('po-assigned').value,
            comments: document.getElementById('feedback-comments').value,
            date: document.getElementById('feedback-date').value,
            checklist: []
        };

        const checklistItems = document.querySelectorAll('#checklist-container input[type="text"]');
        checklistItems.forEach(item => {
            if (item.value) {
                feedback.checklist.push({ text: item.value, done: false });
            }
        });

        this.model.add(feedback);
        document.getElementById('feedback-form').reset();
        document.getElementById('checklist-container').innerHTML = `
            <div class="flex items-center mb-2">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Añadir mejora">
                <button class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onclick="controller.addChecklistItem(this)">Añadir</button>
            </div>
        `;
        this.loadFeedback();
        this.populateCollaboratorFilter();
    }

    loadFeedback() {
        const feedbacks = this.model.getAll();
        this.displayFeedback(feedbacks);
    }

    deleteFeedback(id) {
        this.model.delete(id);
        this.loadFeedback();
        this.populateCollaboratorFilter();
    }

    toggleChecklistItem(id, text) {
        this.model.toggleChecklistItem(id, text);
        this.loadFeedback();
    }

    populateCollaboratorFilter() {
        const feedbacks = this.model.getAll();
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

    filterFeedback() {
        const collaborator = document.getElementById('filter-collaborator').value;
        const period = document.getElementById('filter-period').value;

        let feedbacks = this.model.getAll();

        if (collaborator) {
            feedbacks = feedbacks.filter(fb => fb.collaborator === collaborator);
        }

        if (period) {
            const months = parseInt(period);
            const limitDate = new Date();
            limitDate.setMonth(limitDate.getMonth() - months);
            feedbacks = feedbacks.filter(fb => new Date(fb.date) >= limitDate);
        }

        this.displayFeedback(feedbacks);
        this.displaySummary(feedbacks, collaborator);
    }

    displayFeedback(feedbacks) {
        const historyContainer = document.getElementById('feedback-history');
        historyContainer.innerHTML = '';
        feedbacks.forEach(fb => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border px-4 py-2">${fb.collaborator}</td>
                <td class="border px-4 py-2">${fb.po}</td>
                <td class="border px-4 py-2">${fb.comments}</td>
                <td class="border px-4 py-2">${fb.date}</td>
                <td class="border px-4 py-2">${fb.checklist.map(item => `
                    <div class="flex items-center">
                        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="controller.toggleChecklistItem(${fb.id}, '${item.text}')" class="mr-2">
                        <span>${item.text}</span>
                    </div>
                `).join('')}</td>
                <td class="border px-4 py-2">
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline" onclick="controller.deleteFeedback(${fb.id})">Eliminar</button>
                </td>
            `;
            historyContainer.appendChild(row);
        });
    }

    displaySummary(feedbacks, collaborator) {
        const summaryContainer = document.getElementById('summary-container');
        summaryContainer.innerHTML = '';

        if (collaborator) {
            const totalFeedbacks = feedbacks.length;
            let totalChecklistItems = 0;
            let completedChecklistItems = 0;

            feedbacks.forEach(fb => {
                totalChecklistItems += fb.checklist.length;
                completedChecklistItems += fb.checklist.filter(item => item.done).length;
            });

            const completionPercentage = totalChecklistItems > 0 ? (completedChecklistItems / totalChecklistItems) * 100 : 0;

            summaryContainer.innerHTML = `
                <div class="bg-gray-200 p-4 rounded-lg">
                    <h3 class="text-lg font-bold mb-2">Resumen de ${collaborator}</h3>
                    <p>Total de Feedbacks: ${totalFeedbacks}</p>
                    <p>Total de Ítems de Checklist: ${totalChecklistItems}</p>
                    <p>Ítems Completados: ${completedChecklistItems}</p>
                    <p>Porcentaje de Mejora: ${completionPercentage.toFixed(2)}%</p>
                    <div class="w-full bg-gray-300 rounded-full h-4">
                        <div class="bg-blue-500 h-4 rounded-full" style="width: ${completionPercentage}%;"></div>
                    </div>
                </div>
            `;
        }
    }

    exportToExcel() {
        let feedbacks = this.model.getAll();
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
}
