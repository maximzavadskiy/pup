import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import NotFound from '../NotFound/NotFound';

const CandidateChat = ({ candidate, history }) => (candidate ? (
  <div className="CandidateChat">
    <p> Chat rendered </p>
    <h4 className="page-header">{
      `Messaging to "${candidate.profile.name.first} ${candidate.profile.name.last}"`
    }</h4>
  </div>
) : <NotFound />);

CandidateChat.defaultProps = {
  candidate: null,
};

CandidateChat.propTypes = {
  candidate: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const candidateId = match.params._id;
  return {
    loading: false,
    candidate: Meteor.users.findOne(candidateId),
  };
})(CandidateChat);
