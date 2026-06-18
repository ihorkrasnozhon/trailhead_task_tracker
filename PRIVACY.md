# Privacy Policy for Trailhead Task Tracker

**Effective Date:** June 18, 2026

This Privacy Policy describes how the "Trailhead Task Tracker" browser extension handles user data. The extension is designed with a strict "privacy-by-design" approach to ensure complete data security and isolation.

## 1. Data Collection and Transmission
* **No Personal Data Collection:** The extension does not collect, store, or transmit any personally identifiable information (PII), such as names, emails, passwords, or browsing history.
* **No Remote Transmission:** The extension operates entirely offline within your browser. It does not connect to any external servers, database trackers, or third-party analytics services.

## 2. Data Processing and Local Storage
* **User Actions & Content:** The extension processes user clicks locally on the webpage to toggle the visual state (line-through styling) of instructional steps on the `https://trailhead.salesforce.com/*` domain.
* **Chrome Storage API:** The extension utilizes `chrome.storage.local` strictly to cache the indexes of completed tasks for the active session. This protects the user's progress from accidental page refreshes.
* **Data Expiration:** All cached data is stored locally on the user's hard drive and is automatically deleted after 15 minutes of inactivity or when the checkboxes are manually cleared.

## 3. Third-Party Disclosures
We do not sell, trade, or otherwise transfer any user data to outside parties, as no data is ever collected or transmitted.

## 4. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. Any changes will be posted on this page.

## 5. Developer & Contact Information
This extension was developed by Igor Krasnozhon as an open-source productivity tool for Salesforce learners.

* **Developer:** Ihor Krasnozhon
* **Project Repository:** https://github.com/ihorkrasnozhon/trailhead_task_tracker
* **Support & Inquiries:** For any questions, bug reports, or feedback regarding the Trailhead Task Tracker, please open an issue in the project's official GitHub repository.
