/**
 * (c) 2021, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
    Button,
    ButtonGroup,
    HStack,
    Menu,
    MenuItem,
    MenuList,
    Portal,
    ThemeTypings,
    Tooltip,
} from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { RiRunFill, RiPlayFill } from "react-icons/ri";
import { FormattedMessage, useIntl } from "react-intl";
import { zIndexAboveTerminal } from "../common/zIndex";
import { ConnectionAction, ConnectionStatus } from "../device/device";
import { useConnectionStatus } from "../device/device-hooks";
import MoreMenuButton from "./MoreMenuButton";
import { useProjectActions } from "./project-hooks";

interface RunButtonProps {
    size?: ThemeTypings["components"]["Button"]["sizes"];
}

const RunButton = ({ size }: RunButtonProps) => {
    const actions = useProjectActions();
    const intl = useIntl();
    const handleRun = useCallback(async () => {
        try {
            await actions.run();
        } finally {
            console.log("Finished execution");
        }
    }, []);
    return (
        <HStack>
            <Menu>
                <ButtonGroup isAttached>
                    <Tooltip
                        hasArrow
                        placement="top-start"
                        label={intl.formatMessage({
                            id: "run-hover",
                        })}
                    >
                        <Button
                            size="lg"
                            variant="solid"
                            leftIcon={<RiPlayFill />}
                            onClick={handleRun}
                        >
                            <FormattedMessage id="run-action" />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Menu>
        </HStack>
    );
};

export default RunButton;
