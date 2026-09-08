const loginForm = document.getElementById("login-form");
if (loginForm) {

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

    window.location.href = "index.html";
  });
}

async function requireSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  });
}

supabaseClient.auth.onAuthStateChange((_event, session) => {
  const onLoginPage = !!document.getElementById("login-form");
  if (!session && !onLoginPage) {
    window.location.href = "login.html";
  }
});
