import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import _ from 'lodash';
// import UsersCollection from '../../../api/Documents/Documents';

import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './Documents.scss';

const handleRemove = (documentId, ) => {
  // if (confirm('Are you sure? This is permanent!')) {
  //   Meteor.call('documents.remove', documentId, (error) => {
  //     if (error) {
  //       Bert.alert(error.reason, 'danger');
  //     } else {
  //       Bert.alert('Document deleted!', 'success');
  //     }
  //   });
  // }
};

const addOpinion = (opinionKey, _id) => {
  const opinionPath = `profile.${opinionKey}`;
  Meteor.users.update({ _id: Meteor.user()._id }, {
    $addToSet: { [opinionPath]: _id },
  });
};

const Documents = ({
  loading, unratedUsers, match, history,
}) => (!loading ? (
  <div className="Documents">
    <div className="page-header clearfix">
      <h4 className="pull-left">Find matches</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Your Matches</Link>
    </div>
    {unratedUsers.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {unratedUsers.map(({
            _id, profile, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{`${profile.name.first} ${profile.name.last}`}</td>
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

Documents.propTypes = {
  loading: PropTypes.bool.isRequired,
  unratedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  // const subscription = Meteor.subscribe('users.unrated');
  const excludeUsers = _.concat(Meteor.user().profile.teammateLikes || [],
                                Meteor.user().profile.teammateSkips || [],
                                Meteor.user()._id);

  return {
    loading: false,
    unratedUsers: Meteor.users.find({
      _id: { $nin: excludeUsers },
    }).fetch(),
  };
})(Documents);
