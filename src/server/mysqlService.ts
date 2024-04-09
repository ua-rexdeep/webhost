import mysql2 from 'mysql2/promise';

export type TFile = { id: string, type: string, name: string, addedAt: number, lastUsed: number }
class MySQLExecutor {
    private connection: mysql2.Connection | null = null;
    constructor() {
        // this.Connect();
    }

    async Connect() {
        if(this.connection) return;
        console.log("[MySQLExecutor] Connection.")
        this.connection = await mysql2.createConnection({
            host: 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS,
            database: process.env.DB_DB || 'vrp',
        });
    }

    async GetAllFiles() {
        if(!this.connection) throw new Error("DB not connected");
        const [response] = await this.connection.query(`select * from web_files;`);
        return response;
    }

    // (TFile)[] | undefined
    async GetFileById(id: string) {
        if(!this.connection) throw new Error("DB not connected");
        const [response, fields] = await this.connection.query(`select * from web_files where id = ?;`, [id]);
        return (response as TFile[])?.at(0);
    }

    UpdateFileLastUsed(id: string) {
        if(!this.connection) throw new Error("DB not connected");
        return this.connection.query(`update web_files set lastUsed = ? where id = ?;`, [Date.now(), id]);
    }

    async CreateFile(id: string, category: string, type: string, size: number) {
        if(!this.connection) throw new Error("DB not connected");
        const [response] = await this.connection.query(`insert into web_files (id, category, addedAt, type, size) values (?, ?, ?, ?, ?)`, [id, category, Date.now(), type, size]);
        return response;
    }

    DeleteFileById(id: string) {
        if(!this.connection) throw new Error("DB not connected");
        this.connection.query(`delete from web_files where id = ?;`, [id]);
    }

    async GetAllCategories(){
        if(!this.connection) throw new Error("DB not connected");
        const [response] = await this.connection.query(`SELECT web_categories.name, COUNT(web_files.id) as num_files
                                    FROM web_categories
                                    LEFT JOIN web_files ON web_categories.name = web_files.category
                                    GROUP BY 1 ORDER BY 2 DESC;`);
        return response;
    }

    async GetFilesByCategory(category: string) {
        if(!this.connection) throw new Error("DB not connected");
        const [response] = await this.connection.query(`select * from web_files where category = '${category}';`);
        return response;
    }

    CreateCategory(name: string) {
        if(!this.connection) throw new Error("DB not connected");
        this.connection.query(`insert into web_categories (name) values (?);`, [name]);
    }
}

export const MySQL = new MySQLExecutor();