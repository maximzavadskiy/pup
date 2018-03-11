import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import NotFound from '../NotFound/NotFound';
import Blaze from 'meteor/gadicc:blaze-react-component';

const CandidateChat = ({ candidate, history }) => {
  const commonChatId = [Meteor.user()._id, candidate._id].sort().join('_and_');
  const getUserName =  (user) => `${user.profile.name.first} ${user.profile.name.last}`;
  return candidate ? (
    <div className="CandidateChat">
      <h4 className="page-header">{
        `Messaging to "${getUserName(candidate)}"`
      }</h4>
      <Blaze template="SimpleChatWindow" roomId={commonChatId} username={getUserName(Meteor.user())} showJoined={true} />
    </div>
  ) : <NotFound />;

}

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
