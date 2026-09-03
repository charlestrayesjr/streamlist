import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

const STORAGE_KEY =
  "eztechmovie-cart"

const TMDB_IMAGE_URL =
  "https://image.tmdb.org/t/p/w500"

function Cart() {
  const navigate =
    useNavigate()

  const [cart, setCart] =
    useState(() => {
      try {
        const savedCart =
          localStorage.getItem(
            STORAGE_KEY
          )

        return savedCart
          ? JSON.parse(
              savedCart
            )
          : []
      } catch {
        return []
      }
    })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cart)
    )
  }, [cart])

  const removeItem = (
    id
  ) => {
    setCart(
      (
        currentCart
      ) =>
        currentCart.filter(
          (movie) =>
            movie.id !== id
        )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const total =
    cart.reduce(
      (
        sum,
        movie
      ) =>
        sum +
        Number(
          movie.price || 0
        ),
      0
    )

  const checkout = () => {
    if (
      cart.length === 0
    ) {
      return
    }

    navigate(
      "/credit-card"
    )
  }

  return (
    <section className="page">
      <div className="hero simple-hero">
        <div>
          <p className="eyebrow">
            EZTechMovie
          </p>

          <h2>
            Shopping Cart
          </h2>

          <p>
            Review your movie
            selections before
            checkout.
          </p>
        </div>
      </div>

      {cart.length ===
      0 ? (
        <div className="empty-state">
          <h3>
            Your cart is
            empty
          </h3>

          <p>
            Search for movies
            and add selections
            to your cart.
          </p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map(
              (movie) => (
                <article
                  className="cart-item"
                  key={
                    movie.id
                  }
                >
                  {movie.poster_path ? (
                    <img
                      src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                    />
                  ) : (
                    <div className="cart-poster-placeholder">
                      No Poster
                    </div>
                  )}

                  <div className="cart-details">
                    <h3>
                      {
                        movie.title
                      }
                    </h3>

                    <p>
                      Release:{" "}
                      {movie.release_date ||
                        "Unknown"}
                    </p>

                    <p className="price">
                      $
                      {Number(
                        movie.price
                      ).toFixed(
                        2
                      )}
                    </p>
                  </div>

                  <button
                    className="danger-button"
                    onClick={() =>
                      removeItem(
                        movie.id
                      )
                    }
                  >
                    Remove
                  </button>
                </article>
              )
            )}
          </div>

          <div className="cart-summary">
            <div>
              <p>
                Items:{" "}
                {cart.length}
              </p>

              <h3>
                Total: $
                {total.toFixed(
                  2
                )}
              </h3>
            </div>

            <div className="cart-actions">
              <button
                className="secondary-button"
                onClick={
                  clearCart
                }
              >
                Clear Cart
              </button>

              <button
                className="primary-button checkout-button"
                onClick={
                  checkout
                }
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default Cart