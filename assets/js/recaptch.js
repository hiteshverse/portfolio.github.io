

const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

var onloadCallback = function () {

  grecaptcha.render(document.getElementById('html_element'), {
    'sitekey': '6Ldn6E8qAAAAAE22jjvXhDM_86pIJnK3z77Vl11x'
  });

};


const script = document.createElement('script');

script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
script.async = true;
script.defer = true;

document.body.append(script);

const result = document.getElementById('result');

formBtn.addEventListener('click', (event) => {

  event.preventDefault();

  const response = grecaptcha.getResponse();

  if (!response) {
    result.innerText = 'Enter Captcha';
    return;
  }
  formBtn.setAttribute("disabled", "");

  SendEmail();
})

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

async function SendEmail() {
  const formData = new FormData(document.getElementById('form'));
  const formObj = Object.fromEntries(formData);

  delete formObj['g-recaptcha-response'];
  formObj.access_key = '43a1e5d4-e947-47e3-bfa3-78ac3434bd51';

  const json = JSON.stringify(formObj);
  await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: json
  }).then((res) => {
    if (res.status == 200) {
      result.style.color = 'green';
      result.innerText = "Successed";
    }
    else {
      throw new Error('Server Error');
    }
  }).catch(e => {
    console.log(e);
    result.style.color = 'red';
    result.innerText = 'Not Sended';
    formBtn.removeAttribute("disabled");
  })
}