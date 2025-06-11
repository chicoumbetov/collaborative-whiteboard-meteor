import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useState } from "react";
import { Notes } from "/imports/api/notes";

export const App = () => {
  const { currentNote } = useTracker(() => {
    const noteSubscription = Meteor.subscribe("notes");

    if (!noteSubscription.ready()) {
      return { currentNote: null };
    }

    const note = Notes.findOne({});
    return {
      currentNote: note,
    };
  }, []);

  const [inputText, setInputText] = useState(
    currentNote ? currentNote.content : ""
  );

  useEffect(() => {
    if (currentNote) {
      setInputText(currentNote.content);
    }
  }, [currentNote]);

  const handleInputChange = (event) => {
    const newContent = event.target.value;
    setInputText(newContent);

    Meteor.call("notes.upsert", newContent, (error) => {
      if (error) {
        console.error("Error updating note:", error.reason);
      } else {
        // console.log('Note updated successfully!'); // For debugging
      }
    });
  };

  return (
    <div className="whiteboard-container">
      <h2>Collaborative Whiteboard</h2>
      <textarea
        id="note-input"
        rows="10"
        cols="50"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type here..."
      ></textarea>
      <div id="notes-display">
        <p>
          Current shared content (from database, reflected in textarea): <br />
          <strong>{currentNote ? currentNote.content : "Loading..."}</strong>
        </p>
      </div>
    </div>
  );
};
