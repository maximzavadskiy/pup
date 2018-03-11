import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button, Grid, Row, Col, Panel, Glyphicon } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import _ from 'lodash';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './Documents.scss';

const addOpinion = (opinionKey, _id) => {
  const opinionPath = `profile.${opinionKey}`;
  Meteor.users.update({ _id: Meteor.user()._id }, {
    $addToSet: { [opinionPath]: _id },
  });
};

const EngagedCandidatesList = ({
  loading, matchedUsers, match, history,
}) => (!loading ? (
  <div className="Documents">
    <div className="page-header clearfix">
      <h4 className="pull-left">People</h4>
    </div>
      <Grid>
          {matchedUsers.length ? matchedUsers.map(({
                        _id, profile, createdAt, updatedAt,
                    }) => (
                        <Row key={_id}>
                            <Col xs={12}>

                                  <Panel
                                    header={<a> {`${profile.name.first} ${profile.name.last}`} </a>}
                                    footer={
                                        <div>
                                            <Button
                                                onClick={() => history.push(`chat/${_id}`)}
                                            >
                                                <Glyphicon glyph="envelope" />
                                            </Button>
                                        </div>
                                    }
                                  >
                                    { (profile.teammateChats && profile.teammateChats.indexOf(Meteor.user()._id) !== -1) ?
                                      <p> You & the user initiated Chat with each other! </p> :
                                      <p> One of you have starred another - drop a message and see what you can do together! </p>
                                    }

                                  </Panel>

                            </Col>
                        </Row>
                    ))
          : <Alert bsStyle="warning">
          Here will be displayed all people whom you contacted, or who has contacted you.
      </Alert>}
      </Grid>
  </div>
) : <Loading />);

EngagedCandidatesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  matchedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  // If current user and another one liked each other, its a match!
  const engagedUsers = Meteor.users.find({
    $or: [
      { _id: { $in: Meteor.user().profile.teammateLikes || [] } },
      { 'profile.teammateLikes': Meteor.user()._id },
      { 'profile.teammateChats': Meteor.user()._id }
    ]
  }).fetch();

  return {
    loading: false,
    matchedUsers: engagedUsers,
  };
})(EngagedCandidatesList);
