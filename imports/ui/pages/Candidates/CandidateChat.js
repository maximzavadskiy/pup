import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import NotFound from '../NotFound/NotFound';
import Blaze from 'meteor/gadicc:blaze-react-component';

const CandidateChat = ({ candidate, history }) => <p> Use slack to chat with people! </p>

export default withTracker(({ match }) => {
  const candidateId = match.params._id;
  return {
    loading: false,
    candidate: Meteor.users.findOne(candidateId),
  };
})(CandidateChat);
