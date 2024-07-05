import { Outlet } from "react-router-dom";
import { GlobalContext } from "../context/createContext";

import { Layout } from "antd";
import { useContext } from "react";
const { Content } = Layout;

export const GlobalLayout = () => {
    const { windowDimension } = useContext(GlobalContext);

    return (
        <Layout style={{ width: "100%", height: windowDimension.height }}>
            <Content style={{ height: "100%" }}>
                <Outlet />
            </Content>
        </Layout>
    );
};