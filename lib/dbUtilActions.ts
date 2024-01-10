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
