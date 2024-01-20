import {ANIME, META} from "@consumet/extensions";
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getProvier(provider: string) {
    switch (provider.toLowerCase()) {
        case "9anime":
            return new ANIME.NineAnime();
        case "gogoanime":
            return new ANIME.Gogoanime();
        case "anify":
            return new ANIME.Anify();
        case "animefox":
            return new ANIME.AnimeFox();
        case "animepahe":
            return new ANIME.AnimePahe();
        case "animesaturn":
            return new ANIME.AnimeSaturn();
        case "bilibili":
            return new ANIME.Bilibili();
        case "crunchyroll":
            return new ANIME.Crunchyroll();
        case "marin":
            return new ANIME.Marin();
        case "zoro":
            return new ANIME.Zoro();
        default:
            return new ANIME.Gogoanime();
    }
}

export function getAnilist(provider: string | undefined) {
    if (process.env.PROXY_ENABLED === "false") return new META.Anilist(getProvier(provider || "Gogoanime") as any);

    return new META.Anilist(getProvier(provider || "Gogoanime") as any, {
        url: (process.env.PROXY_URL as string).includes(",") ? (process.env.PROXY_URL as string).split(",") : (process.env.PROXY_URL as string),
        key: process.env.PROXY_KEY as string,
        rotateInterval: parseInt(process.env.PROXY_ROTATE_INTERVAL as string)
    });
}