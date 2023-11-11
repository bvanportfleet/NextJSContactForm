import React, { useState, useEffect } from "react";
import { validateEmail } from "../utils/validateEmail"; // Importing the email validation utility

export default function Contact() {
  // State for storing form input values
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  // State to indicate whether the form is in the process of submitting
  const [isLoading, setIsLoading] = useState(false);

  // State to store the message after form submission
  const [submitMessage, setSubmitMessage] = useState("");

  // State to control the visibility of the submission message
  const [showSubmitMessage, setShowSubmitMessage] = useState(false);

  // State to track the status of the submission (success or error)
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // State to store any email validation error
  const [emailError, setEmailError] = useState("");

  // auto-hide functionality of the submission message
  useEffect(() => {
    let timer;
    if (showSubmitMessage) {
      // Set a timer to hide the message after 5 seconds
      timer = setTimeout(() => {
        setShowSubmitMessage(false);
      }, 5000);
    }
    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [showSubmitMessage]);

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the form values state
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Validate email and set/clear error message
    if (name === "email") {
      setEmailError(
        validateEmail(value) ? "" : "Please enter a valid email address."
      );
    }
  };

  // Check if all form fields have been filled
  const allFieldsFilled = Object.values(values).every(
    (value) => value.trim() !== ""
  );

  // Handler for form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage("");
    setSubmissionStatus(null);

    // Check for email error before submitting
    if (emailError) {
      setIsLoading(false);
      setShowSubmitMessage(true);
      return;
    }
    // Make an API call to submit the form data
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Handle non-OK responses from the API
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Process the successful response and reset form values
      const result = await response.json();
      setSubmitMessage(`Success: ${result.message}`);
      setSubmissionStatus("success");
      setValues({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error) {
      // Handle any errors during form submission
      setSubmitMessage(`An error occurred: ${error.toString()}`);
      setSubmissionStatus("error");
    } finally {
      // Reset loading state and show the submit message
      setIsLoading(false);
      setShowSubmitMessage(true);
    }
  };

  return (
    // Main container for the form with inline styling
    <div style={{ maxWidth: "650px", marginTop: "3rem", margin: "auto" }}>
      {/* Container for displaying submission status messages */}
      <div
        className={`submit-message ${submissionStatus} ${
          showSubmitMessage ? "submit-message-show" : "submit-message-hide"
        }`}
      >
        {submitMessage} {/* Message displayed upon form submission */}
      </div>

      {/* Title for the contact form */}
      <h1>Contact Us Form</h1>

      {/* The form element with an onSubmit event handler */}
      <form onSubmit={onSubmit}>
        {/* Form field for 'First Name' */}
        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Form field for 'Last Name' */}
        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Form field for 'Email' with dynamic error message display */}
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
          />
          {emailError && <div className="error-message">{emailError}</div>}{" "}
          {/* Error message displayed if email validation fails */}
        </div>

        {/* Form field for 'Message' */}
        <div className="form-field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={values.message}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button, disabled during form submission or if fields are not filled */}
        <button
          type="submit"
          disabled={isLoading || !allFieldsFilled}
          className="submit-button"
        >
          {isLoading ? "SENDING..." : "SUBMIT"}
        </button>
      </form>
    </div>
  );
}
