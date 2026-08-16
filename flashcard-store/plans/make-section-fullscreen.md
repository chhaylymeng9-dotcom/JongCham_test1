---
name: make-section-fullscreen
description: Adjust the "What you get" section to be full screen height.
metadata:
  type: project
---

**Context:** The user wants to make the "What you get" section (value props grid) full-screen height, similar to other sections in the app.

**Approach:**
1.  Locate the "What you get" section in `d:\xampp\htdocs\flashcard-store (3)\flashcard-store\src\pages\Store.jsx`.
2.  Review `About.jsx` for the implementation of the full-screen `min-h-screen` section.
3.  Update the section in `Store.jsx` to use `min-h-screen`, `flex`, and `items-center` classes.
4.  Ensure that any padding/margin adjustments are made to maintain vertical centering.
5.  Verification: Run the app and check the Store page to ensure the section now spans the full height of the viewport.
