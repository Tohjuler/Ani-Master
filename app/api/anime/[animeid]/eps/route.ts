import {NextRequest, NextResponse} from "next/server";
import {getProvier} from "@/app/anime/[anime]/page";
import cacheData from "memory-cache";
import {IAnimeEpisode, META} from "@consumet/extensions";

export interface EpsResponse {
    sub: IAnimeEpisode[] | null,
    dub: IAnimeEpisode[] | null,
    provider: string
}

export const GET = async (req: NextRequest, params: { params: { animeid: string } }) => {
    if (cacheData.get(req.nextUrl.href)) return NextResponse.json<EpsResponse>(cacheData.get(req.nextUrl.href), {status: 200});

    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    const animeId = params.params.animeid;

    const anilist = new META.Anilist(getProvier(searchParams.get('provider') || "Gogoanime"));

    // Get episodes
    // Subbed
    const subEps = await anilist.fetchEpisodesListById(animeId, false, true).catch(() => null);
    // Dubbed
    const dubEps = await anilist.fetchEpisodesListById(animeId, true, true).catch(() => null);

    const data: EpsResponse = {
        sub: subEps,
        dub: dubEps,
        provider: anilist.provider.name
    }

    cacheData.put(req.nextUrl.href, data, 1000 * 60 * 30);
    return NextResponse.json<EpsResponse>(data, {status: 200})
}
