import sqlite from "better-sqlite3";
import fs from "fs";

interface AnimeWatchData {
    id: string;
    user_id: string;
    anime_id: string;
    current_episode: string;
    current_progress: number;
    created_at: string;
    updated_at: string;
}

export {type AnimeWatchData};


export class DbUtil {
    static db = sqlite("main.db");

    static init = () => DbUtil.db.exec(fs.readFileSync("schema.sql", "utf8"));
}