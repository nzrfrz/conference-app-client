import { useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext, MeetRoomContext } from "./createContext"
import { 
    AddedRemovedMember, 
    ChannelMembers, 
    SDPInterface, 
    ParticipantsStreamsInterface, 
    PeerConfigInterface, 
    UserInfoInterface, 
    handleNonHostAnswer,
    VideoControlsInterface
} from "../_helpers";

import * as PusherTypes from "pusher-js";
import { useNavigate } from "react-router-dom";

export const MeetRoomContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const navigateTo = useNavigate();

    const [peerConfig] = useState<PeerConfigInterface>({
        iceServers: [
            {
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                    'stun:stun3.l.google.com:19302',
                    'stun:stun4.l.google.com:19302',
                ]
            },
            {
                urls: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            },
            {
                urls: 'turn:192.158.29.39:3487?transport=udp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
            }
        ]
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [roomID, setRoomID] = useState<string>("");
    const [myMediaStream, setMyMediaStream] = useState<MediaStream | null>(null);
    const [channel, setChannel] = useState<PusherTypes.PresenceChannel | null>(null);
    const [isEndedCall, setIsEndedCall] = useState<boolean>(false);
    const [videoControls, setVideoControls] = useState<VideoControlsInterface | undefined>({
        audioEnable: true,
        videoEnable: true
    });

    const [myInfo, setMyInfo] = useState<UserInfoInterface | undefined>(undefined);
    const [membersInfo, setMembersInfo] = useState<UserInfoInterface[] | []>([]);
    const [offerForHost, setOfferForHost] = useState<SDPInterface[] | []>([]);
    const [offerForNonHost, setOfferForNonHost] = useState<SDPInterface[] | []>([]);
    const [nonHostAnswers, setNonHostAnswers] = useState<SDPInterface[] | []>([]);
    const [participantsStreams, setParticipantsStreams] = useState<ParticipantsStreamsInterface[] | []>([]);
    const [tempRemoteStreams, setTempRemoteStreams] = useState<ParticipantsStreamsInterface | undefined>(undefined);

    const { openNotification } = useContext(GlobalContext);

    // console.log("\my info: \n", myInfo);
    // console.log("\nmembers: \n", membersInfo);
    // console.log("\nparticipants streams: \n", participantsStreams);
    // console.log("\noffer for host: \n", offerForHost);
    // console.log("\noffer for non-host: \n", offerForNonHost);
    // console.log("\nmedia stream: \n", myMediaStream?.getTracks());
    // console.log("\nnon host answers: \n", nonHostAnswers);
    // console.log("\nended call: \n", isEndedCall);
    // console.log("\ntemp remote stream: \n", tempRemoteStreams);
    // console.log("\nvideo controls: \n", videoControls);

    useEffect(() => {
        if (isEndedCall === false) return;
        navigateTo("/", { replace: true });
        setRoomID("");
        window.location.reload();
    }, [isEndedCall]);

    useEffect(() => {
        if (!channel) return;

        channel.bind("pusher:subscription_succeeded", (members: ChannelMembers) => {
            // console.log("\nSubs Succeeded: \n", members?.members);
            const myInfo = {
                id: members.me.id,
                isHost: members.me.info.isHost,
                username: members.me.info.username,
            };
            const membersInfo = Object.entries(members?.members).map(([id, userInfo]) => {
                return {
                    id,
                    isHost: userInfo.isHost,
                    username: userInfo.username,
                    peerConnection: id !== myInfo.id ? new RTCPeerConnection(peerConfig) : undefined
                }
            });
            setMyInfo({ ...myInfo });
            setMembersInfo((prevValues: UserInfoInterface[]) => { return [ ...prevValues, ...membersInfo ] });
        });

        channel.bind("pusher:member_added", (member: AddedRemovedMember) => {
            // console.log("\nAdded Member: \n", member);
            const memberInfo = {
                id: member.id,
                isHost: member.info.isHost,
                username: member.info.username
            };
            setMembersInfo((prevValues: UserInfoInterface[]) => { return [ ...prevValues, { ...memberInfo, peerConnection: new RTCPeerConnection(peerConfig) } ] });
        });

        channel.bind("pusher:member_removed", (member: AddedRemovedMember) => {
            // console.log("\nRemoved Member: \n", member);
            if (member?.info?.isHost === true) {
                if (membersInfo?.length > 0) {
                    for (let index = 0; index < membersInfo.length; index++) {
                        const member = membersInfo[index];
                        if (!member?.peerConnection) return;
                        member?.peerConnection.close();
                    }
                }
                setMembersInfo([]);
                navigateTo("/", { replace: true });
                setRoomID("");
                window.location.reload();
                // navigateTo(-1);
            }

            setMembersInfo((prevValues) => {
                return prevValues.filter((data) => data.id !== member.id)
            });

            setOfferForHost((prevValues) => {
                return prevValues.filter((data) => data.offerFrom?.id !== member.id)
            });

            setParticipantsStreams((prevValues) => {
                return prevValues.filter((data) => data?.id !== member.id)
            });

            openNotification(
                "info",
                member?.id,
                "Info",
                `${member.info.username} has left the room`,
                undefined,
                true,
                2000,
            );
        });

        return () => {
            channel.unsubscribe();
        };
    }, [channel]);

    // host receive sdp (offer) from new candidate
    useEffect(() => {
        channel?.bind("client-sdp", (message: SDPInterface) => {
            // console.warn("\nsdp received: \n", message);
            if (message.offerFor?.isHost === true) return setOfferForHost((prevValues: SDPInterface[]) => {
                return [
                    ...prevValues,
                    // { ...message, isRequestReceive: true, isOfferAccepted: false }
                    { ...message, isRequestReceive: true }
                ]
            });
            if (message.offerFor?.id === myInfo?.id) return setOfferForNonHost((prevValues: SDPInterface[]) => {
                return [
                    ...prevValues,
                    { ...message }
                ]
            });
        });
    }, [channel, myInfo]);

    // new candidate offer rejected by host
    useEffect(() => {
        if (!channel) return;

        channel.bind("client-offerRejected", (message: SDPInterface) => {
            if (message.offerFrom?.id !== myInfo?.id) return;
            channel.unsubscribe();
            window.location.reload();
        });        
    }, [channel, myInfo]);

    // any candidate accepted by host
    useEffect(() => {
        if (!channel || membersInfo.length === 0 || !myInfo || !myMediaStream) return;     
        channel.bind("client-hostAcceptCandidate", async (message: SDPInterface) => {
            // console.warn("\nany candidate accepted by host: \n", message);
            try {
                const peerForHost = membersInfo.find((member: any) => member.isHost === true);

                if (message?.myInfo?.id === myInfo.id) {
                    await peerForHost?.peerConnection?.setRemoteDescription(message?.sdpAnswer as RTCSessionDescriptionInit);
                    if (message.candidates) for (let index = 0; index < message?.candidates?.length; index++) {
                        const candidate = message?.candidates[index];
                        await peerForHost?.peerConnection?.addIceCandidate(candidate);
                    }
                    navigateTo(`/meet-room/${roomID}`, { replace: true });
                    setIsLoading(false);
                }
                else if (peerForHost?.peerConnection?.signalingState === "stable" || message?.myInfo?.id !== myInfo.id) {
                    const selectedPeer = membersInfo.find((member: UserInfoInterface) => member.id === message.myInfo?.id);
                    const selectedNonHostOffer = offerForNonHost.find((offer: SDPInterface) => offer.offerFrom?.id === message.myInfo?.id);
                    handleNonHostAnswer(channel, selectedPeer?.peerConnection, myMediaStream, selectedNonHostOffer as SDPInterface);
                    // console.warn("\nother peer candidate: \n", selectedPeer);
                    // console.warn("\nother candidate offer: \n", selectedNonHostOffer);
                }
            } catch (error) {
                console.error("\error HOST answering new candidate: \n", error);
            }
        });
    }, [channel, membersInfo, myInfo, offerForNonHost]);

    // store answers from non-host participant
    useEffect(() => {
        if (!channel || !myInfo) return;

        channel.bind("client-nonHostAcceptCandidate", async (message: SDPInterface) => {
            // console.warn("\nnon-host accept candidate: \n", message);
            if (message?.myInfo?.id !== myInfo.id) return;
            setNonHostAnswers((prevValues: SDPInterface[]) => {
                return [ ...prevValues, { ...message } ];
            });
        });
    }, [channel, myInfo]);

    // prevent multiple answers from non-host participant
    const uniqueAnswerers = useMemo(() => {
        if (nonHostAnswers?.length === 0) return;  

        return nonHostAnswers.filter((item: SDPInterface, index: number) => {
            const hasDuplicate = nonHostAnswers.some((otherItem: any, otherIndex: any) => otherIndex < index && otherItem.answerFrom.id === item?.answerFrom?.id);
            return !hasDuplicate;
        });
    }, [nonHostAnswers]); 

    // set remote description for non-host participant from nonHostAnswers
    useEffect(() => {
        if (membersInfo?.length === 0 || uniqueAnswerers?.length === 0) return;

        const membersPeer = membersInfo.filter((member: UserInfoInterface) => member?.peerConnection !== undefined && member.peerConnection.signalingState !== "stable");
        // console.warn("\nset remote description for non-host: \n", membersPeer);
        (async () => {
            for (let i = 0; i < membersPeer?.length; i++) {
                const member = membersPeer[i];
                if (member?.peerConnection?.signalingState === "stable") break;
                // console.warn("\nnon-host peer connection: \n", member);
                const matchingAnswer = uniqueAnswerers?.find((answer: SDPInterface) => answer?.answerFrom?.id === member.id);
                // console.warn("\nnon-host matching answer: \n", matchingAnswer);
                if (!matchingAnswer) continue;
            
                try {
                    if (!matchingAnswer.candidates) return;
                    await member?.peerConnection?.setRemoteDescription(matchingAnswer?.sdpAnswer as RTCSessionDescription);
                    for (let j = 0; j < matchingAnswer.candidates?.length; j++) {
                        const candidate = matchingAnswer?.candidates[j];
                        await member?.peerConnection?.addIceCandidate(candidate);
                    }
                    // console.warn("\nset RDP for non-host participant SUCCESS: \n", matchingAnswer);
                } catch (error) {
                    console.error("\nset RDP for non-host participant ERROR: \n", error);
                }
            }
        })();
    }, [membersInfo, uniqueAnswerers]);

    // pool all streams from accepted candidate
    useEffect(() => {
        if (membersInfo?.length === 0) return;
        
        for (let index = 0; index < membersInfo.length; index++) {
            const member = membersInfo[index];
            if (member.peerConnection === undefined) continue;
            member.peerConnection.ontrack = (event: RTCTrackEvent) => {
                if (!event.streams) return;
                let streamTrack = event.streams[0];
                // console.log("\non-track event: \n", event.streams[0].getTracks());
                setTempRemoteStreams({ ...member, remoteStream: streamTrack });
            }
        };
    }, [membersInfo, videoControls]);

    useEffect(() => {
        if (!tempRemoteStreams) return;
        setParticipantsStreams((prevValues: ParticipantsStreamsInterface[]) => {
            return [ ...prevValues, { ...tempRemoteStreams }];
        });
    }, [tempRemoteStreams]);
    
    // remove candidate offer from offerForHost when candidate is accepted
    useEffect(() => {
        if (participantsStreams.length === 0) return;

        const acceptedParticipantsID = participantsStreams.map((participant) => participant.id);
        setOfferForHost((prevValues) => {
            return prevValues.filter((data) => !acceptedParticipantsID.includes(data.offerFrom?.id));
        });
    }, [participantsStreams]);

    const handleToggleOwnStream = (kind: string) => {
        setMyMediaStream((prevValues: MediaStream | null) => {
            const track = myMediaStream?.getTracks().find(track => track.kind === kind);
            if (track)  {            
                track.enabled = !track?.enabled;
                setVideoControls({ audioEnable: true, videoEnable: track.enabled });
            }
            return prevValues;
        });
    };

    const contextValues = {
        isLoading, 
        setIsLoading,
        roomID,
        setRoomID,
        channel,
        setChannel,
        isEndedCall,
        setIsEndedCall,
        myInfo,
        membersInfo,
        offerForHost,
        myMediaStream,
        setMyMediaStream,
        participantsStreams,
        setParticipantsStreams,
        setVideoControls,
        handleToggleOwnStream,
    };

    return (
        <MeetRoomContext.Provider value={contextValues}>
            {children}
        </MeetRoomContext.Provider>
    );
};