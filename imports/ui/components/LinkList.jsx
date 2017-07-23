import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { Links } from '../../api/links.js';
import React, { Component } from 'react';
import LinkListItem from './LinkListItem';
import FlipMove from 'react-flip-move';

class LinkList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            links: [],
            copiedLink: '-1'
        }

        this.renderLinks = this.renderLinks.bind(this);
        this.updateCopiedLink = this.updateCopiedLink.bind(this);
    }

    componentDidMount() {
        this.tracker = Tracker.autorun(() => {
            Meteor.subscribe('links');
            console.warn(`Session.get('showVisible')`, Session.get('showVisible'));
            const links = Links.find({ visible: Session.get('showVisible') }).fetch();
            this.setState((prevState, props) => ({ ...prevState, links }));
        });
    }

    componentWillUnmount() {
        this.tracker.stop();
    }

    updateCopiedLink(index) {
        this.setState((prevState, props) => ({ ...prevState, copiedLink: index }));
    }

    renderLinks() {
        const { updateCopiedLink } = this;
        const { links, copiedLink } = this.state;

        const renderedLinks = links.map(link =>
            <LinkListItem
                key={link._id}
                updateCopiedLink={updateCopiedLink}
                onClipboard={copiedLink === link._id ? 'Copied' : 'Copy'}
                {...link}
            />
        );

        return renderedLinks.length ? renderedLinks : <p className="help-text">There aren't any links yet.</p>;
    }

    render() {
        const { renderLinks } = this;

        return (
            <div>
                <ul>
                    <FlipMove maintainContainerHeight="true">
                        {renderLinks()}
                    </FlipMove>
                </ul>
            </div>
        );
    }
}

export default LinkList;
