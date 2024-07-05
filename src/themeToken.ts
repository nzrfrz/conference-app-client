export const themeToken = (isDarkMode: boolean): Record<string, any> => {
    return {
        fontFamily: "Poppins",
        colorBgLayout: isDarkMode === true ? "#0F172A" : "#E5edee",
        colorBgElevated: isDarkMode === true ? "#1F2937" : "#F1F5F9",
        colorBgContainer: isDarkMode === true ? "#334155" : "#F1F5F9",
        boxShadow: isDarkMode === true ? "0 6px 16px 0 rgba(255, 255, 255, 0.08), 0 3px 6px -4px rgba(255, 255, 255, 0.12), 0 9px 28px 8px rgba(255, 255, 255, 0.05)" : "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        boxShadowCard: isDarkMode === true ? "0 1px 2px -2px rgba(255, 255, 255, 1), 0 3px 6px 0 rgba(255, 255, 255, 0.1), 0 5px 12px 4px rgba(255, 255, 255, 0.1)" : "0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)",
        colorPrimary: '#0891b2',
        colorSuccess: '#16a34a',
        colorWarning: '#ea580c',
        colorError: '#e11d48',
        colorInfo: '#0284c7',
        borderRadius: 10,
    };
};

export const themeComponents = (): Record<string, any> => {
    return {
        components: {
            Layout: {
                siderBg: "#334155",
                headerBg: "#334155",
            },
            Form: {
                verticalLabelPadding: "0 0 0"
            },
            Menu: {
                darkItemHoverBg: "rgba(8, 145, 178, .2)",
                darkSubMenuItemBg: "transparent",
                darkPopupBg: "#334155",
                darkItemBg: "transparent",
                subMenuItemBorderRadius: 10,
            },
            Typography: {
                titleMarginBottom: 25,
                titleMarginTop: 0
            },
            Divider: {
                verticalMarginInline: "0"
            }
        }
    };
};