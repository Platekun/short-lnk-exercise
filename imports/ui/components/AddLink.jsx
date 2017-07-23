import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import Modal from 'react-modal';

class AddLink extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            error: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayModal = this.displayModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.renderError = this.renderError.bind(this);
    }

    handleSubmit(evt) {
        evt.preventDefault();

        const userInput = this.refs.url;
        const url = userInput.value.trim();

        Meteor.call('links.insert', url, (err, res) => {
            if (err) {
                this.setState((prevState, props) => ({ error: err.reason }));
            } else {
                this.setState((prevState, props) => ({ isOpen: false, error: '' }));
                userInput.value = '';
            }
        });
    }

    displayModal() {
        this.setState((prevState, props) => ({ ...prevState, isOpen: !prevState.isOpen }));
    }

    closeModal() {
        const userInput = this.refs.url;

        this.setState(
            (prevState, props) => ({ ...prevState, isOpen: !prevState.isOpen, error: '' }),
            () => userInput.value = ''
        );
    }

    renderError() {
        return this.state.error ? <p>{this.state.error}</p> : '';
    }

    render() {
        const { handleSubmit, displayModal, closeModal, renderError } = this;
        const { isOpen } = this.state;

        return (
            <div>
                <button onClick={displayModal} className="button">+ Add Link!</button>
                <Modal
                    isOpen={isOpen}
                    onAfterOpen={() => this.refs.url.focus()}
                    onRequestClose={closeModal}
                    contentLabel="Add Link"
                    className="boxed-view__box"
                    overlayClassName="boxed-view boxed-view--modal">
                    <form onSubmit={handleSubmit} className="boxed-view__form">
                        <h2>New Link</h2>
                        {renderError()}
                        <input type="text" ref="url" placeholder="URL" />
                        <button className="button">Submit</button>
                        <button type="button" className="button button--normal" onClick={closeModal}>Cancel</button>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default AddLink;
