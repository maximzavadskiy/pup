import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
} from "react-bootstrap";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Bert } from "meteor/themeteorchef:bert";
import _ from "lodash";
// import UsersCollection from '../../../api/Documents/Documents';

import { timeago, monthDayYear } from "../../../modules/dates";
import Loading from "../../components/Loading/Loading";

import "./Documents.scss";

const addOpinion = (opinionKey, _id) => {
  const opinionPath = `profile.${opinionKey}`;
  Meteor.users.update(
    { _id: Meteor.user()._id },
    {
      $addToSet: { [opinionPath]: _id }
    }
  );
};

const CandidateProfile = ({ user: { _id, profile, createdAt, updatedAt } }) => (
  <div className="Documents">
    <div className="page-header clearfix">
      <h4 className="pull-left">Find teammates</h4>
    </div>
    <Grid>
      <Row key={_id}>
        <Col xs={12}>
          <Panel
            header={<a> {`${profile.name.first} ${profile.name.last}`} </a>}
            footer={
              <div>
                <Button
                  bsStyle="primary"
                  onClick={() => addOpinion("teammateLikes", _id)}
                >
                  <Glyphicon glyph="star" />
                  Star
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      profile.privateChatUrl || "http://url_not_set.com",
                      "_blank"
                    )
                  }
                >
                  <Glyphicon glyph="envelope" />
                  Private Chat
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      "https://slack.com/app_redirect?channel=C9SLLBANA&team=T9SS6CSMV",
                      "_blank"
                    )
                  }
                >
                  <Glyphicon glyph="globe" />
                  Guestbook Chat (Dummy link)
                </Button>
              </div>
            }
          >
            <p> Location: TODO </p>
            <p> Desired/own idea title: TODO </p>
            <p> Description: TODO </p>
            <p> Member since: {monthDayYear(createdAt)} </p>
          </Panel>
        </Col>
      </Row>
    </Grid>
  </div>
);

CandidateProfile.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired
};

export default withTracker(({ match }) => {
  // const subscription = Meteor.subscribe('users.unrated');

  return {
    user: Meteor.users
      .find({
        _id: match.params._id
      })
      .fetch()
  };
})(CandidateProfile);
