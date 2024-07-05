import { useCallback, useContext } from "react";
import { MeetRoomContext } from "../context/createContext";
import { ParticipantsStreamsInterface } from "../_helpers";

import { theme } from "antd";
import { MyButton } from "./MyButton";
import { BsMic, BsMicMute } from "react-icons/bs";
import styles from "../_styles/OffScreenStreamers.module.css";

export const OffScreenStreamers: React.FC<any> = ({streamers}) => {

    const {
        token: { 
            colorBgContainer, 
            borderRadiusLG, 
            boxShadow,
        },
    } = theme.useToken();

    const { setParticipantsStreams } = useContext(MeetRoomContext);

    const toggleStream = useCallback((kind: string, streamer: ParticipantsStreamsInterface) => {
        if (!setParticipantsStreams) return;
        setParticipantsStreams((prevValues: ParticipantsStreamsInterface[]) => {
            return prevValues.map((item: ParticipantsStreamsInterface) => {
                if (item.id === streamer.id) {
                    const track = item.remoteStream.getTracks().find(track => track.kind === kind);
                    if (track) track.enabled = !track.enabled;
                    return { ...item, remoteStream: item.remoteStream }
                }
                return item
            });
        });
    }, []);
    
    return (
        <div 
            className={styles.container}
            style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                boxShadow: boxShadow,
            }}
        >
            {
                streamers.map((item: any, index: number) => (
                    <div key={index} className={styles.itemWrapper}>
                        <span>{item.username}</span>
                        <div>
                            <MyButton 
                                size="small"
                                colorType="default"
                                icon={item?.remoteStream.getAudioTracks()[0]?.enabled === true ? <BsMic /> : <BsMicMute />}
                                onClick={() => toggleStream("audio", item)}
                            />
                        </div>
                    </div>
                ))
            }
        </div>
    )
};