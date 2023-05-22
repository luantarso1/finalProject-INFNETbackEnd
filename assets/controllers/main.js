import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const form = document.getElementById('formData');
const registerBut = document.getElementById('regButtom');
form.addEventListener("submit", signIn);
registerBut.addEventListener("click", register);

function signIn(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);
    const formDataObj = {};
    myFormData.forEach((value, key) => (formDataObj[key] = value));

    axios.post('/signin', formDataObj).then(function (response) {
        sessionStorage.setItem("studentName", response.data.name);
        window.location.href = '/students'
    })
    .catch(function (error) {
        alert(error.response.data)
    });
}

function register() {
    window.location.href = '/register'
}

