import { useState } from "react";
import { login } from "../api/authService";

export default function Login({
  onLoginSuccess,
  onNavigateToRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await login({
        email,
        password,
      });

      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`

        /* =========================================
           LOGIN PAGE
           ========================================= */

        .login-page {
          min-height: 100vh;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 40px 20px;

          background: #f4f4f4;

          color: #111;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif;
        }


        /* =========================================
           LOGIN LAYOUT
           ========================================= */

        .login-layout {
          width: 100%;

          max-width: 1050px;

          min-height: 610px;

          display: grid;

          grid-template-columns: 1fr 420px;

          background: #fff;

          border: 1px solid #d5d5d5;

          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.08);

          animation: loginAppear 0.45s ease;
        }


        /* =========================================
           LEFT BUSINESS PANEL
           ========================================= */

        .login-brand-panel {
          position: relative;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          padding: 55px;

          background: #111;

          color: #fff;

          overflow: hidden;
        }


        .login-brand-panel::after {
          content: "";

          position: absolute;

          width: 280px;
          height: 280px;

          right: -120px;
          bottom: -120px;

          border: 1px solid #444;

          transform: rotate(45deg);

          opacity: 0.6;
        }


        .login-brand {
          position: relative;

          z-index: 2;

          font-size: 20px;

          font-weight: 800;

          letter-spacing: 3px;
        }


        .login-brand-content {
          position: relative;

          z-index: 2;

          max-width: 480px;
        }


        .login-brand-content h1 {
          margin: 0 0 20px;

          font-size: clamp(38px, 5vw, 58px);

          line-height: 1.02;

          letter-spacing: -2px;

          font-weight: 750;
        }


        .login-brand-content p {
          max-width: 430px;

          margin: 0;

          color: #bcbcbc;

          font-size: 15px;

          line-height: 1.7;
        }


        .login-brand-footer {
          position: relative;

          z-index: 2;

          display: flex;

          gap: 30px;

          color: #888;

          font-size: 11px;

          text-transform: uppercase;

          letter-spacing: 1.2px;
        }


        /* =========================================
           LOGIN FORM PANEL
           ========================================= */

        .login-form-panel {
          display: flex;

          flex-direction: column;

          justify-content: center;

          padding: 55px 45px;

          background: #fff;
        }


        .login-heading {
          margin-bottom: 35px;
        }


        .login-heading h2 {
          margin: 0 0 8px;

          font-size: 28px;

          font-weight: 700;

          letter-spacing: -0.5px;
        }


        .login-heading p {
          margin: 0;

          color: #777;

          font-size: 13px;
        }


        /* =========================================
           FORM
           ========================================= */

        .login-form {
          width: 100%;
        }


        .login-field {
          margin-bottom: 22px;
        }


        .login-field label {
          display: block;

          margin-bottom: 8px;

          color: #222;

          font-size: 12px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.6px;
        }


        .login-input {
          width: 100%;

          height: 48px;

          padding: 0 13px;

          border: 1px solid #cfcfcf;

          border-radius: 0;

          outline: none;

          background: #fff;

          color: #111;

          font-size: 14px;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.18s ease;
        }


        .login-input:hover {
          border-color: #999;
        }


        .login-input:focus {
          border-color: #111;

          background: #fff;

          box-shadow:
            0 0 0 2px rgba(0, 0, 0, 0.08);
        }


        .login-input::placeholder {
          color: #aaa;
        }


        /* =========================================
           ERROR
           ========================================= */

        .login-error {
          margin-bottom: 22px;

          padding: 12px 14px;

          border: 1px solid #222;

          border-left: 3px solid #111;

          background: #fafafa;

          color: #222;

          font-size: 12px;

          line-height: 1.5;
        }


        /* =========================================
           SIGN IN BUTTON
           ========================================= */

        .login-submit {
          width: 100%;

          height: 48px;

          border: 1px solid #111;

          border-radius: 0;

          background: #111;

          color: #fff;

          font-size: 13px;

          font-weight: 700;

          letter-spacing: 0.3px;

          cursor: pointer;

          transition:
            background 0.18s ease,
            transform 0.12s ease;
        }


        .login-submit:hover {
          background: #333;
        }


        .login-submit:active {
          transform: translateY(1px);
        }


        .login-submit:disabled {
          background: #555;

          border-color: #555;

          cursor: not-allowed;

          opacity: 0.7;
        }


        /* =========================================
           REGISTER SECTION
           ========================================= */

        .login-register {
          margin-top: 28px;

          padding-top: 24px;

          border-top: 1px solid #e5e5e5;

          text-align: center;
        }


        .login-register-text {
          margin: 0 0 12px;

          color: #777;

          font-size: 12px;
        }


        .login-register-button {
          width: 100%;

          height: 44px;

          border: 1px solid #bbb;

          border-radius: 0;

          background: #fff;

          color: #111;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.18s ease,
            border-color 0.18s ease;
        }


        .login-register-button:hover {
          background: #f2f2f2;

          border-color: #111;
        }


        /* =========================================
           SECURITY NOTE
           ========================================= */

        .login-security {
          margin-top: 24px;

          color: #999;

          font-size: 10px;

          line-height: 1.5;

          text-align: center;
        }


        /* =========================================
           ANIMATION
           ========================================= */

        @keyframes loginAppear {

          from {
            opacity: 0;

            transform:
              translateY(12px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }

        }


        /* =========================================
           TABLET
           ========================================= */

        @media (max-width: 850px) {

          .login-layout {
            max-width: 500px;

            grid-template-columns: 1fr;
          }


          .login-brand-panel {
            min-height: 260px;

            padding: 35px;
          }


          .login-brand-content {
            margin-top: 45px;
          }


          .login-brand-content h1 {
            font-size: 38px;
          }


          .login-brand-footer {
            display: none;
          }


          .login-form-panel {
            padding: 40px;
          }

        }


        /* =========================================
           MOBILE
           ========================================= */

        @media (max-width: 520px) {

          .login-page {
            padding: 0;

            align-items: stretch;
          }


          .login-layout {
            min-height: 100vh;

            border: none;

            box-shadow: none;
          }


          .login-brand-panel {
            min-height: 220px;

            padding: 28px 22px;
          }


          .login-brand {
            font-size: 17px;

            letter-spacing: 2.5px;
          }


          .login-brand-content {
            margin-top: 35px;
          }


          .login-brand-content h1 {
            font-size: 34px;

            letter-spacing: -1.2px;
          }


          .login-brand-content p {
            font-size: 13px;
          }


          .login-form-panel {
            padding: 35px 22px;
          }


          .login-heading h2 {
            font-size: 25px;
          }

        }

      `}</style>

      <div className="login-page">

        <div className="login-layout">

          {/* =====================================
              BUSINESS / BRAND AREA
          ===================================== */}

          <section className="login-brand-panel">

            <div className="login-brand">
              PLATFORM
            </div>

            <div className="login-brand-content">

              <h1>
                Business.
                <br />
                Simplified.
              </h1>

              <p>
                Manage products, inventory and
                marketplace operations through
                one centralized platform.
              </p>

            </div>

            <div className="login-brand-footer">
              <span>Secure Access</span>
              <span>Business Platform</span>
            </div>

          </section>


          {/* =====================================
              LOGIN FORM
          ===================================== */}

          <section className="login-form-panel">

            <div className="login-heading">

              <h2>
                Sign in
              </h2>

              <p>
                Enter your account credentials
                to continue.
              </p>

            </div>


            {error && (
              <div className="login-error">
                {error}
              </div>
            )}


            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}

              <div className="login-field">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <input
                  id="login-email"
                  type="email"
                  className="login-input"
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

              <div className="login-field">

                <label htmlFor="login-password">
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  className="login-input"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="login-submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Signing in..."
                  : "Continue"}
              </button>

            </form>


            {/* REGISTER */}

            <div className="login-register">

              <p className="login-register-text">
                Don't have a PLATFORM account?
              </p>

              <button
                type="button"
                className="login-register-button"
                onClick={onNavigateToRegister}
              >
                Create an account
              </button>

            </div>


            <div className="login-security">
              Authorized users only. Your account
              credentials are protected.
            </div>

          </section>

        </div>

      </div>
    </>
  );
}