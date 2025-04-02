# Share Report

This project allows users to share a session report using the Web Share API. If the browser does not support sharing, it provides a fallback mechanism to copy the report text to the clipboard.

## Features
- 📤 **Share via Web Share API** (on supported browsers)
- 📋 **Fallback to clipboard copy** (if sharing fails or is unsupported)
- ⏳ **Temporary success messages** on button click

## Technologies Used
- HTML
- CSS
- JavaScript (Web Share API, Clipboard API)

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/your-username/share-report.git
   ```
2. Navigate to the project folder:
   ```sh
   cd share-report
   ```
3. Open `index.html` in a browser to test the functionality.

## Usage

1. Enter your session report in the input field.
2. Click the **Share** button:
   - If supported, the browser’s native share dialog will appear.
   - If unsupported, the report text will be copied to the clipboard.
3. A success message will be displayed on the button temporarily.

## Code Explanation

- The `shareReport()` function checks if `navigator.share` is available:
  - If yes, it triggers the **Web Share API**.
  - If no, it calls `fallbackShare()` to copy the text.
- `fallbackShare()` creates a temporary `textarea`, copies the text, and removes it.
- The share button updates its text temporarily to indicate success.

## Contribution
Feel free to fork this repo and submit a pull request with improvements!


