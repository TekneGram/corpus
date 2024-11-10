const db = require('./index');

class NewProject {
    constructor () {

    }

    static loadAllProjectTitles() {
        return new Promise((resolve, reject) => {
            const dbQuery = db.prepare(`
                SELECT id, project_name FROM project    
            `, (error) => {
                if (error) {
                    console.error("Database error:", error.message);
                    reject('Database error');
                    return;
                }
            });

            dbQuery.all((error, rows) => {
                if (error) {
                    reject("There was an error getting the project titles");
                    return;
                }

                if (rows && rows.length > 0) {
                    resolve(rows);
                } else {
                    reject("No project titles found");
                }
            });

            dbQuery.finalize();
        })
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