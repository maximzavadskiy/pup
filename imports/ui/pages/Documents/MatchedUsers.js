import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
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

const MatchedUsers = ({
  loading, matchedUsers, match, history,
}) => (!loading ? (
  <div className="Documents">
    <div className="page-header clearfix">
      <h4 className="pull-left">Your Matches</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Your Matches</Link>
    </div>
    {matchedUsers.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {matchedUsers.map(({
            _id, title, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{title}</td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => addOpinion('teammateLikes', _id)}
                  block
                >
                  Yay!
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => addOpinion('teammateSkips', _id)}
                  block
                >
                  Not now
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <Alert bsStyle="warning">
        You are the first one! I bet other people will join in few minutes.
      </Alert>}
  </div>
) : <Loading />);

MatchedUsers.propTypes = {
  loading: PropTypes.bool.isRequired,
  matchedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  // If current user and another one liked each other, its a match!
  const likeEachOtherUsers = Meteor.users.find({
    _id: { $in: Meteor.user().profile.teammateLikes || [] },
    'profile.teammateLikes': Meteor.user()._id,
  }).fetch();

  return {
    loading: false,
    matchedUsers: likeEachOtherUsers,
  };
})(MatchedUsers);
