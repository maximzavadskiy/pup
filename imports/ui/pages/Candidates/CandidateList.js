import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    Table,
    Alert,
    Button,
    Glyphicon,
    Grid,
    Row,
    Col,
    Panel,
    ButtonGroup
} from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import _ from 'lodash';
// import UsersCollection from '../../../api/Documents/Documents';

import { timeago, monthDayYear } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './Documents.scss';

const toggleOpinion = (opinionKey, _id) => {
    const opinionPath = `profile.${opinionKey}`;
    const likeIds = Meteor.user().profile.teammateLikes;
    Meteor.users.update(
        { _id: Meteor.user()._id },
        _.includes(likeIds, _id)
            ? {
                  $pull: { [opinionPath]: _id }
              }
            : {
                  $addToSet: { [opinionPath]: _id }
              }
    );
};

// Set demo data via:
// Meteor.users.find().fetch().map((user) => Meteor.users.update({_id: user._id}, {$set: {'profile.tags': ['Technology', 'Art']}}))

const CandidateList = ({ loading, candidates, match, history }) => {
    return !loading ? (
        <div className="Documents">
            <div className="page-header clearfix">
                <h4 className="pull-left">Find teammates</h4>
            </div>
            {candidates.length ? (
                _.sortBy(candidates, 'createdAt').map(
                    ({ _id, profile: { nickname, title, tags } }) => (
                        <div key={_id} className="teamder-card">
                            <div className="icon">
                                <i class="far fa-lightbulb" />
                            </div>
                            <div className="content">
                                <p className="name">
                                    {' '}
                                    {nickname || '[No nickname given]'}{' '}
                                </p>
                                <p className="idea-title">
                                    {' '}
                                    {title || '[No title given]'}
                                </p>
                                <p className="tags">
                                    {' '}
                                    {_.isEmpty(tags)
                                        ? '[No tags given]'
                                        : tags.map(tag => (
                                              <span className="tag">
                                                  {' '}
                                                  {tag}{' '}
                                              </span>
                                          ))}
                                </p>
                            </div>
                            {/* <Link
                                        to={`find-teammates/${_id}`}
                                    >
                                        {' '}
                                        Profile{' '}
                                    </Link> */}

                            {/* <Glyphicon glyph="star" /> */}
                        </div>
                    )
                )
            ) : (
                <Alert bsStyle="warning">
                    You are the first one! I bet other people will join in few
                    minutes.
                </Alert>
            )}
        </div>
    ) : (
        <Loading />
    );
};

CandidateList.propTypes = {
    loading: PropTypes.bool.isRequired,
    candidates: PropTypes.arrayOf(PropTypes.object).isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default withTracker(() => {
    // const subscription = Meteor.subscribe('users.unrated');
    const excludeUsers = _.concat(
        // Meteor.user().profile.teammateLikes || [],
        // Meteor.user().profile.teammateSkips || [],
        Meteor.user()._id
    );

    return {
        loading: false,
        candidates: Meteor.users
            .find({
                _id: { $nin: excludeUsers }
            })
            .fetch()
    };
})(CandidateList);
