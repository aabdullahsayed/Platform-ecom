import { useState } from "react";
import { register } from "../api/authService";

export default function Register({ onNavigateToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("0");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: parseInt(role, 10),
      });

      setSuccess(
        response || "Account created successfully."
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("0");
    } catch (err) {
      setError(
        err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

        /* =====================================================
           REGISTER PAGE
           ===================================================== */

        .register-page {
          min-height: 100vh;
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 40px 20px;

          box-sizing: border-box;

          background:
            linear-gradient(
              135deg,
              #f8f8f7 0%,
              #eeeeec 100%
            );

          color: #111;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* =====================================================
           CONTAINER
           ===================================================== */

        .register-container {
          width: 100%;
          max-width: 440px;
        }


        /* =====================================================
           BRAND
           ===================================================== */

        .register-brand {
          display: flex;
          align-items: center;

          gap: 12px;

          margin-bottom: 22px;
        }

        .register-brand-mark {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #111;
          color: #fff;

          font-size: 17px;
          font-weight: 800;

          letter-spacing: -0.04em;

          box-shadow:
            0 5px 15px rgba(0, 0, 0, 0.12);
        }

        .register-brand-name {
          margin: 0;

          font-size: 15px;
          font-weight: 800;

          letter-spacing: 0.15em;
        }

        .register-brand-subtitle {
          margin-top: 3px;

          color: #888;

          font-size: 10px;
          letter-spacing: 0.04em;
        }


        /* =====================================================
           CARD
           ===================================================== */

        .register-card {
          background: #fff;

          border: 1px solid #dededb;

          padding: 38px;

          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.07);

          animation:
            registerCardIn 0.45s ease;
        }

        @keyframes registerCardIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* =====================================================
           HEADER
           ===================================================== */

        .register-eyebrow {
          margin-bottom: 9px;

          color: #888;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 0.16em;
        }

        .register-title {
          margin: 0;

          color: #111;

          font-size: 28px;
          line-height: 1.15;

          font-weight: 700;

          letter-spacing: -0.035em;
        }

        .register-description {
          margin: 10px 0 28px;

          color: #777;

          font-size: 13px;
          line-height: 1.6;
        }


        /* =====================================================
           MESSAGES
           ===================================================== */

        .register-message {
          display: flex;
          align-items: flex-start;

          gap: 11px;

          margin-bottom: 20px;

          padding: 13px;

          border: 1px solid;

          font-size: 12px;
          line-height: 1.5;
        }

        .register-message-icon {
          width: 20px;
          height: 20px;

          min-width: 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid currentColor;

          font-size: 11px;
          font-weight: 700;
        }

        .register-error {
          background: #faf6f6;
          border-color: #dfcaca;
          color: #692d2d;
        }

        .register-success {
          background: #f5f8f5;
          border-color: #cbd8cd;
          color: #315438;
        }

        .register-message strong {
          display: block;

          margin-bottom: 2px;

          font-size: 12px;
        }

        .register-message-text {
          margin: 0;
        }


        /* =====================================================
           FORM
           ===================================================== */

        .register-form {
          display: flex;
          flex-direction: column;

          gap: 19px;
        }

        .register-field {
          display: flex;
          flex-direction: column;

          gap: 7px;
        }

        .register-label {
          color: #222;

          font-size: 12px;
          font-weight: 650;
        }

        .register-input,
        .register-select {
          width: 100%;

          height: 46px;

          box-sizing: border-box;

          padding: 0 13px;

          border: 1px solid #d5d5d1;
          border-radius: 2px;

          outline: none;

          background: #fff;
          color: #111;

          font-family: inherit;
          font-size: 13px;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }

        .register-input::placeholder {
          color: #aaa;
        }

        .register-input:hover,
        .register-select:hover {
          border-color: #aaa;
        }

        .register-input:focus,
        .register-select:focus {
          border-color: #111;

          box-shadow:
            0 0 0 3px rgba(0, 0, 0, 0.06);
        }

        .register-select {
          cursor: pointer;
        }


        /* =====================================================
           PASSWORD NOTE
           ===================================================== */

        .register-field-note {
          margin-top: -2px;

          color: #999;

          font-size: 10px;
        }


        /* =====================================================
           SUBMIT
           ===================================================== */

        .register-submit {
          width: 100%;

          height: 47px;

          margin-top: 4px;

          border: 1px solid #111;
          border-radius: 2px;

          background: #111;
          color: #fff;

          font-family: inherit;

          font-size: 12px;
          font-weight: 700;

          letter-spacing: 0.02em;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 9px;

          transition:
            background 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .register-submit:hover:not(:disabled) {
          background: #292929;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .register-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-submit:disabled {
          opacity: 0.55;

          cursor: not-allowed;
        }


        /* =====================================================
           LOADING SPINNER
           ===================================================== */

        .register-spinner {
          width: 13px;
          height: 13px;

          border: 2px solid
            rgba(255, 255, 255, 0.35);

          border-top-color: #fff;

          border-radius: 50%;

          animation:
            registerSpin 0.7s linear infinite;
        }

        @keyframes registerSpin {
          to {
            transform: rotate(360deg);
          }
        }


        /* =====================================================
           DIVIDER
           ===================================================== */

        .register-divider {
          display: flex;
          align-items: center;

          gap: 12px;

          margin: 26px 0 15px;

          color: #999;

          font-size: 10px;
        }

        .register-divider::before,
        .register-divider::after {
          content: "";

          height: 1px;

          flex: 1;

          background: #e5e5e2;
        }


        /* =====================================================
           LOGIN BUTTON
           ===================================================== */

        .register-login-button {
          width: 100%;

          height: 44px;

          border: 1px solid #d1d1cd;
          border-radius: 2px;

          background: #fff;
          color: #222;

          font-family: inherit;

          font-size: 12px;
          font-weight: 650;

          cursor: pointer;

          transition:
            background 0.18s ease,
            border-color 0.18s ease;
        }

        .register-login-button:hover {
          background: #f5f5f3;

          border-color: #aaa;
        }


        /* =====================================================
           FOOTER
           ===================================================== */

        .register-footer {
          display: flex;
          justify-content: center;
          align-items: center;

          gap: 8px;

          margin-top: 20px;

          color: #999;

          font-size: 10px;
        }

        .register-footer-dot {
          color: #ccc;
        }


        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 600px) {

          .register-page {
            padding: 24px 14px;
          }

          .register-card {
            padding: 28px 20px;
          }

          .register-title {
            font-size: 24px;
          }

          .register-brand {
            margin-bottom: 18px;
          }

          .register-footer {
            flex-wrap: wrap;

            text-align: center;
          }
        }

      `}</style>

      <main className="register-page">

        <div className="register-container">

          {/* BRAND */}

          <div className="register-brand">

            <div className="register-brand-mark">
              P
            </div>

            <div>
              <h1 className="register-brand-name">
                PLATFORM
              </h1>

              <div className="register-brand-subtitle">
                Commerce Infrastructure
              </div>
            </div>

          </div>


          {/* CARD */}

          <section className="register-card">

            <div className="register-eyebrow">
              ACCOUNT REGISTRATION
            </div>

            <h2 className="register-title">
              Create your account
            </h2>

            <p className="register-description">
              Set up your account to access the
              PLATFORM commerce environment.
            </p>


            {/* ERROR */}

            {error && (
              <div className="register-message register-error">

                <span className="register-message-icon">
                  !
                </span>

                <div>
                  <strong>
                    Registration failed
                  </strong>

                  <p className="register-message-text">
                    {error}
                  </p>
                </div>

              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="register-message register-success">

                <span className="register-message-icon">
                  ✓
                </span>

                <div>
                  <strong>
                    Account created
                  </strong>

                  <p className="register-message-text">
                    {success}
                  </p>
                </div>

              </div>
            )}


            {/* FORM */}

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="register-field">

                <label
                  className="register-label"
                  htmlFor="register-name"
                >
                  Full name
                </label>

                <input
                  id="register-name"
                  type="text"
                  className="register-input"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="register-field">

                <label
                  className="register-label"
                  htmlFor="register-email"
                >
                  Email address
                </label>

                <input
                  id="register-email"
                  type="email"
                  className="register-input"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="register-field">

                <label
                  className="register-label"
                  htmlFor="register-password"
                >
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  className="register-input"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <span className="register-field-note">
                  Use at least 6 characters.
                </span>

              </div>


              {/* ROLE */}

              <div className="register-field">

                <label
                  className="register-label"
                  htmlFor="register-role"
                >
                  Account type
                </label>

                <select
                  id="register-role"
                  className="register-select"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  required
                >

                  <option value="0">
                    Customer
                  </option>

                  <option value="1">
                    Seller
                  </option>

                </select>

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="register-spinner" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}

              </button>

            </form>


            {/* LOGIN */}

            <div className="register-divider">
              <span>
                Already have an account?
              </span>
            </div>

            <button
              type="button"
              className="register-login-button"
              onClick={onNavigateToLogin}
            >
              Sign in
            </button>

          </section>


          {/* FOOTER */}

          <footer className="register-footer">

            <span>
              © {new Date().getFullYear()} PLATFORM
            </span>

            <span className="register-footer-dot">
              •
            </span>

            <span>
              Secure commerce platform
            </span>

          </footer>

        </div>

      </main>
    </>
  );
}