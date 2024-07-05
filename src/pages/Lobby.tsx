import { useContext, useEffect, useRef } from "react";
import { MeetRoomContext } from "../context/createContext";
import { useMeetHook } from "../hooks/useMeetHook";

import { Form, Spin } from "antd";
import { MyButton, SimpleInputForm } from "../_components";
import { BsMic, BsMicMute, BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import styles from "../_styles/Lobby.module.css";

export const Lobby = () => {
    const [form] = Form.useForm();
    const myStreamRef = useRef<HTMLVideoElement | null>(null);

    const {
        isLoading,
        roomID,
        myMediaStream,
        setMyMediaStream,
        handleToggleOwnStream
    } = useContext(MeetRoomContext);

    const {
        onFinishForm,
        formSubmitType,
        setFormSubmitType
    } = useMeetHook();

    useEffect(() => {
        (async () => {
            try {
                let currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMyMediaStream(currentStream);
                if (myStreamRef.current) myStreamRef.current.srcObject = currentStream;
            } catch (error) {
                console.error("\nError set Media stream: \n", error);
            }
        })()
    }, []);

    useEffect(() => {
        if (!myMediaStream) return;
        if (myStreamRef.current) myStreamRef.current.srcObject = myMediaStream;
    }, [myMediaStream, myStreamRef.current]);

    return (
        <>
        <Spin fullscreen={true} spinning={myMediaStream === null ? true : false} />
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.videoContainer}>
                    <video playsInline autoPlay muted={true} ref={myStreamRef} />
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
                    </div>
                </div>
                
                <div className={styles.formContainer}>
                    <div>
                        <span>Profile Setting</span>
                    </div>
                    <div>
                        <Form
                            form={form}
                            layout="vertical"
                            wrapperCol={{ span: 24 }}
                            style={{ width: "100%" }}
                            onFinish={(values) => onFinishForm(values, formSubmitType)}
                        >
                            <SimpleInputForm 
                                label="Username"
                                name="username"
                                isRulesRequired={true}
                            />
                            <MyButton
                                block
                                colorType="success"
                                text="Create Room"
                                htmlType="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                onClick={() => setFormSubmitType("create")}
                            />
                            <MyButton 
                                block
                                colorType="info"
                                text="Join Room"
                                htmlType="submit"
                                loading={isLoading}
                                disabled={isLoading}
                                onClick={() => setFormSubmitType("join")}
                                style={{ display: roomID !== "" ? "inlineBlock" : "none", marginTop: 10 }}
                            />
                        </Form>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};