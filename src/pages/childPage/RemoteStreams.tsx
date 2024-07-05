import { useContext, useEffect, useMemo, useRef } from "react";
import { GlobalContext, MeetRoomContext } from "../../context/createContext";

import { RemoteStreamCtrl } from "./RemoteStreamCtrl";
import styles from "../../_styles/MeetRoom.module.css";

import { ParticipantsStreamsInterface, UserInfoInterface } from "../../_helpers";

export const RemoteStreams = () => {
    const remoteStreamRef = useRef<HTMLVideoElement | null>(null);

    const { windowDimension } = useContext(GlobalContext);
    const { participantsStreams } = useContext(MeetRoomContext);

    const onScreenWidthMaxStreamers = useMemo(() => {
        switch (true) {
            case windowDimension.width >= 1088:
                return 3;
            case windowDimension.width <= 1087 && windowDimension.width > 820:
                return 3;
            case windowDimension.width <= 820:
                return 1;
            default:
                return 1;
        }
    }, [windowDimension.width]);

    // limit the streamer on the screen
    const onScreenStreamers = useMemo(() => {
        return participantsStreams?.slice(0, onScreenWidthMaxStreamers);
    }, [participantsStreams, onScreenWidthMaxStreamers]);

    // render username
    const StreamerUsername: React.FC<UserInfoInterface> = ({username}) => {
        return (
            <div className={styles.streamerUsernameWrapper}>
                <span>{username}</span>
            </div>
        )
    };

    // display other stramers
    useEffect(() => {
        if (!participantsStreams) return;

        for (let index = 0; index < participantsStreams?.length; index++) {
            const participant = participantsStreams[index];
            if (remoteStreamRef.current) remoteStreamRef.current.srcObject = participant.remoteStream;
        }
    }, [participantsStreams, remoteStreamRef.current]);

    return (
        <>
        {
            onScreenStreamers && onScreenStreamers?.map((item: ParticipantsStreamsInterface, index: number) => 
                <div key={index} className={styles.videoWrapper} >
                    <RemoteStreamCtrl streamerData={item} />
                    <StreamerUsername username={item?.username} />
                    <video 
                        autoPlay 
                        playsInline 
                        muted={false} 
                        ref={remoteStreamRef}
                        width={"100%"}
                        height={"100%"}
                        style={{
                            borderRadius: 16,
                            objectFit: "cover"
                        }}
                    /> 
                </div>
            )
        }
        </>
    );
};