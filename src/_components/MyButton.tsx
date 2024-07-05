
import {
    Button,
    ConfigProvider
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useMemo } from "react";

type Shape = "default" | "circle" | "round" | undefined;
type HTMLType = "button" | "submit" | "reset" | undefined;
type ColorType = "success" | "warning" | "error" | "info" | "default";

interface MyButton {
    text?: React.ReactNode | string,
    size?: SizeType,
    shape?: Shape,
    block?: boolean,
    loading?: boolean,
    disabled?: boolean,
    htmlType?: HTMLType,
    colorType?: ColorType,
    icon?: React.ReactNode,
    style?: React.CSSProperties,
    onClick?: React.MouseEventHandler<HTMLElement>,
};

export const MyButton: React.FC<MyButton> = ({
    text,
    size = "large",
    shape,
    block,
    loading,
    disabled,
    htmlType,
    colorType,
    icon,
    style,
    onClick,
}) => {

    const themeToken = useMemo(() => {
        switch (true) {
            case colorType === "success":
                return {
                    colorPrimary: "#16a34a",
                    colorPrimaryHover: "#007E33",
                    colorPrimaryActive: "rgba(0, 126, 51, .5)"
                };
            case colorType === "warning":
                return {
                    colorPrimary: "#ffbb33",
                    colorPrimaryHover: "#FF8800",
                    colorPrimaryActive: "rgba(255, 126, 0, .5)"
                };
            case colorType === "error":
                return {
                    colorPrimary: "#ff4444",
                    colorPrimaryHover: "#CC0000",
                    colorPrimaryActive: "rgba(204, 0, 0, .5)"
                };
            case colorType === "info":
                return {
                    colorPrimary: "#0284c7",
                    colorPrimaryHover: "#0099CC",
                    colorPrimaryActive: "rgba(0, 153, 204, .5)"
                };
            default:
                break;
        }
    }, [colorType]);

    return (
        <ConfigProvider
            theme={{
                token: {...themeToken}
            }}
        >
            <Button
                block={block}
                size={size}
                loading={loading}
                shape={shape}
                type={colorType !== "default" ? "primary" : "default"}
                htmlType={htmlType}
                icon={icon}
                style={style}
                disabled={disabled}
                onClick={onClick}
            >
                {text}
            </Button>
        </ConfigProvider>
    )
}