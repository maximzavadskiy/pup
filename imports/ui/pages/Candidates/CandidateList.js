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

const addOpinion = (opinionKey, _id) => {
    const opinionPath = `profile.${opinionKey}`;
    Meteor.users.update(
        { _id: Meteor.user()._id },
        {
            $addToSet: { [opinionPath]: _id }
        }
    );
};

const CandidateList = ({ loading, unratedUsers, match, history }) =>
    !loading ? (
        <div className="Documents">
            <div className="page-header clearfix">
                <h4 className="pull-left">Find teammates</h4>
            </div>
            <Grid>
                {unratedUsers.length ? (
                    unratedUsers.map(
                        ({
                            _id,
                            profile: {
                                nickname,
                                privateChatUrl,
                                country,
                                school,
                                goal
                            },
                            createdAt,
                            updatedAt
                        }) => (
                            <Row key={_id}>
                                <Col xs={12}>
                                    <Panel
                                        header={
                                            <a>
                                                {nickname ||
                                                    'No nickname given'}
                                            </a>
                                        }
                                        footer={
                                            <div>
                                                <Link
                                                    to={`find-teammates/${_id}`}
                                                >
                                                    {' '}
                                                    Profile{' '}
                                                </Link>
                                                <Button
                                                    bsStyle="primary"
                                                    onClick={() =>
                                                        addOpinion(
                                                            'teammateLikes',
                                                            _id
                                                        )
                                                    }
                                                >
                                                    <Glyphicon glyph="star" />
                                                    Star
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        window.open(
                                                            privateChatUrl ||
                                                                'http://url_not_set.com',
                                                            '_blank'
                                                        )
                                                    }
                                                >
                                                    <Glyphicon glyph="envelope" />
                                                    Private Chat
                                                </Button>
                                            </div>
                                        }
                                    >
                                        <p> Country: {country} </p>
                                        <p> School: {school} </p>
                                        <p> Goal: {goal} </p>
                                    </Panel>
                                </Col>
                            </Row>
                        )
                    )
                ) : (
                    <Alert bsStyle="warning">
                        You are the first one! I bet other people will join in
                        few minutes.
                    </Alert>
                )}
            </Grid>
        </div>
    ) : (
        <Loading />
    );

CandidateList.propTypes = {
    loading: PropTypes.bool.isRequired,
    unratedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default withTracker(() => {
    // const subscription = Meteor.subscribe('users.unrated');
    const excludeUsers = _.concat(
        Meteor.user().profile.teammateLikes || [],
        Meteor.user().profile.teammateSkips || [],
        Meteor.user()._id
    );

    return {
        loading: false,
        unratedUsers: Meteor.users
            .find({
                _id: { $nin: excludeUsers }
            })
            .fetch()
    };
})(CandidateList);
