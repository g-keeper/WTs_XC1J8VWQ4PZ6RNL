// dom

const load_body = document.querySelector('#load');
const auth_body = document.querySelector('#auth');
const main_body = document.querySelector('#main');

const auth_video = document.querySelector('#auth video');
const auth_message = document.querySelector('#auth-message');
const auth_sign_in = document.querySelector('#auth-sign-in');
const auth_sing_out = document.querySelector('#auth-sign-out');

const load_img_01 = document.querySelector('#load-img-01');
const load_img_02 = document.querySelector('#load-img-02');
const load_img_03 = document.querySelector('#load-img-03');
const load_time = document.querySelector('#load-time');

function load_screen(mode) {

  if (mode == 1) {
    load_body.classList.add('active');
    auth_body.classList.remove('active');
    main_body.classList.remove('active');
    auth_video.style.display = 'none';
  } else if (mode == 2) {
    load_body.classList.remove('active');
    auth_body.classList.add('active');
    main_body.classList.remove('active');
    auth_video.removeAttribute('style');
  } else if (mode == 3) {
    load_body.classList.remove('active');
    auth_body.classList.remove('active');
    main_body.classList.add('active');
    auth_video.style.display = 'none';
  }

  let time = 0;

  let s_01 = d_01 = 0;
  let s_02 = d_02 = 120;
  let s_03 = d_03 = 240;

  let interval_01 = setInterval(() => time += 1, 1000);
  let interval_02 = setInterval(() => {
    if (load_body.classList.contains('active')) {
      d_01 = d_01 >= s_01 + 360 ? s_01 : d_01 + 0.5;
      d_02 = d_02 >= s_02 + 360 ? s_02 : d_02 + 0.4;
      d_03 = d_03 >= s_03 + 360 ? s_03 : d_03 + 0.2;
      load_img_01.style.transform = `rotate(${d_01}deg)`;
      load_img_02.style.transform = `rotate(${d_02}deg)`;
      load_img_03.style.transform = `rotate(${d_03}deg)`;
      load_time.innerText = `${time}`.padStart(2,0);
    } else {
      clearInterval(interval_01);
      clearInterval(interval_02);
    }
  });

}

async function application(ref, get, set, db) {

  let load = await get(ref(db, '/'));
  let json = await load.val();

  setTimeout(() => load_screen(3), 2000);

  console.log(json);


}