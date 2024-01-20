import {NextRequest, NextResponse} from "next/server";
import cacheData from "memory-cache";
import {IAnimeEpisode, META} from "@consumet/extensions";
import {getAnilist, getProvier} from "@/lib/utils";

export interface EpsResponse {
    sub: IAnimeEpisode[] | null,
    dub: IAnimeEpisode[] | null,
    provider: string,
    responseTime: number
}

export const GET = async (req: NextRequest, params: { params: { animeid: string } }) => {
    if (cacheData.get(req.nextUrl.href)) return NextResponse.json<EpsResponse>(cacheData.get(req.nextUrl.href), {status: 200});
    const start = performance.now();

    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    const animeId = params.params.animeid;

    const anilist = getAnilist(searchParams.get('provider') || undefined)

    // Get episodes
    // Subbed
    const subEps = await anilist.fetchEpisodesListById(animeId, false, true).catch(() => null);
    // Dubbed
    const dubEps = await anilist.fetchEpisodesListById(animeId, true, true).catch(() => null);

    const data: EpsResponse = {
        sub: subEps,
        dub: dubEps,
        provider: anilist.provider.name,
        responseTime: performance.now() - start
    }

    cacheData.put(req.nextUrl.href, data, 1000 * 60 * parseInt(process.env.CACHE_TIME as string));
    return NextResponse.json<EpsResponse>(data, {status: 200})
}
