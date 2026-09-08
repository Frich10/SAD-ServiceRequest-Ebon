// js/app.js
// -----------------------------------------------------------------------
// Core application logic for index.html:
//   - Dashboard summary counts
//   - CRUD: Create, Read, Update, Delete service requests
//   - Search (requester name / description)
//   - Filter (status, priority)
//   - Business rule validation (BR-01 to BR-06, BR-09)
//   - Optional: Request Analytics (bonus)
// -----------------------------------------------------------------------

let currentUser = null;
let allRequests = []; // cached copy of the last full fetch, used for client-side search/filter

// ---------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------
(async function init() {
  const session = await requireSession();
  if (!session) return; // requireSession() already redirected to login.html

  currentUser = session.user;
  document.getElementById("user-email").textContent = currentUser.email;

  await loadRequests();

  // Wire up static UI events
  document.getElementById("new-request-btn").addEventListener("click", openCreateModal);
  document.getElementById("request-form").addEventListener("submit", handleFormSubmit);
  document.getElementById("cancel-btn").addEventListener("click", closeModal);
  document.getElementById("search-input").addEventListener("input", applyFilters);
  document.getElementById("status-filter").addEventListener("change", applyFilters);
  document.getElementById("priority-filter").addEventListener("change", applyFilters);
  document.getElementById("confirm-delete-yes").addEventListener("click", confirmDelete);
  document.getElementById("confirm-delete-no").addEventListener("click", closeDeleteModal);
})();

// ---------------------------------------------------------------------
// READ: fetch all requests, render table + dashboard + analytics
// ---------------------------------------------------------------------
async function loadRequests() {
  const { data, error } = await supabaseClient
    .from("service_requests")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    alert("Error loading requests: " + error.message);
    return;
  }

  allRequests = data || [];
  renderDashboard(allRequests);
  renderAnalytics(allRequests);
  applyFilters(); // renders the table using current search/filter state
}

function renderDashboard(requests) {
  const total = requests.length;
  const pending = requests.filter(r => r.status === "Pending").length;
  const inProgress = requests.filter(r => r.status === "In Progress").length;
  const completed = requests.filter(r => r.status === "Completed").length;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("stat-inprogress").textContent = inProgress;
  document.getElementById("stat-completed").textContent = completed;
}

// Bonus: Request Analytics by category and priority (values from DB, not hard-coded)
function renderAnalytics(requests) {
  const byCategory = {};
  const byPriority = {};

  requests.forEach(r => {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    byPriority[r.priority] = (byPriority[r.priority] || 0) + 1;
  });

  const catList = document.getElementById("analytics-category");
  const priList = document.getElementById("analytics-priority");
  catList.innerHTML = "";
  priList.innerHTML = "";

  Object.entries(byCategory).forEach(([k, v]) => {
    const li = document.createElement("li");
    li.textContent = `${k}: ${v}`;
    catList.appendChild(li);
  });

  Object.entries(byPriority).forEach(([k, v]) => {
    const li = document.createElement("li");
    li.textContent = `${k}: ${v}`;
    priList.appendChild(li);
  });
}

// ---------------------------------------------------------------------
// SEARCH + FILTER (client-side, operates on the cached allRequests array)
// ---------------------------------------------------------------------
function applyFilters() {
  const searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
  const statusFilter = document.getElementById("status-filter").value;
  const priorityFilter = document.getElementById("priority-filter").value;

  let filtered = allRequests;

  if (searchTerm) {
    filtered = filtered.filter(r =>
      r.requester_name.toLowerCase().includes(searchTerm) ||
      r.description.toLowerCase().includes(searchTerm) ||
      r.priority.toLowerCase().includes(searchTerm) ||
      r.status.toLowerCase().includes(searchTerm)
    );
  }

  if (statusFilter !== "All") {
    filtered = filtered.filter(r => r.status === statusFilter);
  }

  if (priorityFilter !== "All") {
    filtered = filtered.filter(r => r.priority === priorityFilter);
  }

  renderTable(filtered);
}

