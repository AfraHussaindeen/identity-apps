/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import FormControl from "@oxygen-ui/react/FormControl";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import capitalize from "lodash-es/capitalize";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, HTMLAttributes, ReactElement, useEffect, useState } from "react";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import { Base, FieldKey, FieldValue } from "../../models/base";

/**
 * Props interface of {@link ElementProperties}
 */
export type ElementPropertiesPropsInterface = IdentifiableComponentInterface & HTMLAttributes<HTMLDivElement>;

/**
 * Component to generate the properties panel for the selected element.
 *
 * @param props - Props injected to the component.
 * @returns The ElementProperties component.
 */
const ElementProperties: FunctionComponent<ElementPropertiesPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-element-properties",
    ...rest
}: ElementPropertiesPropsInterface): ReactElement => {
    const { lastInteractedElement, ElementPropertiesFactory } = useAuthenticationFlowBuilderCore();

    const hasVariants: boolean = !isEmpty(lastInteractedElement?.variants);

    const [ selectedVariant, setSelectedVariant ] = useState<Base>(null);

    useEffect(() => {
        if (hasVariants) {
            setSelectedVariant(lastInteractedElement?.variants?.[0]);
        } else {
            setSelectedVariant(lastInteractedElement);
        }
    } , [ lastInteractedElement ]);

    const changeSelectedVariant = (selected: string) => {
        setSelectedVariant(lastInteractedElement?.variants?.find((element: Base) => element.variant === selected));
    };

    return (
        <div className="authentication-flow-builder-element-properties" data-componentid={ componentId } { ...rest }>
            { lastInteractedElement ? (
                <Stack gap={ 1 }>
                    { hasVariants && (
                        <FormControl size="small" variant="outlined">
                            <Select
                                labelId={ `${selectedVariant?.variant}-variants` }
                                id={ `${selectedVariant?.variant}-variants` }
                                value={ selectedVariant?.variant }
                                label="variant"
                                onChange={ event => changeSelectedVariant(event.target.value as string) }
                            >
                                { lastInteractedElement?.variants?.map((element: Base) => (
                                    <MenuItem key={ element?.variant } value={ element?.variant }>
                                        { capitalize(element?.display?.label) }
                                    </MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                    ) }
                    { selectedVariant && Object.entries(selectedVariant?.config?.field).map(([ key, value ]: [FieldKey, FieldValue]) => {
                        return (
                            <ElementPropertiesFactory
                                element={ selectedVariant }
                                key={ key }
                                propertyKey={ key }
                                propertyValue={ value }
                            />
                        );
                    }) }
                </Stack>
            ) : (
                <Typography variant="body2" color="textSecondary" sx={ { padding: 2 } }>
                    No properties available.
                </Typography>
            ) }
        </div>
    );
};

export default ElementProperties;
