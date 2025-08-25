// app.js
// Toute la logique de Cabane+

document.addEventListener('DOMContentLoaded', function() {
  window.showTab = showTab;
  window.toggleModal = toggleModal;
  // Tabs
  showTab('discover');
  loadCabins();
  loadPasses();
  loadBookings();

  // Publication d'une cabane
  document.getElementById('publish-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('cabin-title').value;
    const desc = document.getElementById('cabin-desc').value;
    const price = document.getElementById('cabin-price').value;
    const img = document.getElementById('cabin-img').value;
    const cabins = JSON.parse(localStorage.getItem('cabins') || '[]');
    cabins.push({title, desc, price, img});
    localStorage.setItem('cabins', JSON.stringify(cabins));
    loadCabins();
    this.reset();
    alert('Cabane publiée !');
  });

  // Créer un pass (carte cadeau)
  document.getElementById('pass-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('pass-email').value;
    const name = document.getElementById('pass-name').value;
    const value = document.getElementById('pass-value').value;
    const payment = document.getElementById('pass-payment').value;
    const passes = JSON.parse(localStorage.getItem('passes') || '[]');
    const passObj = {email, name, value, payment, date: new Date().toISOString()};
    passes.push(passObj);
    localStorage.setItem('passes', JSON.stringify(passes));
    loadPasses();
    this.reset();
    // Envoi email via EmailJS
    try {
      await sendEmail("template_rzhs70i", {to_email: email, to_name: name, pass_value: value, payment_method: payment});
      alert('Carte cadeau créée et email envoyé !');
    } catch (e) {
      alert("Erreur lors de l'envoi de l'email");
    }
  });

  // Réservation d'une cabane
  document.getElementById('booking-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('booking-email').value;
    const date = document.getElementById('booking-date').value;
    const payment = document.getElementById('booking-payment').value;
    const title = document.getElementById('modal-cabin-title').textContent;
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingObj = {email, title, date, payment, timestamp: new Date().toISOString()};
    bookings.push(bookingObj);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadBookings();
    toggleModal(false);
    // Envoi email via EmailJS
    try {
      await sendEmail("TEMPLATE_ID_BOOKING", {to_email: email, cabin_title: title, booking_date: date, payment_method: payment});
      alert('Cabane réservée et email envoyé !');
    } catch (e) {
      alert("Erreur lors de l'envoi de l'email");
    }
  });
});

// Navigation
function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el=>el.classList.add('hidden'));
  document.getElementById('tab-content-'+tab).classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(el=>el.classList.remove('bg-blue-600','text-white'));
  document.getElementById('tab-'+tab).classList.add('bg-blue-600','text-white');
}

// Cabines
function loadCabins() {
  const list = document.getElementById('cabins-list');
  const cabins = JSON.parse(localStorage.getItem('cabins') || '[]');
  if (cabins.length === 0) {
    list.innerHTML = "<div class='text-gray-600'>Aucune cabane pour le moment.</div>";
    return;
  }
  list.innerHTML = '';
  cabins.forEach((cabin, i) => {
    const el = document.createElement('div');
    el.className = "bg-white p-4 rounded shadow flex flex-col sm:flex-row";
    el.innerHTML = `
      <img src="${cabin.img}" alt="${cabin.title}" class="w-full sm:w-40 h-32 object-cover rounded mb-2 sm:mb-0 sm:mr-4" />
      <div class="flex-1">
        <h3 class="text-xl font-bold">${cabin.title}</h3>
        <p class="text-gray-700">${cabin.desc}</p>
        <span class="block font-bold text-blue-700 mt-2">${cabin.price} € / nuit</span>
        <button class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onclick='openBookingModal(${i})'>Réserver</button>
      </div>
    `;
    list.appendChild(el);
  });
}

function openBookingModal(index) {
  const cabins = JSON.parse(localStorage.getItem('cabins') || '[]');
  const cabin = cabins[index];
  document.getElementById('modal-cabin-title').textContent = cabin.title;
  toggleModal(true);
}

function toggleModal(show) {
  document.getElementById('booking-modal').classList.toggle('hidden', !show);
}

// Passes
function loadPasses() {
  const passes = JSON.parse(localStorage.getItem('passes') || '[]');
  const ul = document.getElementById('my-passes');
  ul.innerHTML = '';
  passes.forEach(pass => {
    const li = document.createElement('li');
    li.className = "bg-green-100 px-3 py-2 rounded shadow";
    li.textContent = `${pass.name} (${pass.value} €) par ${pass.payment} - ${new Date(pass.date).toLocaleDateString()}`;
    ul.appendChild(li);
  });
}

// Bookings
function loadBookings() {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const ul = document.getElementById('my-bookings');
  ul.innerHTML = '';
  bookings.forEach(booking => {
    const li = document.createElement('li');
    li.className = "bg-blue-100 px-3 py-2 rounded shadow";
    li.textContent = `${booking.title} le ${booking.date} par ${booking.payment}`;
    ul.appendChild(li);
  });
  }
