"use server";

import {AnimeWatchData, DbUtil} from "@/lib/dbUtil";

async function query(sql: string, params: any) {
    const stmt = DbUtil.db.prepare(sql);
    return stmt.all(params);
}

async function updateAnimeWatch(user_id: string, anime_id: string, current_episode: string, current_progress: number) {
    if (!user_id || !anime_id || !current_episode || !current_progress) return;

    // If anime watch exists, update it else create it
    const stmt = DbUtil.db.prepare("SELECT * FROM anime_watch WHERE user_id = ? AND anime_id = ?");
    const animeWatch: AnimeWatchData = stmt.get(user_id, anime_id) as AnimeWatchData;
    if (animeWatch) {
        const stmt = DbUtil.db.prepare("UPDATE anime_watch SET current_episode = ?, current_progress = ? WHERE id = ?");
        stmt.run(current_episode, current_progress, animeWatch.id);
    } else {
        const stmt = DbUtil.db.prepare("INSERT INTO anime_watch (id, user_id, anime_id, current_episode, current_progress) VALUES (?, ?, ?, ?, ?)");
        stmt.run(user_id, anime_id, current_episode, current_progress);
    }
}

export {query, updateAnimeWatch};
