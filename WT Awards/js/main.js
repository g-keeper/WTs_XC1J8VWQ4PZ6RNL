const load_body = document.querySelector('.load');
const auth_body = document.querySelector('.auth');

function custom_timeout(delay) {
  return new Promise(res => setTimeout(res, delay));
}

window.onload = async() => {

  await custom_timeout(200);

  auth_body.classList.add('active');

}
