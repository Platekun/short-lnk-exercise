import { Session } from 'meteor/session';
import React, { Component } from 'react';

const LinksListFilter = props =>
    <div>
        <label className="checkbox">
            <input type="checkbox"
                onChange={evt => Session.set('showVisible', !evt.target.checked)}
                defaultChecked={!Session.get('showVisible')}
                className="checkbox__box"
                />
            Show hidden links.
        </label>
    </div>;

export default LinksListFilter;