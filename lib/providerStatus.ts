import { PROVIDERS_LIST } from "@consumet/extensions";

export default class ProviderStatus {

    private static lastUpdate: Date;
    private static onlineAnimeProvider: string[];

    public static async getOnlineAnimeProvider(): Promise<string[]> {
        if (this.lastUpdate && this.lastUpdate.getTime() > (new Date().getTime() - 3600000))
            return this.onlineAnimeProvider.length === 0 ? ['No provider found'] : this.onlineAnimeProvider;

        this.onlineAnimeProvider = [];
        for (const provider of PROVIDERS_LIST.ANIME) {
            if (await provider.search('naruto').catch(() => false))
                this.onlineAnimeProvider.push(provider.name);
        }

        this.lastUpdate = new Date();
        return this.onlineAnimeProvider.length === 0 ? ['No provider found'] : this.onlineAnimeProvider;
    }
}