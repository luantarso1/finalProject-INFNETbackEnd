const {v4:uuidv4} = require('uuid')
const fs = require('fs');
const path = require('path');
const { log } = require('console');

function getStudentsPromise(username) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../model/students.json'), 'utf8', (error,data) => {
            if(error) {
                reject(error);
            } else {
                let students = JSON.parse(data);
                if(students.some(e => e.name === username)) {
                    const studentInfo = students.find(element => element.name === username);
                    resolve(studentInfo);
                } else {
                    reject(new Error('Não encontrado'))
                }
            }
        });
    });
}

const getStudents = (req,res) => {
    getStudentsPromise(req.params.name).then(students => res.status(200).json(students))
    .catch(error => res.status(500).send(error.message))
}

function addStudentPromise(student) {
    return new Promise((resolve,reject) => {
        fs.readFile(path.join(__dirname, '../model/students.json'), 'utf8', (err, data) => {
            if (err) {
              reject(err);
            }else {    
                let students = JSON.parse(data)

                if(students.some(e => e.email === student.email)) {
                    reject(new Error('O e-mail já está sendo usado'))
                }

                const id = uuidv4()
                const newStudent = {id, ...student}

                students.push(newStudent)

                fs.writeFile(path.join(__dirname, '../model/students.json'), JSON.stringify(students), (error) => {
                    if(error) reject(error);
                    else {
                        fs.writeFile(path.join(__dirname, '../model/'+ newStudent.name +'.json'), '[]', function (err) {
                            if (err) throw err;
                            resolve(newStudent);
                        });
                    }
                })
            }
        });
    });
}

const addStudent = (req, res) =>{
    const student = req.body

    addStudentPromise(student)
    .then(newStudent => res.status(200).json(newStudent))
    .catch(err => res.status(500).send(err.message))
}

function updateStudentPromise(student) {
    return new Promise((resolve,reject) => {
        fs.readFile(path.join(__dirname, '../model/students.json'), 'utf8', (err, data) => {
            if (err) {
              reject(err);
            }
            let students = JSON.parse(data)

            if(students.some(e => e.email === student.email)) {
                try{
                    const value = students.find(element => element.email === student.email);
                    var index = students.indexOf(value);
                    var id = value.id;
                    var email = value.email;
                    var std;
                    if (index > -1) {
                        students.splice(index, 1);
                        const updatedStudent = {id, email, ...student}
                        std = updatedStudent
                        students.push(updatedStudent)

                        if(value.name != updatedStudent.Name){
                            fs.rename(path.join(__dirname, '../model/'+ value.name +'.json'), path.join(__dirname, '../model/'+ updatedStudent.name +'.json'), () => {
                                console.log("\nFile Renamed!\n");
                            });
                        }
                    }

                    fs.writeFile(path.join(__dirname, '../model/students.json'), JSON.stringify(students), (error) => {
                        if(error) {
                            console.log(error)
                            reject(error);
                        }
                        else {
                            resolve(std);
                        }
                    });
                }
                catch(error) {
                    console.log(error)
                    reject(error);
                }
                

            } else {
                reject(new Error('erro'));
            }
        });
    });
}

const updateStudents = ( req, res) => {
    updateStudentPromise(req.body)
    .then(studentInfo => res.status(200).json(studentInfo))
    .catch(err => res.status(500).send(err.message))
}

function loginPromise(student) {
    return new Promise((resolve,reject) => {
        fs.readFile(path.join(__dirname, '../model/students.json'), 'utf8', (err, data) => {
            if (err) {
              reject(err);
            }else {    
                let students = JSON.parse(data)

                
                if(students.some(e => e.email === student.email)) {
                    const studentInfo = students.find(element => element.email === student.email);
                    if(studentInfo.password === student.password){
                        resolve(studentInfo);
                    } else {
                        reject(new Error('A senha informada está incorreta.'))
                    }
                        
                } else {
                    reject(new Error('O aluno não foi encontrado.'))
                }
            }
        });
    });
}

const login = ( req, res) => {
    const student = req.body;

    loginPromise(student)
    .then(studentInfo => res.status(200).json(studentInfo))
    .catch(err => res.status(500).send(err.message))
}

function deleteUsersPromise(userName) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../model/students.json'), 'utf8', (error,data) => {
            if (error) {
                reject(error);
            } else {
                let students = JSON.parse(data)

                if(students.some(e => e.name === userName)) {
                    const value = students.find(element => element.name === userName);
                    var index = students.indexOf(value);

                    if (index > -1) {
                        students.splice(index, 1);
                        fs.unlink(path.join(__dirname, '../model/'+userName+'.json'), (err) => {
                            if (err) throw err;
                            console.log('file was deleted');
                        });
                    }

                    fs.writeFile(path.join(__dirname, '../model/students.json'), JSON.stringify(students), (error) => {
                        if(error) reject(error);
                        else {
                            resolve(students);
                        }
                    });

                } else {
                    reject(new Error('erro'));
                }
            }
        });
    });
}

const deleteUsers = (req,res) => {
    deleteUsersPromise(req.params.name)
    .then(() => res.status(200).send('OK'))
    .catch(err => res.status(500).send(err.message))
}

module.exports = {getStudentsPromise, getStudents, addStudentPromise, addStudent, login, loginPromise, deleteUsersPromise, deleteUsers, updateStudentPromise, updateStudents}