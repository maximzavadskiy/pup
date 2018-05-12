import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            email: '',
            chatLink: ''
        };
    }

    componentDidMount() {
        this.setState({
            email: this.props.match.params.email,
            chatLink: decodeURIComponent(
                this.props.match.params.privateChatLink
            )
        });
        const component = this;

        validate(component.form, {
            rules: {
                emailAddress: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
                nickname: { required: true },
                privateChatUrl: { required: true },
                school: { required: true }
            },
            messages: {
                firstName: {
                    required: "What's your first name?"
                },
                lastName: {
                    required: "What's your last name?"
                },
                emailAddress: {
                    required: 'Need an email address here.',
                    email: 'Is this email address correct?'
                },
                password: {
                    required: 'Need a password here.',
                    minlength: 'Please use at least six characters.'
                }
            },
            submitHandler() {
                component.handleSubmit();
            }
        });
    }

    handleSubmit() {
        const { history } = this.props;

        Accounts.createUser(
            {
                email: this.emailAddress.value,
                password: this.password.value,
                profile: {
                    nickname: this.nickname.value, // ++ shows in candidate list
                    name: {
                        first: this.nickname.value,
                        last: this.nickname.value
                    },
                    //type: 'HAS_IDEA', 'SEARCHING_IDEA' , 'MENTOR', 'COMPANY'
                    //++ title: this.title.value, // ++ serves as title
                    //++  tags: ['Technology', 'Art'],
                    school: this.school.value, // ++
                    idea: this.idea.value, // ++ idea in detail
                    //++ currentSkills: this.currentSkills.value
                    //++ desiredSkills: this.desiredSkills.value
                    privateChatUrl: this.state.chatLink
                }
            },
            error => {
                if (error) {
                    Bert.alert(error.reason, 'danger');
                } else {
                    Meteor.call('users.sendVerificationEmail');
                    Bert.alert('Welcome!', 'success');
                    history.push('/find-teammates');
                }
            }
        );
    }

    render() {
        return (
            <div className="Signup">
                <Row>
                    <Col xs={12} sm={6} md={5} lg={4}>
                        <h4 className="page-header">Sign Up</h4>
                        <Row>
                            <Col xs={12}>
                                <OAuthLoginButtons
                                    services={[]}
                                    emailMessage={{
                                        offset: 97,
                                        text: 'Sign Up with an Email Address'
                                    }}
                                />
                            </Col>
                        </Row>
                        <form
                            ref={form => (this.form = form)}
                            onSubmit={event => event.preventDefault()}
                        >
                            <FormGroup>
                                <ControlLabel> Nickname </ControlLabel>
                                <input
                                    type="text"
                                    name="nickname"
                                    ref={nickname => (this.nickname = nickname)}
                                    className="form-control"
                                />
                                <InputHint>
                                    {' '}
                                    No real names = fun team building!{' '}
                                </InputHint>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Email Address</ControlLabel>
                                <input
                                    type="email"
                                    name="emailAddress"
                                    value={this.state.email}
                                    onChange={(event, value) => {
                                        this.setState({ email: value });
                                    }}
                                    ref={emailAddress =>
                                        (this.emailAddress = emailAddress)
                                    }
                                    className="form-control"
                                />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Password</ControlLabel>
                                <input
                                    type="password"
                                    name="password"
                                    ref={password => (this.password = password)}
                                    className="form-control"
                                />
                                <InputHint>
                                    Use at least six characters.
                                </InputHint>
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>School</ControlLabel>
                                <input
                                    type="text"
                                    name="school"
                                    ref={school => (this.school = school)}
                                    className="form-control"
                                />
                                <InputHint>Where you study?</InputHint>
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>Idea</ControlLabel>
                                <input
                                    type="text"
                                    name="idea"
                                    ref={idea => (this.idea = idea)}
                                    className="form-control"
                                />
                                <InputHint>
                                    {' '}
                                    Your own idea / Idea that you would love to
                                    work on.{' '}
                                </InputHint>
                            </FormGroup>

                            <AccountPageFooter>
                                <FormGroup>
                                    <ControlLabel>
                                        {' '}
                                        Your Slack Chat Link{' '}
                                    </ControlLabel>
                                    <input
                                        type="text"
                                        name="chat_link"
                                        disabled
                                        value={this.state.chatLink}
                                        onChange={(event, value) => {
                                            this.setState({ chatLink: value });
                                        }}
                                        className="form-control"
                                    />
                                    <InputHint>
                                        {' '}
                                        Teamify Slack Bot has prifilled that fo
                                        you :){' '}
                                    </InputHint>
                                </FormGroup>
                            </AccountPageFooter>

                            <Button type="submit" bsStyle="success">
                                Sign Up
                            </Button>
                            <AccountPageFooter>
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login">Log In</Link>.
                                </p>
                            </AccountPageFooter>
                        </form>
                    </Col>
                </Row>
            </div>
        );
    }
}

Signup.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default Signup;
