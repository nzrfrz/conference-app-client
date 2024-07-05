
import {Form, Input} from "antd";
import { validateStatus } from "../_helpers";

interface SimpleInputFormInterface {
    name?: string,
    label?: string,
    disabled?: boolean | undefined,
    placeholder?: string,
    hasFeedback?: boolean,
    validateStatus?: validateStatus,
    help?: string,
    requiredMark?: boolean,
    isRulesRequired?: boolean,
    ruleMessage?: string,
    prefix?: string,
    suffix?: string,
    autoFocus?: boolean | undefined
}

export const SimpleInputForm: React.FC<SimpleInputFormInterface> = ({
    name,
    label,
    disabled = undefined,
    placeholder,
    hasFeedback,
    validateStatus,
    help,
    requiredMark,
    isRulesRequired,
    ruleMessage,
    prefix,
    suffix,
    autoFocus,
}) => {
    return (
        <Form.Item
            hasFeedback={hasFeedback}
            name={name}
            label={label}
            required={requiredMark}
            validateStatus={validateStatus}
            help={help}
            rules={[
                {
                    required: isRulesRequired,
                    message: ruleMessage
                }
            ]}
        >
            <Input 
                size="large"
                prefix={prefix}
                suffix={suffix}
                autoComplete="off"
                disabled={disabled}
                autoFocus={autoFocus}
                style={{ width: "100%" }}
                placeholder={placeholder === undefined ? `Input ${label}` : placeholder}
            />
        </Form.Item>
    );
};