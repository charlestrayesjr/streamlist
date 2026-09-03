import {
  Link,
} from "react-router";

function Cart() {
  return (
    <main className="page">
      <section className="placeholder-page">
        <p className="eyebrow">
          STREAMLIST
        </p>

        <h2>
          Shopping Cart
        </h2>

        <p className="intro">
          Review your StreamList
          selections and continue to
          checkout when you are ready.
        </p>

        <div className="cart-summary">
          <h3>
            EZTechMovie Checkout
          </h3>

          <p>
            Your selected streaming
            content is ready for
            checkout.
          </p>

          <Link
            className="checkout-button"
            to="/payment"
          >
            Proceed to Checkout
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Cart;