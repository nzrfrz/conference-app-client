import { createContext } from "react";
import * as PusherTypes from "pusher-js";
import { SDPInterface, ParticipantsStreamsInterface, UserInfoInterface, VideoControlsInterface } from "../_helpers";

export type notificationType = "success" | "info" | "warning" | "error";
export type windowsDimensionData = { width: number, height: number };

export interface NotificationPropsInterface {
    type: notificationType, 
    key: string, 
    message: string, 
    description: string, 
    customButton: React.ReactNode
    cloasble: boolean,
    duration: number,
};

export interface GlobalContextInterface {
    api: any,
    isDarkMode: boolean,
    setIsDarkMode : (isDarkMode: boolean) => void,
    windowDimension: windowsDimensionData,
    openNotification: (type: notificationType, key: string, message: string, description: string, customButton: React.ReactNode | undefined, closable: boolean, duration: number) => void | undefined,
};

export interface MeetRoomContextInterface {
    isLoading?: boolean,
    setIsLoading?: (isLoading: boolean) => void,
    roomID: string,
    setRoomID: (roomID: string) => void,
    channel?: PusherTypes.PresenceChannel | null,
    setChannel: (channel: PusherTypes.PresenceChannel) => void,
    isEndedCall?: boolean, 
    setIsEndedCall?: (isEndedCall: boolean) => void,
    myInfo?: UserInfoInterface | undefined,
    setMyInfo?: (myInfo: UserInfoInterface) => void,
    membersInfo: UserInfoInterface[],
    setMembersInfo?: (membersInfo: UserInfoInterface[]) => void,
    myMediaStream: MediaStream | null,
    setMyMediaStream: (myMediaStream: MediaStream) => void,
    offerForHost?: SDPInterface[] | [],
    setOfferForHost?: any,
    participantsStreams?: ParticipantsStreamsInterface[],
    setParticipantsStreams: (value: (participantsStreams: ParticipantsStreamsInterface[]) => ParticipantsStreamsInterface[]) => void,
    videoControls?: VideoControlsInterface | undefined,
    setVideoControls?: (videoControls: VideoControlsInterface) => void,
    handleToggleOwnStream: (kind: string) => void,
    tempRemoteStreams?: ParticipantsStreamsInterface | undefined,
};

const initialGlobalContextValue = {
    api: undefined,
    isDarkMode: false,
    setIsDarkMode : () => {},
    windowDimension: { width: 0, height: 0 },
    openNotification: () => {},
};

const initialMeetRoomContextValue: MeetRoomContextInterface = {
    isLoading: false,
    setIsLoading: () => {},
    roomID: "",
    setRoomID: () => {},
    channel: null,
    setChannel: () => {},
    isEndedCall: false, 
    setIsEndedCall: () => {},
    myInfo: undefined,
    setMyInfo: () => {},
    membersInfo: [],
    setMembersInfo: () => {},
    myMediaStream: null,
    setMyMediaStream: () => {},
    offerForHost: undefined,
    setOfferForHost: () => {},
    participantsStreams: [],
    setParticipantsStreams: () => {},
    setVideoControls: () => {},
    handleToggleOwnStream: () => {},
    tempRemoteStreams: undefined
};

export const GlobalContext = createContext<GlobalContextInterface>(initialGlobalContextValue);
export const MeetRoomContext = createContext<MeetRoomContextInterface>(initialMeetRoomContextValue);