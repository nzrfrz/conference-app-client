import { useContext, useEffect, useRef } from "react";
import { GlobalContext, MeetRoomContext } from "../context/createContext";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useMeetHook } from "../hooks/useMeetHook";
import { SDPInterface, NotifButtonInterface } from "../_helpers";

import { RemoteStreams } from "./childPage/RemoteStreams";
import { OtherStreamers } from "./childPage/OtherStreamers";

import { Space } from "antd";
import { MyButton } from "../_components";
import { ImPhoneHangUp } from "react-icons/im";
import { BsMic, BsMicMute, BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import styles from "../_styles/MeetRoom.module.css";

export const MeetRoom = () => {
    const params = useParams();
    const location = useLocation();

    const myStreamRef = useRef<HTMLVideoElement | null>(null);

    const { 
        api, 
        openNotification 
    } = useContext(GlobalContext);

    const {
        myInfo,
        channel,
        setRoomID,
        isEndedCall,
        offerForHost,
        myMediaStream,
        handleToggleOwnStream,
    } = useContext(MeetRoomContext);

    const { 
        acceptOffer, 
        handleEndedCall,
    } = useMeetHook();

    // button accept and reject inside request notification
    const CustomNotifButton: React.FC<NotifButtonInterface> = ({candidateID, selectedOffer}) => {
        return (
            <Space>
                <MyButton 
                    colorType="error"
                    text="Reject"
                    onClick={() => {
                        api.destroy(candidateID);
                        channel?.trigger("client-offerRejected", selectedOffer);
                        // console.log(selectedOffer);
                    }}
                />
                <MyButton 
                    colorType="success"
                    text="Accept"
                    onClick={() => {
                        api.destroy(candidateID);
                        acceptOffer(selectedOffer);
                    }}
                />
            </Space>
        );
    };
    
    // create notif for host that a new candidate request to join the room
    useEffect(() => {
        offerForHost?.map((offer: SDPInterface) => {
            if (myInfo?.isHost === true && offer?.isRequestReceive === true) {
                openNotification(
                    "info",
                    offer?.offerFrom?.id as string,
                    "Request",
                    `${offer?.offerFrom?.username} wants to join this room`,
                    <CustomNotifButton
                        candidateID={offer?.offerFrom?.id}
                        selectedOffer={offer}
                    />,
                    false,
                    0
                );
            }
        });
    }, [myInfo, offerForHost]);

    // display own stream
    useEffect(() => {
        if (myStreamRef.current) myStreamRef.current.srcObject = myMediaStream as any;
    }, [myMediaStream]);

    // set room id when candidate paste the meet room url
    useEffect(() => {
        if (isEndedCall === false && (location?.state?.isHost === false || location?.state === null)) setRoomID(params?.roomID as string);
    }, [params, location, isEndedCall]);

    // back to lobby when not subscribing to host's channel
    if (channel === null) return ( <Navigate to={"/"} replace={true} /> );

    return (
        <div className={styles.container}>
            <div className={styles.streamWrapper}>
                <div className={styles.videoWrapper} >
                    <video 
                        autoPlay
                        playsInline
                        muted={true}
                        ref={myStreamRef}
                        width={"100%"}
                        height={"100%"}
                        style={{
                            borderRadius: 16,
                            objectFit: "cover"
                        }}
                    />
                </div>
                <RemoteStreams />
            </div>
            <div className={styles.footer}>
                <div>
                    <MyButton 
                        colorType="default"
                        icon={myMediaStream?.getVideoTracks()[0].enabled === true ? <BsCameraVideo /> : <BsCameraVideoOff />}
                        onClick={() => handleToggleOwnStream("video")}
                    />
                    <MyButton 
                        colorType="default"
                        icon={myMediaStream?.getAudioTracks()[0].enabled === true ? <BsMic /> : <BsMicMute />}
                        onClick={() => handleToggleOwnStream("audio")}
                    />
                    <MyButton 
                        colorType="error"
                        icon={<ImPhoneHangUp/>}
                        onClick={() => handleEndedCall()}
                    />
                    <OtherStreamers />
                </div>
            </div>
        </div>
    );
};