import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';

export const Links = new Mongo.Collection('links');

if (Meteor.isServer) {
    Meteor.publish('links', function () {
        return Links.find({
            userId: this.userId
        })
    });
}

Meteor.methods({
    'links.insert' (url) {
        if (!this.userId) {
            throw new Meteor.Error('Unauthorized', 'Log in first.');
        } else {
            new SimpleSchema({
                url: {
                    type: String,
                    label: 'Your link',
                    regEx: SimpleSchema.RegEx.Url
                }
            }).validate({
                url
            })

            Links.insert({
                _id: shortid.generate(),
                userId: this.userId,
                url,
                visible: true,
                visitedCount: 0,
                lastVisitedAt: null
            });
        }
    },

    'links.setVisibility' (_id, visible) {
        if (!this.userId) {
            throw new Meteor.Error('Unauthorized', 'Log in first.');
        } else {
            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                },
                visible: {
                    type: Boolean
                }
            }).validate({
                _id,
                visible
            });

            Links.update({
                _id
            }, {
                $set: {
                    visible: !visible
                }
            });
        }
    },

    'links.trackVisit' (_id) {
        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            }
        }).validate({
            _id
        });

        Links.update({
            _id
        }, {
            $inc: {
                visitedCount: 1
            },
            $set: {
                lastVisitedAt: new Date().getTime()
            }
        });
    }
});