import Pusher from "pusher-js";
import { UserInfoInterface } from "./typeInterfaces";

export const pusherInit = (userInfo: UserInfoInterface) => {
    return new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        userAuthentication: {
            transport: "ajax",
            endpoint: `${import.meta.env.VITE_BASE_PATH}/pusher/auth-user/`,
            headers: {
                userInfo: JSON.stringify(userInfo)
            }
        },
        channelAuthorization: {
            transport: "ajax",
            endpoint: `${import.meta.env.VITE_BASE_PATH}/pusher/auth-channel/`,
            headers: {
                userInfo: JSON.stringify(userInfo)
            }
        }
    })
};