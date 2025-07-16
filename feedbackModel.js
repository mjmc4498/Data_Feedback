class FeedbackModel {
    constructor() {
        this.feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    }

    getAll() {
        return this.feedbacks;
    }

    add(feedback) {
        this.feedbacks.push(feedback);
        this._commit();
    }

    delete(id) {
        this.feedbacks = this.feedbacks.filter(fb => fb.id !== id);
        this._commit();
    }

    toggleChecklistItem(id, text) {
        const feedback = this.feedbacks.find(fb => fb.id === id);
        if (feedback) {
            const item = feedback.checklist.find(item => item.text === text);
            if (item) {
                item.done = !item.done;
            }
        }
        this._commit();
    }

    _commit() {
        localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
}
