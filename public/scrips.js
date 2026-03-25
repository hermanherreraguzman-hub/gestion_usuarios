// Elementos DOM
const DOM = {
  form: document.getElementById('userForm'),
  userId: document.getElementById('userId'),
  nombre: document.getElementById('nombre'),
  email: document.getElementById('email'),
  edad: document.getElementById('edad'),
  submitBtn: document.getElementById('submitBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  usersList: document.getElementById('usersList')
};

const API_URL = '/api/usuarios';
let editingId = null;

// Funciones auxiliares
const showError = (field, message) => {
  const errorSpan = document.getElementById(`${field}Error`);
  if (errorSpan) errorSpan.textContent = message;
};

const clearErrors = () => {
  ['nombre', 'email', 'edad'].forEach(f => showError(f, ''));
};

const validateForm = (nombre, email, edad) => {
  let isValid = true;
  clearErrors();

  if (!nombre.trim()) {
    showError('nombre', 'El nombre es obligatorio');
    isValid = false;
  }
  if (!email.trim()) {
    showError('email', 'El email es obligatorio');
    isValid = false;
  } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) {
    showError('email', 'Ingrese un email válido');
    isValid = false;
  }
  if (edad && (isNaN(edad) || edad < 0 || edad > 120)) {
    showError('edad', 'La edad debe ser un número entre 0 y 120');
    isValid = false;
  }
  return isValid;
};

const resetForm = () => {
  editingId = null;
  DOM.userId.value = '';
  DOM.nombre.value = '';
  DOM.email.value = '';
  DOM.edad.value = '';
  DOM.submitBtn.textContent = 'Guardar Usuario';
  DOM.cancelBtn.style.display = 'none';
  clearErrors();
};

const renderUsers = (users) => {
  DOM.usersList.innerHTML = '';
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(user.id)}</td>
      <td>${escapeHtml(user.nombre)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${user.edad || ''}</td>
      <td class="actions">
        <button class="edit-btn" data-id="${user.id}">Editar</button>
        <button class="delete-btn" data-id="${user.id}">Eliminar</button>
      </td>
    `;
    DOM.usersList.appendChild(row);
  });

  document.querySelectorAll('.edit-btn').forEach(btn =>
    btn.addEventListener('click', () => editUser(btn.dataset.id))
  );
  document.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', () => deleteUser(btn.dataset.id))
  );
};

const escapeHtml = (str) => {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
};

// Funciones de API
const loadUsers = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al cargar usuarios');
    const users = await res.json();
    renderUsers(users);
  } catch (error) {
    console.error(error);
    alert('Error al conectar con el servidor');
  }
};

const createUser = async (userData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.errors?.[0]?.msg || error.error || 'Error al crear usuario');
  }
  return res.json();
};

const updateUser = async (id, userData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.errors?.[0]?.msg || error.error || 'Error al actualizar usuario');
  }
  return res.json();
};

const deleteUserAPI = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al eliminar usuario');
  }
  return res.json();
};

// Eventos
DOM.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = DOM.nombre.value.trim();
  const email = DOM.email.value.trim();
  const edad = DOM.edad.value.trim() ? parseInt(DOM.edad.value) : null;

  if (!validateForm(nombre, email, edad)) return;

  const userData = { nombre, email, edad };

  try {
    if (editingId) {
      await updateUser(editingId, userData);
    } else {
      await createUser(userData);
    }
    resetForm();
    loadUsers();
  } catch (error) {
    alert(error.message);
  }
});

const editUser = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Usuario no encontrado');
    const user = await res.json();
    editingId = id;
    DOM.userId.value = id;
    DOM.nombre.value = user.nombre;
    DOM.email.value = user.email;
    DOM.edad.value = user.edad || '';
    DOM.submitBtn.textContent = 'Actualizar Usuario';
    DOM.cancelBtn.style.display = 'inline-block';
  } catch (error) {
    alert(error.message);
  }
};

const deleteUser = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
  try {
    await deleteUserAPI(id);
    if (editingId == id) resetForm();
    loadUsers();
  } catch (error) {
    alert(error.message);
  }
};

DOM.cancelBtn.addEventListener('click', resetForm);

// Inicialización
resetForm();
loadUsers();