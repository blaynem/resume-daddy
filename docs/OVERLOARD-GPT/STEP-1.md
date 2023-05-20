That's a great approach. Let's break down the MVP phase into more specific development tasks:

**Task 1: Parse Resume**

- **1.1**: Research and choose the most suitable libraries for parsing resumes. For instance, you could consider libraries like `pdf.js` or `pdf2json` for PDF parsing, `mammoth.js` for Word documents, etc.
- **1.2**: Implement the basic functionality for uploading a resume and extracting the text.
- **1.3**: Design an algorithm or use machine learning/NLP libraries to identify and extract the key sections and information from the resume (such as name, contact info, education, skills, experience).
- **1.4**: Test the parsing functionality with various resume formats and handle edge cases.

**Task 2: Resume Builder**

- **2.1**: Design the UI/UX for the resume builder. It should be intuitive and easy to use.
- **2.2**: Implement the front-end form fields for various resume sections (contact info, education, skills, experience, etc.)
- **2.3**: Develop the back-end to handle form submissions and generate the resume. Depending on the output format you want, you might need libraries for PDF generation like `pdfmake`.
- **2.4**: Implement the ability to save and load resume drafts.
- **2.5**: Test the resume builder with different inputs and ensure the generated resumes are correctly formatted and professional-looking.

**Task 3: Easy creation of cover letters**

- **3.1**: Design a simple and user-friendly UI for creating cover letters.
- **3.2**: Develop the front-end form fields for cover letter inputs.
- **3.3**: Develop the back-end to handle form submissions and generate the cover letters. Again, you might need libraries for PDF generation.
- **3.4**: Test the cover letter builder and ensure the generated letters meet the expectations of potential employers.

**Task 4: Keeps track of what you've applied to**

- **4.1**: Design a database schema to keep track of the job applications. This should include fields for company name, role, date of application, application status, etc.
- **4.2**: Develop the front-end to display the tracked applications and allow the user to add, edit, and delete entries.
- **4.3**: Implement the back-end to handle these CRUD operations and interact with the database. You might want to use a database ORM like TypeORM for this.
- **4.4**: Test the tracking feature and ensure that it works reliably.

**Task 5: User Authentication**

- **5.1**: Implement user authentication using an authentication library like Passport.js. This will likely include a sign-up, login, and password reset functionality.
- **5.2**: Test the authentication flow and ensure it's secure and user-friendly.

After completing these tasks, you should have a working MVP for your application. This will provide a solid foundation upon which to build additional features in the later stages.
