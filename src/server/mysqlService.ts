import mysql2 from 'mysql2/promise';

export type TFile = { id: string, type: string, name: string, addedAt: number, lastUsed: number }
class MySQLExecutor {
    private connection: mysql2.Connection | null = null;
    private waitConnection: Promise<any> | null = null;
    constructor() {
        // this.Connect();
    }

    async CheckConnection(){
        if(this.waitConnection) return await this.waitConnection;
        if(!this.connection) throw new Error("DB not first connected yet");
        if((this.connection as any).connection._closing == true) {
            this.waitConnection = null;
            this.Connect();
            throw new Error("No DB connection");
        } 
        return true;
    }

    async Connect() {
        console.log("[MySQLExecutor] Connection.", typeof(this.connection), typeof(this.waitConnection))
        if(this.connection && !this.waitConnection) this.connection.destroy();
        try {
            this.waitConnection = mysql2.createConnection({
                host: 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASS,
                database: process.env.DB_DB || 'vrp',
            });;
            this.connection = await this.waitConnection;
            this.waitConnection = null;
        } catch(err) {
            this.waitConnection = null;
            throw err;
        }
        console.log("[MySQLExecutor] Connected.");
    }

    async GetAllFiles() {
        await this.CheckConnection();
        const [response] = await this.connection!.query(`select * from web_files;`);
        return response;
    }

    // (TFile)[] | undefined
    async GetFileById(id: string) {
        await this.CheckConnection();
        const [response, fields] = await this.connection!.query(`select * from web_files where id = ?;`, [id]);
        return (response as TFile[])?.at(0);
    }

    async UpdateFileLastUsed(id: string) {
        await this.CheckConnection();
        return this.connection!.query(`update web_files set lastUsed = ? where id = ?;`, [Date.now(), id]);
    }

    async CreateFile(id: string, category: string, type: string, size: number) {
        await this.CheckConnection();
        const [response] = await this.connection!.query(`insert into web_files (id, category, addedAt, type, size) values (?, ?, ?, ?, ?)`, [id, category, Date.now(), type, size]);
        return response;
    }

    async DeleteFileById(id: string) {
        await this.CheckConnection();
        this.connection!.query(`delete from web_files where id = ?;`, [id]);
    }

    async GetAllCategories(){
        await this.CheckConnection();
        const [response] = await this.connection!.query(`SELECT web_categories.name, COUNT(web_files.id) as num_files
                                    FROM web_categories
                                    LEFT JOIN web_files ON web_categories.name = web_files.category
                                    GROUP BY 1 ORDER BY 2 DESC;`);
        return response;
    }

    async GetFilesByCategory(category: string) {
        await this.CheckConnection();
        const [response] = await this.connection!.query(`select * from web_files where category = '${category}';`);
        return response;
    }

    async CreateCategory(name: string) {
        await this.CheckConnection();
        this.connection!.query(`insert into web_categories (name) values (?);`, [name]);
    }

    async ChangeFileCategory(fileID: string, categoryName: string) {
        await this.CheckConnection();
        console.log('update web_files set category = ? where id = ?;', categoryName, fileID)
        this.connection!.query('update web_files set category = ? where id = ?;', [categoryName, fileID]);
    }
}

export const MySQL = new MySQLExecutor();