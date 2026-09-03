import {
  useState,
} from "react";

function getSavedCard() {
  try {
    const saved =
      localStorage.getItem(
        "streamlistCreditCard"
      );

    return saved
      ? JSON.parse(saved)
      : null;
  } catch {
    return null;
  }
}

function formatCardNumber(
  value
) {
  const digits = value
    .replace(/\D/g, "")
    .slice(0, 16);

  return (
    digits.match(/.{1,4}/g)
      ?.join(" ") || ""
  );
}

function formatExpiration(
  value
) {
  const digits = value
    .replace(/\D/g, "")
    .slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(
    0,
    2
  )}/${digits.slice(2)}`;
}

function CreditCard() {
  const [
    cardholderName,
    setCardholderName,
  ] = useState("");

  const [
    cardNumber,
    setCardNumber,
  ] = useState("");

  const [
    expiration,
    setExpiration,
  ] = useState("");

  const [cvv, setCvv] =
    useState("");

  const [
    savedCard,
    setSavedCard,
  ] = useState(getSavedCard);

  const [
    message,
    setMessage,
  ] = useState("");

  const handleCardNumber = (
    event
  ) => {
    setCardNumber(
      formatCardNumber(
        event.target.value
      )
    );
  };

  const handleExpiration = (
    event
  ) => {
    setExpiration(
      formatExpiration(
        event.target.value
      )
    );
  };

  const handleCvv = (
    event
  ) => {
    const digits =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 4);

    setCvv(digits);
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    const cardDigits =
      cardNumber.replace(
        /\s/g,
        ""
      );

    if (
      !cardholderName.trim()
    ) {
      setMessage(
        "Enter the cardholder name."
      );

      return;
    }

    if (
      cardDigits.length !== 16
    ) {
      setMessage(
        "The card number must contain 16 digits."
      );

      return;
    }

    if (
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
        expiration
      )
    ) {
      setMessage(
        "Enter the expiration date as MM/YY."
      );

      return;
    }

    if (
      !/^\d{3,4}$/.test(cvv)
    ) {
      setMessage(
        "Enter a valid 3 or 4 digit security code."
      );

      return;
    }

    const cardData = {
      cardholderName:
        cardholderName.trim(),
      cardNumber,
      expiration,
    };

    localStorage.setItem(
      "streamlistCreditCard",
      JSON.stringify(
        cardData
      )
    );

    setSavedCard(cardData);

    setCvv("");

    setMessage(
      "Card information saved successfully."
    );
  };

  const clearSavedCard = () => {
    localStorage.removeItem(
      "streamlistCreditCard"
    );

    setSavedCard(null);

    setCardholderName("");
    setCardNumber("");
    setExpiration("");
    setCvv("");

    setMessage(
      "Saved card information removed."
    );
  };

  const lastFour =
    savedCard?.cardNumber
      ?.replace(/\s/g, "")
      .slice(-4);

  return (
    <main className="page">
      <section className="payment-page">
        <p className="eyebrow">
          SECURE CHECKOUT
        </p>

        <h2>
          Credit Card
        </h2>

        <p className="intro">
          Enter payment information
          to complete the checkout
          demonstration.
        </p>

        <form
          className="payment-form"
          onSubmit={
            handleSubmit
          }
        >
          <div className="form-field">
            <label
              htmlFor="cardholder"
            >
              Cardholder Name
            </label>

            <input
              id="cardholder"
              type="text"
              value={
                cardholderName
              }
              onChange={(
                event
              ) =>
                setCardholderName(
                  event.target
                    .value
                )
              }
              autoComplete="cc-name"
              placeholder="Charles Trayes"
            />
          </div>

          <div className="form-field">
            <label
              htmlFor="card-number"
            >
              Card Number
            </label>

            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              value={
                cardNumber
              }
              onChange={
                handleCardNumber
              }
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>

          <div className="payment-row">
            <div className="form-field">
              <label
                htmlFor="expiration"
              >
                Expiration
              </label>

              <input
                id="expiration"
                type="text"
                inputMode="numeric"
                value={
                  expiration
                }
                onChange={
                  handleExpiration
                }
                autoComplete="cc-exp"
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>

            <div className="form-field">
              <label
                htmlFor="cvv"
              >
                CVV
              </label>

              <input
                id="cvv"
                type="password"
                inputMode="numeric"
                value={cvv}
                onChange={
                  handleCvv
                }
                autoComplete="cc-csc"
                placeholder="123"
                maxLength="4"
              />
            </div>
          </div>

          <button
            className="save-card-button"
            type="submit"
          >
            Save Card
          </button>
        </form>

        {message && (
          <p
            className="status-message"
            role="status"
          >
            {message}
          </p>
        )}

        {savedCard && (
          <div className="saved-card">
            <p className="eyebrow">
              SAVED PAYMENT METHOD
            </p>

            <h3>
              {
                savedCard.cardholderName
              }
            </h3>

            <p>
              Card ending in{" "}
              <strong>
                {lastFour}
              </strong>
            </p>

            <p>
              Expires{" "}
              {
                savedCard.expiration
              }
            </p>

            <button
              type="button"
              className="clear-button"
              onClick={
                clearSavedCard
              }
            >
              Remove Saved Card
            </button>
          </div>
        )}

        <p className="security-note">
          Class demonstration only.
          Do not enter real payment
          information.
        </p>
      </section>
    </main>
  );
}

export default CreditCard;