import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { Notes } from "./notes";

Meteor.methods({
  "notes.upsert": async function (content) {
    // Validate the input
    check(content, String);

    // Ensure this method is only called on the server
    if (!this.isSimulation) {
      const existingNote = await Notes.findOneAsync();

      if (existingNote) {
        await Notes.updateAsync(existingNote._id, {
          $set: {
            content: content,
            createdAt: new Date(),
          },
        });
      } else {
        await Notes.insertAsync({
          content: content,
          createdAt: new Date(),
        });
      }
    }
  },
});
