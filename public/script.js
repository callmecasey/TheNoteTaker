let noteTitle = document.querySelector(".note-title");
let noteText = document.querySelector(".note-textarea");
let saveNoteBtn = document.querySelector(".save-note");
let newNoteBtn = document.querySelector(".new-note");
let noteList = document.querySelector(".list-container");

// Show an element
const show = (elem) => {
  elem.classList.remove("hidden");
};

// Hide an element
const hide = (elem) => {
  elem.classList.add("hidden");
};

// Get all notes from the database
const getNotes = async () => {
  console.log("Fetching notes...");
  const response = await fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch notes:", response.statusText);
  }
  return response.json();
};

// Save a new note to the database
const saveNote = async (note) => {
  console.log("Saving new note:", note);
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    console.error("Failed to save note:", response.statusText);
  }
  return response.json();
};

// Render the list of note titles
const renderNoteList = (notes) => {
  console.log("Rendering notes:", notes);
  noteList.innerHTML = ""; // Clear the list
  notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note.title;
    noteList.appendChild(li);
  });
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getNotes().then(renderNoteList);
    noteTitle.value = "";
    noteText.value = "";
    hide(saveNoteBtn);
  });
};

newNoteBtn.addEventListener("click", () => {
  show(saveNoteBtn);
});

saveNoteBtn.addEventListener("click", handleNoteSave);

// Initial load of notes
getNotes().then(renderNoteList);
