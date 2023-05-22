const fs = require('fs');
const path = require('path')

function getCoursesPromise() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../model/courses.json'), 'utf8', (error,data) => {
            if(error) {
                reject(error);
            } else {
                let courses = JSON.parse(data);
                resolve(courses);
            }
        });
    });
}

const getCourses = (req,res) => {
    getCoursesPromise(req.body).then(courses => res.status(200).json(courses))
    .catch(error => res.status(500).send(error.message))
}

function getMyCoursesPromise(name){
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../model/'+ name +'.json'), 'utf8', (error,data) => {
            if(error) {
                reject(error);
            } else {
                let courses = JSON.parse(data);
                resolve(courses);
            }
        });
    });
}

const getMyCourses = (req,res) => {
    getMyCoursesPromise(req.params.name).then(courses => res.status(200).json(courses))
    .catch(error => res.status(500).send(error.message))
}

function addCoursesPromise(course, student) {
    return new Promise((resolve, reject) => {
        
        fs.readFile(path.join(__dirname, '../model/'+student+'.json'), 'utf8', (error,data) => {
            if (error) {
                reject(error);
            } else {
                let courses = JSON.parse(data)

                if(courses.some(e => e.title === course.title)) {
                    reject(new Error('Você já está cadastrado neste curso'))
                } else {
                    courses.push(course)

                    fs.writeFile(path.join(__dirname, '../model/'+student+'.json'), JSON.stringify(courses), (error) => {
                        if(error) reject(error);
                        else {
                            resolve(course);
                        }
                    });
                }
            }
        });
    })
}

const addCourses = (req,res) => {
    addCoursesPromise(req.body, req.params.name).then(course => res.status(200).json(course))
    .catch(error => res.status(500).send(error.message))
}

function deleteCoursesPromise(course, student) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../model/'+student+'.json'), 'utf8', (error,data) => {
            if (error) {
                reject(error);
            } else {
                let courses = JSON.parse(data)

                if(courses.some(e => e.title === course.title)) {
                    const value = courses.find(element => element.title === course.title);
                    var index = courses.indexOf(value);

                    if (index > -1) {
                        courses.splice(index, 1);
                    }

                    fs.writeFile(path.join(__dirname, '../model/'+student+'.json'), JSON.stringify(courses), (error) => {
                        if(error) reject(error);
                        else {
                            resolve(course);
                        }
                    });

                    resolve(course);
                } else {
                    reject(new Error('lalala'));
                }
            }
        });
    });
}

const deleteCourses = (req,res) => {
    deleteCoursesPromise(req.body, req.params.name).then(course => res.status(200).json(course))
    .catch(error => res.status(500).send(error.message))
}

module.exports = {getCoursesPromise, getCourses, getMyCoursesPromise, getMyCourses, addCoursesPromise, addCourses, deleteCoursesPromise, deleteCourses}