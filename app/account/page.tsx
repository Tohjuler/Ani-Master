import {Header} from "@/components/header";
import Footer from "@/components/footer";
import {getPageSession} from "@/lib/lucia";
import AccSettings from "@/components/accSettings";
import ProviderStatus from "@/lib/providerStatus";
import {query} from "@/lib/dbUtilActions";
import {redirect} from 'next/navigation'
import Image from "next/image";
import * as React from "react";

export default async function Account({params, searchParams}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getPageSession();

    if (!session) redirect('/')

    let settings: any = await query('SELECT default_provider_anime, default_dubbed_anime, notify_ntfy_url, notify_ntfy_token, notify_discord_webhook FROM user WHERE id = ?', [session.user.userId])

    if (settings.length === 1) settings = settings[0]

    return (
        <main className="">
            <Header session={session} page="home"/>
            <div className="h-fit mt-14">
                <div className="mb-10 p-2 rounded bg-gray-700 w-fit mx-auto">
                    <div className="inline-flex">
                        <Image
                            src={"/default_avatar.png"}
                            alt="Avatar"
                            className="rounded-full"
                            width={65}
                            height={65}
                        />
                        <h1 className="mt-5">{session.user.username}</h1>
                    </div>

                    <div className="mt-5">

                    </div>
                </div>

                <AccSettings session={{...session, settings}}
                             onlineProviders={await ProviderStatus.getOnlineAnimeProvider()}/>
            </div>
            <Footer/>
        </main>
    )
}
