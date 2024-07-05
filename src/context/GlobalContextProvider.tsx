import { GlobalContext, notificationType, windowsDimensionData } from "./createContext";

import {
    theme,
    notification,
    ConfigProvider
} from "antd";
import {
    themeToken,
    themeComponents
} from "../themeToken";
import { useEffect, useState } from "react";

export const GlobalContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const { defaultAlgorithm, darkAlgorithm } = theme;

    const [stackEnabled] = useState<boolean>(true);
    const [threshold] = useState<number>(2);
    const [api, contextHolder] = notification.useNotification({
        stack: stackEnabled ? { threshold, } : false,
    });

    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [windowDimension, setWindowDimension] = useState<windowsDimensionData>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const openNotification = (
        type: notificationType,
        key: string,
        message: string,
        description: string,
        customButton: React.ReactNode,
        closable: boolean,
        duration: number,
    ) => {
        api[type]({
            key,
            message,
            description,
            btn: customButton,
            placement: "topRight",
            closable,
            duration,
        })
    };

    const getWindowSize = () => {
        setWindowDimension({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    useEffect(() => {
        window.addEventListener("resize", getWindowSize);

        return () => {
            window.removeEventListener("resize", getWindowSize)
        }
    }, [window]);

    const contextValues: any = {
        api,
        isDarkMode,
        setIsDarkMode,
        windowDimension,
        openNotification
    };

    return (
        <GlobalContext.Provider value={contextValues}>
            <ConfigProvider
                theme={{
                    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
                    token: themeToken(isDarkMode),
                    ...themeComponents()
                }}
            >
                {contextHolder}
                {children}
            </ConfigProvider>
        </GlobalContext.Provider>
    );
};