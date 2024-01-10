"use client";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch"
import {Input} from "@/components/ui/input";
import {updateAccSetting, updateNotificationSettings} from "@/lib/dbUtilActions";
import {Button} from "@/components/ui/button";

export default function AccSettings(props: { session: any, onlineProviders: string[] }) {

    return (
        <div className="mx-auto items-center justify-center w-fit min-w-[500px]">
            <div className="p-2">
                <h1 className="mb-4 font-bold text-[20px]">Anime</h1>

                <Label htmlFor="provider">Default Provider</Label>
                <Select
                    defaultValue={props.session.settings.default_provider_anime}
                    onValueChange={(value) => updateAccSetting(props.session.user.userId, 'default_provider_anime', value)}
                >
                    <SelectTrigger id="provider" className="w-[180px] mb-3">
                        <SelectValue placeholder="Provider"/>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            props.onlineProviders.filter((item, pos) => props.onlineProviders.indexOf(item) == pos).map((provider) => {
                                return (
                                    <SelectItem key={provider} value={provider.toLowerCase()}>{provider}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="default-lang"
                        defaultChecked={props.session.settings.default_dubbed_anime}
                        onCheckedChange={(checked) => updateAccSetting(props.session.user.userId, 'default_dubbed_anime', checked ? "1" : "0")}
                    />
                    <Label htmlFor="default-lang">Auto Select
                        Dub</Label>
                </div>
            </div>

            <div className="mt-10 p-2">
                <h1 className="mb-5 font-bold text-[20px]">Notifications</h1>

                <form action={(e) => updateNotificationSettings(props.session.user.userId, e)}>
                    <div className="ml-2">
                        <h4 className="font-bold mb-2">NTFY</h4>

                        <Label htmlFor="notify_ntfy_url">Url</Label>
                        <Input
                            defaultValue={props.session.settings.notify_ntfy_url || ""}
                            className="max-w-[400px]"
                            type="url"
                            name="notify_ntfy_url"
                            id="notify_ntfy_url"
                            placeholder="Url..."
                        />

                        <div className="mt-2">
                            <Label htmlFor="notify_ntfy_token">Auth Token</Label>
                            <Input
                                defaultValue={props.session.settings.notify_ntfy_token || ""}
                                className="max-w-[400px]"
                                type="token"
                                name="notify_ntfy_token"
                                id="notify_ntfy_token"
                                placeholder="Token..."/>
                        </div>
                    </div>

                    <div className="ml-2 mt-5">
                        <h4 className="font-bold mb-2">Discord Webhook</h4>

                        <Label htmlFor="notify_discord_token">Url</Label>
                        <Input
                            defaultValue={props.session.settings.notify_discord_webhook || ""}
                            className="max-w-[400px]"
                            type="url"
                            name="notify_discord_token"
                            id="notify_discord_token"
                            placeholder="Url..."/>
                    </div>

                    <div className="mt-5">
                        <Button type="submit">Update</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}