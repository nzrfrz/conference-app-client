import * as PusherTypes from "pusher-js";
import { SDPInterface, UserInfoInterface } from "./typeInterfaces";

export const handleCreateOffer = async (
    channel: PusherTypes.PresenceChannel,
    peerConnection: RTCPeerConnection | undefined,
    myInfo: UserInfoInterface | undefined,
    myMediaStream: MediaStream | null,
    roomID: string,
    offerFor: UserInfoInterface
) => {
    try {
        // console.log("---------- handle create offer ----------");

        await addTrackPromise(peerConnection as RTCPeerConnection, myMediaStream as MediaStream);

        const offer = await peerConnection?.createOffer();
        // console.log("\nSUCCESS create offer: \n", offer);

        peerConnection?.setLocalDescription(offer);
        // console.log("\nSUCCESS create offer set LDP: \n");

        const results = {
            offerFor: { ...offerFor },
            offerFrom: {
                id: myInfo?.id,
                username: myInfo?.username,
                isHost: myInfo?.isHost
            },
            sdpOffer: offer,
            roomID: roomID
        };

        channel.trigger("client-sdp", results);
        // console.warn("\ncreate offer results: \n", results);
    } catch (error) {
        console.error("\nERROR create offer: \n", error);
    }
};

export const handleCreateAnswer = async (
    channel: PusherTypes.PresenceChannel,
    peerConnection: RTCPeerConnection | undefined,
    myMediaStream: MediaStream | null,
    offerer: SDPInterface
) => {
    if (!peerConnection || !channel || !myMediaStream) return;

    try {      
        await addTrackPromise(peerConnection as RTCPeerConnection, myMediaStream as MediaStream);

        const sessionDesc = new RTCSessionDescription(offerer?.sdpOffer as RTCSessionDescription);
        await peerConnection.setRemoteDescription(sessionDesc);
        // console.log("\nsuccess set remote desc: \n", sessionDesc);

        const answer = await peerConnection.createAnswer();
        // console.log("\nsuccess answer offer: \n", answer);

        peerConnection.setLocalDescription(answer);
        // console.log("\nsuccess set local desc: \n");

        const candidates = await getIceCandidatesPromise(peerConnection);
        // console.log("\nsuccess set candidates: \n", candidates);

        const results = {
            answerFrom: offerer?.offerFor,
            myInfo: offerer?.offerFrom,
            candidates,
            sdpAnswer: answer,
        };
        // console.log("\nsuccess create answer: \n", results);
        channel.trigger("client-hostAcceptCandidate", results);
    } catch (error) {
        console.error("\nerror creating answer: \n", error);
    }
};

export const handleNonHostAnswer = async (
    channel: PusherTypes.PresenceChannel,
    peerConnection: RTCPeerConnection | undefined,
    myMediaStream: MediaStream | null,
    offerer: SDPInterface
) => {
    if (!peerConnection || !channel || !myMediaStream || !offerer) return;

    try {
        await addTrackPromise(peerConnection as RTCPeerConnection, myMediaStream as MediaStream);

        await peerConnection.setRemoteDescription(offerer.sdpOffer as RTCSessionDescription);
        // console.log("\nsuccess set non host remote desc: \n");

        const answer = await peerConnection.createAnswer();
        // console.log("\nsuccess answer non host offer: \n", answer);

        peerConnection.setLocalDescription(answer);
        // console.log("\nsuccess set non host local desc: \n");

        const candidates = await getIceCandidatesPromise(peerConnection);

        const results = {
            answerFrom: offerer.offerFor,
            myInfo: offerer.offerFrom,
            candidates,
            sdpAnswer: answer
        };
        // console.warn("\nnon-host create answer results: \n", results);
        channel.trigger("client-nonHostAcceptCandidate", results);
    } catch (error) {
        console.error("\nerror creating answer: \n", error);
    }
};

const addTrackPromise = (peerConnection: RTCPeerConnection, mediaStream: MediaStream) => {
    return new Promise((resolve, reject) => {
        let tracks = []
        mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
            // console.log("\nadd track promise: \n", track, mediaStream.getTracks());
            tracks.push(track);
            peerConnection.addTrack(track, mediaStream);
        });
        if (tracks.length >= 2) return resolve("add track success");
        else return reject("error adding track");
    });
};

const getIceCandidatesPromise = (newPeerConnection: RTCPeerConnection) => {
    return new Promise((resolve, reject) => {
        let candidates: RTCIceCandidate[] = [];

        newPeerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            // console.log("\ncandidate promise: \n", event); 
            if (event.candidate) candidates.push(event.candidate);
        };

        setTimeout(() => {
            // console.log("\nice promise peer: \n", candidates.length);
            if (candidates.length > 1) return resolve(candidates);
        }, 500);

        newPeerConnection.oniceconnectionstatechange = () => {
            if (!newPeerConnection) reject(new Error('peerConnection became undefined or null'));
            newPeerConnection.onicecandidate = null;
        };
    });
};