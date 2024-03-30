import mysql2 from 'mysql2';

export type TFile = { id: string, type: string, name: string, addedAt: number, lastUsed: number }
class MySQLExecutor {
    private connection: mysql2.Connection | null = null;
    constructor() {
        this.Connect();
    }

    async Connect() {
        console.log("[MySQLExecutor] Connection.")
        this.connection = await mysql2.createConnection({
            host: 'localhost',
            user: process.env.NITRO_DB_USER || 'root',
            password: process.env.NITRO_DB_PASS,
            database: process.env.NITRO_DB_DB || 'vrp',
        });
    }

    async GetAllFiles() {
        return new Promise((done, reject) => {
            if(!this.connection) return void reject(new Error("DB not connected"));
            this.connection.query(`select * from web_files;`, (err, response) => {
                if(err) reject(err);
                else done(response);
            });
        })
    }

    GetFileById(id: string) {
        return new Promise((done: (file: TFile | undefined) => void, reject) => {
            if(!this.connection) throw new Error("DB not connected");
            return this.connection.query(`select * from web_files where id = '${id}';`, (err, response: (TFile)[] | undefined) => {
                if(err) reject(err);
                else done(response?.at(0));
            })
        });
    }

    UpdateFileLastUsed(id: string) {
        return new Promise((done, reject) => {
            if(!this.connection) throw new Error("DB not connected");
            return this.connection.query(`update web_files set lastUsed = ${Date.now()} where id = '${id}';`, (err) => {
                if(err) reject(err);
                else done(null);
            })
        });
    }

    CreateFile(id: string, name: string, type: string, size: number) {
        return new Promise((done, reject) => {
            if(!this.connection) throw new Error("DB not connected");
            this.connection.query(`insert into web_files (id, name, addedAt, type, size) values ('${id}', '${name}', ${Date.now()}, '${type}', ${size})`, (err, response) => {
                if(err) reject(err);
                else done(response);
            })
        })
    }

    DeleteFileById(id: string) {
        if(!this.connection) throw new Error("DB not connected");
        this.connection.query(`delete from web_files where id = '${id}';`);
    }
}

export const MySQL = new MySQLExecutor();