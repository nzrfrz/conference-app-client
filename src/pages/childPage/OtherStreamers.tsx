import { useContext, useMemo } from "react";
import { GlobalContext, MeetRoomContext } from "../../context/createContext";

import { Avatar, Badge, Dropdown } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { OffScreenStreamers } from "../../_components";

import styles from "../../_styles/MeetRoom.module.css";

export const OtherStreamers = () => {

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

    // streamer off the screen
    const offScreenStreamers = useMemo(() => {
        return participantsStreams?.slice(onScreenWidthMaxStreamers, participantsStreams.length);
    }, [participantsStreams, onScreenWidthMaxStreamers]);

    return (
        <>
        {
            offScreenStreamers && offScreenStreamers?.length >= 1 &&
            <Dropdown
                menu={{}}
                trigger={['click']}
                dropdownRender={() => {
                    return (
                        <OffScreenStreamers
                            streamers={offScreenStreamers}
                        />
                    )
                }}
            >
                <Badge className={styles.badge} count={offScreenStreamers?.length}>
                    <Avatar size={40} shape="circle" icon={<UserOutlined />} />
                </Badge>
            </Dropdown>
        }
        </>
    )
};