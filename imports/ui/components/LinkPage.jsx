import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PrivateHeader from './PrivateHeader'
import LinksListFilters from './LinksListFilters';
import AddLink from './AddLink';
import LinkList from './LinkList';

const logout = ({ history }) => Accounts.logout(() => history.replace('/'));

const LinkPage = props =>
    <div>
        <PrivateHeader title="Short Lnk" onLogout={() => logout(props)} />
        <div className="wrapper">
            <LinksListFilters />
            <AddLink />
            <LinkList />
        </div>
    </div>;

export default LinkPage;
