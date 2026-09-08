// js/auth.js
// -----------------------------------------------------------------------
// Handles: Login, Logout, Session management (BR-07: must log in before
// managing requests).
// -----------------------------------------------------------------------

// ---- LOGIN PAGE LOGIC ---------------------------------------------------
// Runs only if a #login-form element exists on the page (login.html).
const loginForm = document.getElementById("login-form");
if (loginForm) {
  // If a session already exists, skip straight to the dashboard.
  (async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      window.location.href = "index.html";
    }
  })();

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("login-error");
    errorBox.textContent = "";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorBox.textContent = "Login failed: " + error.message;
      return;
    }

    // Successful login -> go to dashboard
    window.location.href = "index.html";
  });
}

// ---- SESSION GUARD FOR PROTECTED PAGES (index.html) ---------------------
// Any page that includes this script AND has a #logout-btn is treated as
// a protected page that requires an active session.
async function requireSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

// ---- LOGOUT ---------------------------------------------------------------
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  });
}

// Keep the UI in sync if the session changes/expires in another tab.
supabaseClient.auth.onAuthStateChange((_event, session) => {
  const onLoginPage = !!document.getElementById("login-form");
  if (!session && !onLoginPage) {
    window.location.href = "login.html";
  }
});
