export type validateStatus = "" | "success" | "warning" | "error" | "validating" | undefined;

export interface ProfileSettingInterface { username: string, keepUsername: boolean };

export interface UserInfoInterface {
    id?: string,
    username?: string,
    keepUsername?: boolean,
    isHost?: boolean,
    kind?: string,
    peerConnection?: RTCPeerConnection | undefined,
};

interface IceServer {
    urls: string | string[],
    credential?: string,
    username?: string
};

export interface PeerConfigInterface {
    iceServers: IceServer[],
};

export interface SDPInterface {
    answerFrom?: UserInfoInterface,
    offerFor?: UserInfoInterface,
    offerFrom?: UserInfoInterface,
    candidates?: RTCIceCandidate[] | [],
    myInfo?: UserInfoInterface, 
    isRequestReceive?: boolean,
    isOfferAccepted?: false,
    sdpOffer?: RTCSessionDescription,
    sdpAnswer?: RTCSessionDescriptionInit,
    roomID?: string
};

export interface ParticipantsStreamsInterface extends UserInfoInterface {
    remoteStream: MediaStream
};

interface Member {
    username: string;
    isHost: boolean;
};

interface Me {
    id: string;
    info: Member;
};

export interface ChannelMembers {
    members: {
        [key: string]: Member;
    };
    count: number;
    myID: string;
    me: Me;
};

export interface AddedRemovedMember {
    id: string,
    info: Member
};

export interface NotifButtonInterface { 
    candidateID?: string,
    selectedOffer: SDPInterface,
};

export interface VideoControlButton {
    streamerData: ParticipantsStreamsInterface
};

export interface VideoControlsInterface {
    videoEnable: boolean,
    audioEnable: boolean
};