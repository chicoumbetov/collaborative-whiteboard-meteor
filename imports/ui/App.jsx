import { useTracker } from "meteor/react-meteor-data"; // For reactive data
import React, { useEffect, useState } from "react";
import { Notes } from "/imports/api/notes";

export const App = () => {
  const { currentNote } = useTracker(() => {
    const noteSubscription = Meteor.subscribe("notes");

    if (!noteSubscription.ready()) {
      return { currentNote: null }; // Or a loading state
    }

    // In a real app, you'd find a specific note (e.g., by room ID).
    const note = Notes.findOne({}); // Get the first (and only) note

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

    // for simplicity and to showcase reactivity.
    if (currentNote) {
      Notes.update(currentNote._id, {
        $set: {
          content: newContent,
          createdAt: new Date(),
        },
      });
    } else {
      Notes.insert({
        content: newContent,
        createdAt: new Date(),
      });
    }
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
        {/* We are displaying the content in the textarea directly for a 'single shared note' */}
        {/* You could optionally render it here too, but the textarea acts as the display */}
        {/* For a true whiteboard, you might have separate paragraphs or drawing elements */}
        <p>
          Current shared content (from database, reflected in textarea): <br />
          <strong>{currentNote ? currentNote.content : "Loading..."}</strong>
        </p>
      </div>
    </div>
  );
};
