import {
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

const CARD_KEY =
  "eztechmovie-credit-card"

function formatCardNumber(
  value
) {
  const numbers =
    value
      .replace(/\D/g, "")
      .slice(0, 16)

  return (
    numbers
      .match(/.{1,4}/g)
      ?.join(" ") || ""
  )
}

function formatExpiration(
  value
) {
  const numbers =
    value
      .replace(/\D/g, "")
      .slice(0, 4)

  if (
    numbers.length <= 2
  ) {
    return numbers
  }

  return `${numbers.slice(
    0,
    2
  )}/${numbers.slice(2)}`
}

function CreditCard() {
  const navigate =
    useNavigate()

  const [form, setForm] =
    useState({
      cardholderName: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      billingZip: "",
    })

  const [message, setMessage] =
    useState("")

  const [error, setError] =
    useState("")

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target

    let newValue =
      value

    if (
      name === "cardNumber"
    ) {
      newValue =
        formatCardNumber(
          value
        )
    }

    if (
      name ===
      "expirationDate"
    ) {
      newValue =
        formatExpiration(
          value
        )
    }

    if (
      name === "cvv"
    ) {
      newValue =
        value
          .replace(
            /\D/g,
            ""
          )
          .slice(0, 4)
    }

    if (
      name ===
      "billingZip"
    ) {
      newValue =
        value
          .replace(
            /[^0-9A-Za-z -]/g,
            ""
          )
          .slice(0, 10)
    }

    setForm(
      (
        currentForm
      ) => ({
        ...currentForm,
        [name]:
          newValue,
      })
    )
  }

  const validateForm =
    () => {
      if (
        !form.cardholderName
          .trim()
      ) {
        return "Enter the name on the card."
      }

      if (
        !/^\d{4} \d{4} \d{4} \d{4}$/.test(
          form.cardNumber
        )
      ) {
        return "Card number must use the format 1234 5678 9012 3456."
      }

      if (
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
          form.expirationDate
        )
      ) {
        return "Expiration date must use MM/YY."
      }

      if (
        !/^\d{3,4}$/.test(
          form.cvv
        )
      ) {
        return "Enter a valid 3 or 4 digit security code."
      }

      if (
        !form.billingZip
          .trim()
      ) {
        return "Enter the billing ZIP or postal code."
      }

      return ""
    }

  const handleSubmit = (
    event
  ) => {
    event.preventDefault()

    setMessage("")
    setError("")

    const validationError =
      validateForm()

    if (
      validationError
    ) {
      setError(
        validationError
      )

      return
    }

    const cardForCourseDemo = {
      cardholderName:
        form.cardholderName
          .trim(),

      cardNumber:
        form.cardNumber,

      expirationDate:
        form.expirationDate,

      billingZip:
        form.billingZip
          .trim(),

      savedAt:
        new Date()
          .toLocaleString(),
    }

    localStorage.setItem(
      CARD_KEY,
      JSON.stringify(
        cardForCourseDemo
      )
    )

    setMessage(
      "Demo card information was saved to Local Storage. The security code was not stored."
    )

    setForm(
      (
        currentForm
      ) => ({
        ...currentForm,
        cvv: "",
      })
    )
  }

  const removeSavedCard =
    () => {
      localStorage.removeItem(
        CARD_KEY
      )

      setMessage(
        "Saved demo card information was removed."
      )

      setError("")
    }

  return (
    <section className="page">
      <div className="hero simple-hero">
        <div>
          <p className="eyebrow">
            Secure Checkout
          </p>

          <h2>
            Credit Card
            Management
          </h2>

          <p>
            Enter payment
            information to
            complete the
            EZTechMovie checkout
            prototype.
          </p>
        </div>
      </div>

      <div className="security-notice">
        <strong>
          Course Prototype
        </strong>

        <p>
          Do not enter a real
          credit card. Use the
          demonstration format
          1234 5678 9012 3456.
        </p>
      </div>

      <div className="payment-grid">
        <div className="panel">
          <h3>
            Payment
            Information
          </h3>

          <form
            className="stream-form"
            onSubmit={
              handleSubmit
            }
            autoComplete="off"
          >
            <div className="form-group">
              <label
                htmlFor="cardholderName"
              >
                Name on Card
              </label>

              <input
                id="cardholderName"
                name="cardholderName"
                type="text"
                placeholder="Charles Trayes"
                value={
                  form.cardholderName
                }
                onChange={
                  handleChange
                }
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="cardNumber"
              >
                Card Number
              </label>

              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                value={
                  form.cardNumber
                }
                onChange={
                  handleChange
                }
                autoComplete="off"
                required
              />
            </div>

            <div className="payment-row">
              <div className="form-group">
                <label
                  htmlFor="expirationDate"
                >
                  Expiration
                </label>

                <input
                  id="expirationDate"
                  name="expirationDate"
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={
                    form.expirationDate
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  required
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="cvv"
                >
                  CVV
                </label>

                <input
                  id="cvv"
                  name="cvv"
                  type="password"
                  inputMode="numeric"
                  placeholder="123"
                  maxLength="4"
                  value={
                    form.cvv
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor="billingZip"
              >
                Billing ZIP or
                Postal Code
              </label>

              <input
                id="billingZip"
                name="billingZip"
                type="text"
                placeholder="12345"
                value={
                  form.billingZip
                }
                onChange={
                  handleChange
                }
                autoComplete="off"
                required
              />
            </div>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {message && (
              <p className="success-message">
                {message}
              </p>
            )}

            <div className="form-actions">
              <button
                className="primary-button"
                type="submit"
              >
                Save Demo Card
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  navigate(
                    "/cart"
                  )
                }
              >
                Back to Cart
              </button>

              <button
                className="danger-button"
                type="button"
                onClick={
                  removeSavedCard
                }
              >
                Remove Saved
                Card
              </button>
            </div>
          </form>
        </div>

        <div className="payment-preview">
          <p>
            EZTECHMOVIE
          </p>

          <div className="card-chip">
            ▰
          </div>

          <div className="preview-number">
            {form.cardNumber ||
              "1234 5678 9012 3456"}
          </div>

          <div className="preview-bottom">
            <div>
              <span>
                CARDHOLDER
              </span>

              <strong>
                {form.cardholderName ||
                  "YOUR NAME"}
              </strong>
            </div>

            <div>
              <span>
                EXPIRES
              </span>

              <strong>
                {form.expirationDate ||
                  "MM/YY"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreditCard