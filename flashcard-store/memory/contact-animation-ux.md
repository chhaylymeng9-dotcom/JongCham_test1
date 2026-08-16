---
name: contact-animation-ux
description: Apply parallax, scroll-triggered reveals, and motion design to the Contact page.
metadata:
  type: project
---

**Why:** The user requested "scrollytelling" features (parallax, scroll-triggered reveals, microinteractions) across every page, and the `Contact.jsx` page currently lacks these animations compared to `About.jsx` and `Store.jsx`.

**How to apply:**
1.  **Parallax/Reveal Motion:** Wrap the main `Contact` component content in a `motion.div` with initial entrance animations (`opacity: 0, y: 22`).
2.  **Staggered Reveals:** Use `motion.section` or `motion.div` for the form card and the side details card with staggered `initial`, `animate`, and `transition` properties (similar to `About.jsx`'s value props).
3.  **Microinteractions:** Ensure existing UI components (Buttons, etc.) maintain their expected interactive behavior while integrated with motion wrappers.
4.  **Parallax Backgrounds:** Evaluate if a subtle parallax element (like the blob in `About.jsx`) would fit the `Contact.jsx` layout.
5.  **Verification:** Run the application locally and navigate to the Contact page to verify the entrance animations, scroll reveals, and responsiveness.
