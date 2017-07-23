import { Meteor } from 'meteor/meteor';
import '../imports/startup/simple-schema-config';
import '../imports/api/users';
import { Links } from '../imports/api/links';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
    WebApp.connectHandlers.use((req, res, next) => {
        const _id = req.url.slice(1);
        const result = Links.findOne({ _id });

        if(result) {
            res.statusCode = 302;
            res.setHeader('Location', result.url);
            Meteor.call('links.trackVisit', _id);
            res.end();
        } else {
            next();
        }
    })
});

