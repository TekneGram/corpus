const db = require('./index');

class NewProject {
    constructor () {

    }

    static addNewProject(title) {
        return new Promise((resolve, reject) => {
            const dbQuery = db.prepare(`
                INSERT INTO project (project_name) VALUES (?)
            `, [title], (error) => {
                if (error) {
                    console.error(error.message);
                    reject('Database error');
                    return;
                }
            });
    
            dbQuery.run((error) => {
                if (error) {
                    reject("There was an error inserting the project");
                } else {
                    resolve("Project added successfully");
                }
            });
    
            dbQuery.finalize();
        })
    }
}

module.exports = NewProject;