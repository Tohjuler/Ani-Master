import { ANIME } from "@consumet/extensions";
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