"use server";

import {AnimeWatchData, DbUtil} from "@/lib/dbUtil";

async function query(sql: string, params: any) {
    const stmt = DbUtil.db.prepare(sql);
    return stmt.all(params);
}

export interface AnimeWatchDisplayData {
    poster: string,
    title: string,
    episodeNumber: number,
    totalEpisodes: number
}

async function updateAnimeWatch(user_id: string, anime_id: string, current_episode: string, current_progress: number, current_progress_out_of: number, displayData: AnimeWatchDisplayData) {
    if (!user_id || !anime_id || !current_episode || !current_progress) return;

    // If anime watch exists, update it else create it
    const stmt = DbUtil.db.prepare("SELECT * FROM anime_watch WHERE user_id = ? AND anime_id = ?");
    const animeWatch: AnimeWatchData = stmt.get(user_id, anime_id) as AnimeWatchData;
    if (animeWatch && animeWatch.current_episode === current_episode) { // If episode is the same, only update progress
        const stmt = DbUtil.db.prepare("UPDATE anime_watch SET current_progress = ? WHERE user_id = ? AND anime_id = ?");
        stmt.run(current_progress, user_id, anime_id);
    } else if (animeWatch) { // If episode is different, update episode and progress
        const stmt =
            DbUtil.db.prepare("UPDATE anime_watch SET current_episode = ?, current_episode_number = ?, current_episode_poster = ?, current_progress = ?, current_progress_out_of = ?  WHERE user_id = ? AND anime_id = ?");
        stmt.run(current_episode, displayData.episodeNumber, displayData.poster, current_progress, displayData.totalEpisodes, user_id, anime_id);
    } else {
        const stmt =
            DbUtil.db.prepare("INSERT INTO anime_watch (user_id, anime_id, title, total_episodes, current_episode, current_episode_number, current_episode_poster, current_progress, current_progress_out_of) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        stmt.run(user_id, anime_id, displayData.title, displayData.totalEpisodes, current_episode, displayData.episodeNumber, displayData.poster, current_progress, current_progress_out_of);
    }
}

async function updateAccSetting(user_id: string, key: string, value: string) {
    if (!user_id || !key || !value) return;
    if (key.includes(" ")) return;

    const stmt = DbUtil.db.prepare("UPDATE user SET "+key+" = ? WHERE id = ?");
    stmt.run(value, user_id);
}

async function updateNotificationSettings(userId: string, formData: FormData) {
    const rawFormData = {
        ntfyUrl: formData.get('notify_ntfy_url') as string,
        ntfyToken: formData.get('notify_ntfy_token') as string,
        discordUrl: formData.get('notify_discord_token') as string,
    }
    if (!rawFormData) return

    await updateAccSetting(userId, 'notify_ntfy_url', rawFormData.ntfyUrl)
    await updateAccSetting(userId, 'notify_ntfy_token', rawFormData.ntfyToken)
    await updateAccSetting(userId, 'notify_discord_webhook', rawFormData.discordUrl)
}

export {query, updateAnimeWatch, updateAccSetting, updateNotificationSettings};
