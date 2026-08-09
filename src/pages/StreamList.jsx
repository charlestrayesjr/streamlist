import { useState } from "react";

function StreamList() {
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (userInput.trim() === "") {
      setMessage("Please enter a movie or show.");
      return;
    }

    console.log("StreamList user input:", userInput);

    setMessage(`"${userInput}" was sent to the console.`);
    setUserInput("");
  };

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">MY STREAMING LIST</p>

        <h2>Keep track of what you want to watch.</h2>

        <p className="intro">
          Enter a movie or show below.
        </p>

        <form className="stream-form" onSubmit={handleSubmit}>
          <label htmlFor="stream-input">
            Movie or show title
          </label>

          <div className="input-group">
            <input
              id="stream-input"
              type="text"
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              placeholder="Enter a movie or show"
            />

            <button type="submit">
              Add to StreamList
            </button>
          </div>
        </form>

        {message && (
          <p className="status-message">{message}</p>
        )}
      </section>
    </main>
  );
}

export default StreamList;