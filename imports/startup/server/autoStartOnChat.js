import {SimpleChat} from 'meteor/cesarve:simple-chat/config'
import { Meteor } from 'meteor/meteor';


SimpleChat.configure ({
  onNewMessage : function(message) {
    const engagedUsers = message.roomId.split('_and_');
    console.log(engagedUsers)
    Meteor.users.update({_id: engagedUsers[0]}, {$addToSet: {'profile.teammateChats': engagedUsers[1] }});
    Meteor.users.update({_id: engagedUsers[1]}, {$addToSet: {'profile.teammateChats': engagedUsers[0] }});
  }
})
