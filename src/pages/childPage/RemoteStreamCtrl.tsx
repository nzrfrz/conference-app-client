import { useCallback, useContext } from "react";
import { 
    VideoControlButton,
    ParticipantsStreamsInterface, 
} from "../../_helpers";
import { MeetRoomContext } from "../../context/createContext";

import { MyButton } from "../../_components";
import { 
    BsMic, 
    BsMicMute, 
    BsCameraVideo, 
    BsCameraVideoOff 
} from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";
import styles from "../../_styles/MeetRoom.module.css";

export const RemoteStreamCtrl: React.FC<VideoControlButton> = ({streamerData}) => {

    const { myInfo, setParticipantsStreams } = useContext(MeetRoomContext);

    const toggleStream = useCallback((kind: string) => {
        if (!setParticipantsStreams) return;
        setParticipantsStreams((prevValues: ParticipantsStreamsInterface[]) => {
            return prevValues.map((item: ParticipantsStreamsInterface) => {
                if (item.id === streamerData.id) {
                    const track = item.remoteStream.getTracks().find(track => track.kind === kind);
                    if (track) track.enabled = !track.enabled;
                    return { ...item, remoteStream: item.remoteStream }
                }
                return item
            });
        });
    }, []);

    return (
        <div className={styles.videoControlWrapper}>
            <MyButton 
                colorType="default"
                icon={streamerData?.remoteStream.getVideoTracks()[0]?.enabled === true ? <BsCameraVideo /> : <BsCameraVideoOff />}
                onClick={() => toggleStream("video")}
            />
            <MyButton 
                colorType="default"
                icon={streamerData?.remoteStream.getAudioTracks()[0]?.enabled === true ? <BsMic /> : <BsMicMute />}
                onClick={() => toggleStream("audio")}
            />
            <MyButton 
                colorType="error"
                icon={<ImPhoneHangUp />}
                style={{ display: myInfo?.isHost === false ? "none" : "block" }}
            />
        </div>
    );
};