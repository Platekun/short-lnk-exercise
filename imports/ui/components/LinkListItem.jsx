import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClipBoard from 'clipboard';
import moment from 'moment';

class LinkListItem extends Component {
    constructor(props) {
        super();

        this.toggleLink = this.toggleLink.bind(this)
    }

    componentDidMount() {
        const { updateCopiedLink, _id } = this.props;

        this.clipboard = new ClipBoard(this.refs.copy)
            .on('success', () => updateCopiedLink(_id))
            .on('error', () => alert('Unable to copy. Please manually copy the link'));
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    toggleLink(evt) {
        evt.preventDefault();
        const { _id, visible } = this.props;

        Meteor.call('links.setVisibility', _id, visible);
        this.setState((prevState, props) => ({ ...prevState, visible: !visible }));
    }

    renderStats() {
        const { visitedCount, lastVisitedAt } = this.props;

        const visitMessage = visitedCount === 1 ? 'visit' : 'visits';
        const lastVisitedMessage = typeof lastVisitedAt === 'number' ? `- (visited ${moment(lastVisitedAt).fromNow()})` : null;

        return <p>{visitedCount} {visitMessage} {lastVisitedMessage}</p>
    }

    render() {
        const { _id, url, visitedCount, lastVisitedAt, visible, onClipboard } = this.props;
        const shortUrl = `${location.protocol}//${location.host}/${_id}`;

        return (
            <li className="item">
                <h3>{url}</h3>
                <div className="item__message">
                    <p>{shortUrl}</p>
                    {this.renderStats()}
                </div>
                <div>
                    <button className="button button--pill button--link"><a href={shortUrl} target="_blank">Visit</a></button>
                    <button className="button button--pill button--link" ref="copy" data-clipboard-text={shortUrl}>{onClipboard || 'Copy'}</button>
                    <button className="button button--pill button--link" onClick={this.toggleLink}>{visible ? 'Hide' : 'Unhide'}</button>
                </div>
            </li>
        );
    }
}

LinkListItem.propTypes = {
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    visitedCount: PropTypes.number.isRequired,
    lastVisitedAt: PropTypes.number
}

export default LinkListItem;
