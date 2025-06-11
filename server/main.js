import { Meteor } from "meteor/meteor";
import { Notes } from "/imports/api/notes";
import "/imports/api/notes.methods";

Meteor.startup(() => {
  Meteor.publish("notes", function () {
    return Notes.find({});
  });
});
