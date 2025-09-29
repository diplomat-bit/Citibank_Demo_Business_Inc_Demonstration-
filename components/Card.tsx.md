# The Building Block
*A Guide to Our Core Component*

---

## Abstract

This document explains the `Card.tsx` component as the fundamental, atomic "Building Block" of our application's interface. It is not just a UI container, but a simple, reusable canvas upon which a single, discrete piece of information can be displayed. We model its properties (`variant`, `isLoading`, `errorState`) as different modes of display, defining the visual relationship between the user and the information contained within the block.

---

## Chapter 1. The Nature of the Block

### 1.1 `CardVariant` as Visual Style

The `variant` property defines the block's visual style and how it relates to the surrounding interface.
-   **`default`**: The standard display mode, a clear and distinct block.
-   **`outline`**: A block that emphasizes its boundary, useful for highlighting specific information.
-   **`ghost`**: A frameless block, where the information appears to merge seamlessly with the background.
-   **`interactive`**: A block that reacts to the user's attention (hover), signaling that it can be clicked or interacted with.

### 1.2 `isLoading` as Information on the Way

The `isLoading` state represents a block whose information is still being loaded. It is a "placeholder truth," a temporary state before the final information arrives. The `LoadingSkeleton` is the visual representation of this loading state, showing the user that something is happening.

### 1.3 `errorState` as Information Unavailable

The `errorState` represents a block where the information could not be loaded. The connection to this particular piece of data has been severed. The `ErrorDisplay` is the formal acknowledgment of this issue, letting the user know something went wrong.

---

## Chapter 2. The Structure of the Block

### 2.1 The Header: Title and Actions

The `CardHeader` contains the `title`, which is the name of the information being displayed. The `headerActions` are the tools (like buttons or menus) provided to the user to interact with the information.

### 2.2 The Body: The Information Itself

The `children` prop represents the information itself, the content that the block makes visible.

### 2.3 `isCollapsible` as a View Toggle

The `isCollapsible` property provides a toggle that the user can use to show or hide the block's content. When collapsed, the information is not gone, but simply hidden from view, acknowledged by its title but not directly perceived. It is an act of managing visual space and focus.

---

## Chapter 3. Conclusion

The `Card` is the fundamental building block of our user interface. Every complex view is constructed from these atomic blocks. By understanding the `Card`'s purpose, we understand the application's core design philosophy: reality is a collection of discrete, understandable pieces of information, each presented clearly for the user's contemplation and use.

> "You cannot understand everything all at once. You look at one piece of information at a time. Wisdom is in knowing which piece to look at next."