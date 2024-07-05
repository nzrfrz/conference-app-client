import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { MeetRoomContext } from "../context/createContext";
import { useLocation, useNavigate } from "react-router-dom";
import { SDPInterface, ProfileSettingInterface, handleCreateAnswer, handleCreateOffer, UserInfoInterface } from "../_helpers";

import * as PusherTypes from "pusher-js";
import { pusherInit } from "../_helpers/pusherInit";

export const useMeetHook = () => {
    const navigateTo = useNavigate();
    const location = useLocation();
    const [formSubmitType, setFormSubmitType] = useState<string>("");

    const {
        setIsLoading,
        roomID,
        setRoomID,
        setIsEndedCall,
        channel,
        setChannel,
        myInfo,
        membersInfo,
        myMediaStream,
    } = useContext(MeetRoomContext);

    const createRoom = async (values: ProfileSettingInterface) => {
        try {
            const results = await axios.post(`${import.meta.env.VITE_BASE_PATH}/create-room/`, { ...values });

            const userInfoPayload = {
                username: values.username,
                isHost: true
            };

            const newChannel = pusherInit(userInfoPayload).subscribe(`presence-${results?.data?.roomID}`) as PusherTypes.PresenceChannel;
            setRoomID(results?.data?.roomID);
            setChannel(newChannel);
            navigateTo(`/meet-room/${results?.data?.roomID}`, { replace: true, state: { isHost: true } });
        } catch (error) {
            console.error("\nError creating room: \n", error);
        }
    };

    const joinRoom = useCallback((values: ProfileSettingInterface) => {
        const userInfoPayload = {
            username: values.username,
            isHost: false
        };

        const joinChannel = pusherInit(userInfoPayload).subscribe(`presence-${roomID}`);
        setChannel(joinChannel as PusherTypes.PresenceChannel);
        if (setIsLoading) setIsLoading(true);
    }, [roomID]);

    const onFinishForm = (values: ProfileSettingInterface, type: string) => {
        if (type === "create") return createRoom(values);
        else return joinRoom(values);
    };

    // host accepting candidate
    const acceptOffer = useCallback((offerer: SDPInterface) => {    
        const selectedPeer = membersInfo.find((data: UserInfoInterface) => data.id === offerer?.offerFrom?.id)?.peerConnection;
        if (!channel || selectedPeer?.iceGatheringState === "complete") return;
        handleCreateAnswer(channel, selectedPeer, myMediaStream, offerer);
    }, [channel, membersInfo, myMediaStream]);

    useEffect(() => {
        if (!channel || membersInfo.length === 0 || myInfo?.isHost === true || location.pathname !== "/") return;
        
        // send offer to all participants
        for (let index = 0; index < membersInfo.length; index++) {
            const member = membersInfo[index];
            if (member.id === myInfo?.id) continue;
            handleCreateOffer(channel, member?.peerConnection, myInfo, myMediaStream, roomID, member);
        }
    }, [channel, myInfo, membersInfo, myMediaStream, roomID, location]);

    const handleEndedCall = () => {
        if (setIsEndedCall) setIsEndedCall(true);
    };

    return {
        acceptOffer,
        onFinishForm,
        formSubmitType,
        setFormSubmitType,
        handleEndedCall,
        // handleToggleStreamers,
    }
};