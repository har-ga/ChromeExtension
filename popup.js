document.addEventListener('DOMContentLoaded', function () {
  const noteInput = document.getElementById('noteInput');
  const addNoteButton = document.getElementById('addNoteButton');
  const noteList = document.getElementById('noteList');

  // Load saved notes
  chrome.storage.sync.get(['notes'], function (result) {
    const savedNotes = result.notes || [];
    updateNoteList(savedNotes);
  });

  // Add note to storage
  addNoteButton.addEventListener('click', function () {
    const newNote = noteInput.value;
    if (newNote) {
      chrome.storage.sync.get(['notes'], function (result) {
        const savedNotes = result.notes || [];
        const updatedNotes = [...savedNotes, newNote]; // Use spread operator to copy notes
        chrome.storage.sync.set({ 'notes': updatedNotes }, function () {
          updateNoteList(updatedNotes);
          noteInput.value = '';
        });
      });
    }
  });

  // Delete note from storage
  noteList.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-button')) {
      const noteIndex = event.target.getAttribute('data-index');
      chrome.storage.sync.get(['notes'], function (result) {
        const savedNotes = result.notes || [];
        const updatedNotes = savedNotes.filter((note, index) => index != noteIndex);
        chrome.storage.sync.set({ 'notes': updatedNotes }, function () {
          updateNoteList(updatedNotes);
        });
      });
    }
  });

  // Update note list
  function updateNoteList(notes) {
    noteList.innerHTML = '';
    notes.forEach(function (note, index) {
      const noteDiv = document.createElement('div');
      noteDiv.className = 'note';
      noteDiv.innerHTML = `
        <span>${note}</span>
        <button class="delete-button" data-index="${index}">Delete</button>
      `;
      noteList.appendChild(noteDiv);
    });
  }
});