function renderTable(requests) {
  const tbody = document.getElementById("requests-tbody");
  tbody.innerHTML = "";

  if (requests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-row">No matching requests.</td></tr>`;
    return;
  }

  requests.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${escapeHtml(r.requester_name)}</td>
      <td>${escapeHtml(r.category)}</td>
      <td><span class="badge priority-${r.priority.toLowerCase()}">${r.priority}</span></td>
      <td><span class="badge status-${r.status.toLowerCase().replace(" ", "-")}">${r.status}</span></td>
      <td>${new Date(r.created_at).toLocaleDateString()}</td>
      <td>
        <button class="link-btn edit-btn" data-id="${r.id}">Edit</button>
        <button class="link-btn delete-btn" data-id="${r.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Wire up row action buttons
  tbody.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", () => openEditModal(btn.dataset.id))
  );
  tbody.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", () => openDeleteModal(btn.dataset.id))
  );
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------------------------------------------------------------------
// CREATE / UPDATE MODAL
// ---------------------------------------------------------------------
function openCreateModal() {
  document.getElementById("modal-title").textContent = "New Service Request";
  document.getElementById("request-id").value = "";
  document.getElementById("requester_name").value = "";
  document.getElementById("department").value = "";
  document.getElementById("category").value = "Computer Repair";
  document.getElementById("description").value = "";
  document.getElementById("priority").value = "Low";

  // Status field only shown/editable when editing an existing request (BR-06)
  document.getElementById("status-field-group").style.display = "none";

  document.getElementById("form-error").textContent = "";
  document.getElementById("request-modal").classList.remove("hidden");
}

function openEditModal(id) {
  const req = allRequests.find(r => String(r.id) === String(id));
  if (!req) return;

  document.getElementById("modal-title").textContent = "Edit Service Request";
  document.getElementById("request-id").value = req.id;
  document.getElementById("requester_name").value = req.requester_name;
  document.getElementById("department").value = req.department;
  document.getElementById("category").value = req.category;
  document.getElementById("description").value = req.description;
  document.getElementById("priority").value = req.priority;
  document.getElementById("status").value = req.status;

  document.getElementById("status-field-group").style.display = "block";

  document.getElementById("form-error").textContent = "";
  document.getElementById("request-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("request-modal").classList.add("hidden");
}

// Validate against the business rules (BR-01 to BR-05)
function validateForm(values) {
  if (!values.requester_name) return "Requester name cannot be empty. (BR-01)";
  if (!values.department) return "Department must be provided. (BR-02)";
  if (!values.category) return "Category must be selected. (BR-03)";
  if (!values.description || values.description.length < 10)
    return "Description must contain sufficient information (at least 10 characters). (BR-04)";
  if (!["Low", "Medium", "High"].includes(values.priority))
    return "Priority must be Low, Medium, or High. (BR-05)";
  return null;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("request-id").value;
  const values = {
    requester_name: document.getElementById("requester_name").value.trim(),
    department: document.getElementById("department").value.trim(),
    category: document.getElementById("category").value,
    description: document.getElementById("description").value.trim(),
    priority: document.getElementById("priority").value,
  };

  const validationError = validateForm(values);
  if (validationError) {
    document.getElementById("form-error").textContent = validationError;
    return;
  }

  if (id) {
    // ---- UPDATE ----
    values.status = document.getElementById("status").value;
    const { error } = await supabaseClient
      .from("service_requests")
      .update(values)
      .eq("id", id);

    if (error) {
      document.getElementById("form-error").textContent = "Update failed: " + error.message;
      return;
    }
  } else {
    // ---- CREATE (BR-06: new requests are always Pending, BR-09: created_at is automatic) ----
    const { error } = await supabaseClient
      .from("service_requests")
      .insert([{
        ...values,
        status: "Pending",
        user_id: currentUser.id,
      }]);

    if (error) {
      document.getElementById("form-error").textContent = "Create failed: " + error.message;
      return;
    }
  }

  closeModal();
  await loadRequests();
}

// ---------------------------------------------------------------------
// DELETE (BR-08: confirmation required before deleting)
// ---------------------------------------------------------------------
let pendingDeleteId = null;

function openDeleteModal(id) {
  pendingDeleteId = id;
  document.getElementById("delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
  pendingDeleteId = null;
  document.getElementById("delete-modal").classList.add("hidden");
}

async function confirmDelete() {
  if (!pendingDeleteId) return;

  const { error } = await supabaseClient
    .from("service_requests")
    .delete()
    .eq("id", pendingDeleteId);

  if (error) {
    alert("Delete failed: " + error.message);
  }

  closeDeleteModal();
  await loadRequests();
}
