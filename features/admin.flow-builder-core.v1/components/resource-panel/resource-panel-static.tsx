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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import ResourcePanelItem, { ResourcePanelItemProps } from "./resource-panel-item";

/**
 * Props interface of {@link ResourcePanelStatic}
 */
export type ResourcePanelStaticPropsInterface = ResourcePanelItemProps &
    IdentifiableComponentInterface &
    Omit<HTMLAttributes<HTMLDivElement>, "resource">;

/**
 * Static item for the resource panel.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePanelStatic component.
 */
const ResourcePanelStatic: FunctionComponent<ResourcePanelStaticPropsInterface> = ({
    "data-componentid": componentId = "resource-panel-draggable-item",
    id,
    resource,
    type = "static",
    ...rest
}: ResourcePanelStaticPropsInterface): ReactElement => (
    <ResourcePanelItem id={ id } resource={ resource } data-componentid={ componentId } type={ type } { ...rest } />
);

export default ResourcePanelStatic;
