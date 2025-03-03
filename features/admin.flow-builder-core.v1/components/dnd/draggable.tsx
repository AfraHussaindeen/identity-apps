/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { UseDraggableInput, useDraggable } from "@dnd-kit/react";
import Box from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC, PropsWithChildren, ReactElement } from "react";

/**
 * Props interface of {@link Draggable}
 */
export type DraggableProps = UseDraggableInput & IdentifiableComponentInterface & any;

/**
 * Draggable component.
 *
 * @param props - Props injected to the component.
 * @returns Draggable component.
 */
const Draggable: FC<PropsWithChildren<DraggableProps>> = ({
    "data-componentid": componentId = "draggable",
    id,
    children,
    ...rest
}: PropsWithChildren<DraggableProps>): ReactElement => {
    const { ref } = useDraggable({
        id,
        ...rest
    });

    return (
        <Box ref={ ref } data-componentid={ componentId } sx={ { height: "100%", width: "100%" } }>
            { children }
        </Box>
    );
};

export default Draggable;
