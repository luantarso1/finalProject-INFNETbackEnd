import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const allCourses = document.getElementById("allCourses");
const myCourses = document.getElementById("myCourses");
const deleteUser = document.getElementById("deleteUser");
const logout = document.getElementById("logout");
const back = document.getElementById("back");
const info = document.getElementById("info");
const home = document.getElementById("home");
let studentName = sessionStorage.getItem("studentName");


allCourses.addEventListener("click", getCourses);
myCourses.addEventListener("click", getMyCourses);
deleteUser.addEventListener("click", deleteUsers);
logout.addEventListener("click", doLogout);
info.addEventListener("click", getStudentInfo);
home.addEventListener("click", goHome);
back.addEventListener("click", doLogout);

window.onload = function(){
    let message = "Olá! seja bem vindo, " + studentName;

    document.getElementById('helloMessage').innerHTML = message;
    document.getElementById('name').innerHTML = studentName;
};

function goHome() {
    let x = document.getElementById("infopage");
    x.style.display = "none";

    let y = document.getElementById("homepage");
    y.style.display = "block";
}

function getStudentInfo(){
    axios.get('/getStudents/'+studentName).then(function(response) {
        let data = response.data
        let text = `<form id="formData">
        <label for="name">Nome completo</label>
        <input type="text" id="name" name="name" placeholder="Digite seu nome completo" value="`+data.name+`">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" placeholder="Digite seu melhor e-mail" value="`+data.email+`" readonly>
        <label for="phone">Celular</label>
        <input type="phone" id="phone" name="phone" placeholder="XX XXXXX-XXXX" value="`+data.phone+`">
        <label for="password">Senha</label>
        <input type="password" id="password" name="password" placeholder="Digite uma senha" value="`+data.password+`">
        <label for="confirm">Confirme sua senha</label>
        <input type="password" id="confirm" name="confirm" placeholder="Repita a senha">
        <br><br>
        <div>
            <button id="saveBut" class="saveEdit" type="submit"> Salvar Alterações</button>
        </div>
        </form>`

        let x = document.getElementById("infopage");
        x.innerHTML = text;
        x.style.display = "block";

        let y = document.getElementById("homepage");
        y.style.display = "none";

        const form = document.getElementById("formData");
        form.addEventListener("submit", editInfo);

    })
}

function editInfo(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);
    const formDataObj = {};
    myFormData.forEach((value, key) => (formDataObj[key] = value));

    axios.put('/updateStudents', formDataObj).then(function (response) {
        let name = response.data.name

        sessionStorage.setItem("studentName", name);
        alert('Informações atualizadas com sucesso!');
        location.reload();
        
    }).catch(function(error) {
        alert(error);
    })
}

function getCourses() {
    axios.get('/students/getCourses').then(function(response) {
        let data = response.data
        let text = `<div class="main-content">`
        for (let x in data) {
            text += `<button class="accordion">` + data[x].title + `</button>
            <div class="panel">
            <p>` + data[x].description + `</p><br>
            <button class="registerCourse"> Cadastrar em curso</button>
            </div>`
        }
        text += `</div>`
        document.getElementById("demo").innerHTML = text;

        activateElements(data);
    })
    .catch(function(error) {
        alert(error);
    })
    .finally(function() {
    });
}

function getMyCourses() {
    axios.get('/students/getMyCourses/' + studentName).then(function(response) {
        let data = response.data
        if(data.length === 0 || data === undefined) {
            let text = `<div class="main-content">
            <div class="info">
            <p>Você ainda não tem nenhum curso cadastrado no sistema</p>
            </div></div>`

            document.getElementById("demo").innerHTML = text;
        } else {
            let text = `<div class="main-content">`
            for (let x in data) {
                text += `<button class="accordion">` + data[x].title + `</button>
                <div class="panel">
                <p>` + data[x].description + `</p><br>
                <button class="deleteCourse"> Desistir do curso</button>
                </div>`
            }
            text += `</div>`
            document.getElementById("demo").innerHTML = text;

            activateElements(data);
        }
    })
    .catch(function(error) {
        console.log(error);
    })
    .finally(function() {
    });
}

function deleteUsers() {
    axios.delete('/students/deleteStudents/' + studentName).then(function (response) {
        alert('Aluno deletado com sucesso!')
        window.location.href = '/'
    })
    .catch(function (error) {
        alert(error.response.data)
    });
}

function doLogout(){
    window.location.href = '/'
}

function activateElements(data) {
    const acc = document.getElementsByClassName("accordion")
    const reg = document.getElementsByClassName("registerCourse")
    const del = document.getElementsByClassName("deleteCourse")

    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    for (var i = 0; i < reg.length; i++) {
        let index = i;
    
        reg[i].addEventListener("click", function() {
            axios.post('/students/addCourses/' + studentName, data[index]).then(function (response) {
                alert('Curso cadastrado com sucesso!')
            })
            .catch(function (error) {
                alert(error.response.data)
            });
        });
    }

    for (var i = 0; i < del.length; i++) {
        let index = i;
        del[i].addEventListener("click", function() {
            axios.delete('/students/removeCourses/' + studentName, { data: data[index]} ).then(function (response) {
                alert('Curso deletado com sucesso!')
                location.reload();
            })
            .catch(function (error) {
                alert(error.response.data)
            });
        });
    }

}