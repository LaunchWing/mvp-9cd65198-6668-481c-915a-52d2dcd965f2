
function sayHi() {
  alert("Hello from ResuMate AI!");
}

document.querySelector('#userForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const res = await fetch('/api/submit', {
    method: 'POST',
    body: name,
  });
  const data = await res.json();
  document.querySelector('#responseMsg').textContent = data.message;
});
