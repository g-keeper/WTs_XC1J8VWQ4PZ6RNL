let app_url = 'https://script.google.com/macros/s/AKfycbywJST9JqYLZFB09jlkNC7kXHVbzk1DFW3reDcTSz8fEDjDE4LTPdQhYBtA5kiSFJHF/exec';
let img_url = 'https://cdn.discordapp.com/embed/avatars/0.png';
let ref_url = '';

let auth_local = JSON.parse(localStorage.getItem('session') || '{}');
let theme_local = localStorage.getItem('theme') || 'night';

let main_content = document.querySelector('#app');

let load_body = document.querySelector('#load');
let load_image_01 = document.querySelector('#load .tech-01');
let load_image_02 = document.querySelector('#load .tech-02');
let load_image_03 = document.querySelector('#load .tech-03');
let load_text = document.querySelector('#load .text');

let auth_body = document.querySelector('#auth');
let auth_username = document.querySelector('#username');
let auth_password = document.querySelector('#password');
let auth_complete = document.querySelector('#complete');
let auth_show = document.querySelector('#show');
let auth_credentials = document.querySelector('#credentials');

async function custom_request(type, data) {

  try {

    let headers = { 'Content-Type': 'text/plain' };
    let method = type <= 2 ? 'post' : 'get';
    let body = type <= 2 ? JSON.stringify(data) : data;

    if (type == 1 || type == 2) {

      let u = auth_local.username;
      let p = auth_local.password;

      let a = CryptoJS.SHA256(`${p}`).toString();
      let b = CryptoJS.SHA256(`${u}=${a}`).toString();

      let r = `${app_url}?auth=${ type == 1 ? b : p }`;

      let load = await fetch(r, { method, headers, body });
      let json = await load.json();

      return json;

    } else {

      let load = await fetch(ref_url, { method, headers });
      let json = await load.json();

      return json;

    }

  } catch(e) { return { status: 400 } }

}

function toggle_load(mode) {

  if (mode) {

    let t = 0, i_01 = 0, i_02 = 120, i_03 = 240;

    let a = setInterval(() => t += 1, 1000);
    let b = setInterval(() => {
  
      if (load_body.classList.contains('active')) {

        load_text.innerText = `${t}`.padStart(2,0);

        load_image_01.style.transform = `rotate(${ i_01 += 0.5 }deg)`;
        load_image_02.style.transform = `rotate(${ i_02 += 0.4 }deg)`;
        load_image_03.style.transform = `rotate(${ i_03 += 0.2 }deg)`;

      } else {
        clearInterval(a);
        clearInterval(b);
        toggle_load(false);
      }
  
    }, 10);
  
    load_body.classList.add('active');
    main_content.classList.remove('active');

  } else {
    load_body.classList.remove('active');
    main_content.classList.add('active');
    setTimeout(() => {
      load_image_01.removeAttribute('style');
      load_image_02.removeAttribute('style');
      load_image_03.removeAttribute('style');
      load_text.innerText = '00';
    }, 400);
  }

}

function init_application({ username, password }) {

  if (username && password) {

    setTimeout(() => toggle_load(true), 100);

    custom_request(2).then(response => {
      setTimeout(() => {
        if (response.status == 200) {
          application(response.data);
          setTimeout(() => toggle_load(false), 1000);
        } else if (confirm('Ошибка авторизации!\nВойти заново?')) {
          localStorage.removeItem('session');
          location.reload();
        } else location.reload();
      }, 500);
    });

  } else {

    setTimeout(() => auth_body.classList.add('active'), 100);

    [ auth_username, auth_password ].forEach(input => {
      input.oninput = (e) => {
        auth_username.value && auth_password.value ?
        auth_complete.classList.add('active') :
        auth_complete.classList.remove('active');
        auth_password.value ?
        auth_show.classList.add('active') :
        auth_show.classList.remove('active');
      }
      input.onfocus = (e) => e.target.removeAttribute('readonly');
      input.onblur = (e) => e.target.setAttribute('readonly', 'readonly');
    });

    auth_show.onclick = (e) => {
      auth_show.classList.toggle('showing');
      auth_show.classList.contains('showing') ?
      auth_password.type = 'text' :
      auth_password.type = 'password';
    };

    auth_complete.onclick = () => {

      auth_complete.classList.remove('active');
      auth_complete.classList.add('loading');

      auth_local.username = auth_username.value;
      auth_local.password = auth_password.value;

      custom_request(1).then(response => {
        if (response.status == 200) {
          auth_complete.classList.remove('loading');
          auth_complete.classList.add('ready');
          auth_local.password = response.password;
          localStorage.setItem('session', JSON.stringify(auth_local));
          navigator.credentials.create({ password: auth_local });
          setTimeout(() => location.reload(), 2000);
        } else {
          auth_complete.classList.remove('loading');
          auth_complete.classList.add('error');
          setTimeout(() => {
            auth_complete.classList.remove('error');
            auth_username.dispatchEvent(new Event('input'));
            auth_password.dispatchEvent(new Event('input'));
          }, 2000);
        }
      });

    }

    auth_credentials.onclick = () => {
      navigator.credentials.get({ password: true }).then(keys => {
        console.log(keys);
      });
    }

  }

}

function application(source) {

  console.log(source);

}

document.body.className = theme_local;
init_application(auth_local);

document.addEventListener('keydown', (e) => {

  if (e.ctrlKey && e.keyCode == 82) {
    localStorage.removeItem('session');
    localStorage.reload();
  }

})