
const sections = ['profile', 'appointments', 'prescriptions', 'notifications'];

function showSection(name) {

  // Hide default welcome
  document
    .getElementById('section-default')
    .classList.add('hidden');

  // Hide all sections and deactivate nav items
  sections.forEach(s => {

    document
      .getElementById('section-' + s)
      .classList.add('hidden');

    document
      .getElementById('nav-' + s)
      .classList.remove('active');

  });

  // Show selected section
  document
    .getElementById('section-' + name)
    .classList.remove('hidden');

  // Activate selected nav item
  document
    .getElementById('nav-' + name)
    .classList.add('active');

  // Reset profile mode when opening profile
  if (name === 'profile') {

    document
      .getElementById('viewMode')
      .classList.remove('hidden');

    document
      .getElementById('editMode')
      .classList.add('hidden');

  }
}

function enterEditMode() {

  const fields = [
    'fullname',
    'email',
    'phone',
    'dob',
    'gender',
    'blood',
    'address',
    'emergency',
    'ecname',
    'allergies',
    'chronic'
  ];

  fields.forEach(f => {

    const viewEl =
      document.getElementById('v-' + f);

    const editEl =
      document.getElementById('e-' + f);

    editEl.value =
      viewEl.textContent.trim();

  });

  document
    .getElementById('viewMode')
    .classList.add('hidden');

  document
    .getElementById('editMode')
    .classList.remove('hidden');
}

function saveProfile() {

  const fields = [
    'fullname',
    'email',
    'phone',
    'dob',
    'gender',
    'blood',
    'address',
    'emergency',
    'ecname',
    'allergies',
    'chronic'
  ];

  fields.forEach(f => {

    document
      .getElementById('v-' + f)
      .textContent =
      document.getElementById('e-' + f).value;

  });

  document
    .getElementById('editMode')
    .classList.add('hidden');

  document
    .getElementById('viewMode')
    .classList.remove('hidden');
}

function cancelEdit() {

  document
    .getElementById('editMode')
    .classList.add('hidden');

  document
    .getElementById('viewMode')
    .classList.remove('hidden');
}